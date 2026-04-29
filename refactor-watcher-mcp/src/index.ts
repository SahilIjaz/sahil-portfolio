#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import chokidar, { FSWatcher } from "chokidar";
import { readFile } from "fs/promises";
import path from "path";

// Queue of files needing refactoring
const pendingRefactors = new Set<string>();
const refactoredFiles = new Map<string, number>(); // file -> timestamp
let watcher: FSWatcher | null = null;
let projectPath: string = process.cwd();

// Debounce timers for each file
const debounceTimers = new Map<string, NodeJS.Timeout>();

// Configuration
const DEBOUNCE_MS = 2000; // 2 seconds
const REFACTOR_LOCKOUT_MS = 30000; // 30 seconds - prevent re-refactoring same file
const MAX_FILE_LINES = 500; // Skip files larger than this

// Stats
let stats = {
  filesWatched: 0,
  changeDetected: 0,
  filesQueued: 0,
  filesRefactored: 0,
};

// Helper: Check if file was recently refactored
function wasRecentlyRefactored(filePath: string): boolean {
  const lastRefactorTime = refactoredFiles.get(filePath);
  if (!lastRefactorTime) return false;

  const timeSinceRefactor = Date.now() - lastRefactorTime;
  return timeSinceRefactor < REFACTOR_LOCKOUT_MS;
}

// Helper: Check if file is too large
async function isFileTooLarge(filePath: string): Promise<boolean> {
  try {
    const content = await readFile(filePath, "utf8");
    const lineCount = content.split("\n").length;
    return lineCount > MAX_FILE_LINES;
  } catch (error) {
    return true; // If can't read, consider too large
  }
}

// Helper: Format file path for display
function formatPath(filePath: string): string {
  return path.relative(projectPath, filePath);
}

// Log to stderr (stdout is for MCP protocol)
function log(message: string) {
  console.error(`[Refactor Watcher] ${message}`);
}

// Create and configure server
const server = new Server(
  {
    name: "refactor-watcher",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: "start_watching",
    description:
      "Start watching project files for changes. Files are automatically queued for refactoring after 2 seconds of inactivity.",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description:
            "Path to watch (default: current directory). Watches TypeScript, JavaScript, and React files.",
        },
      },
    },
  },
  {
    name: "get_pending_refactors",
    description:
      "Get list of files with pending changes that need refactoring. Returns file paths and metadata.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "mark_refactored",
    description:
      "Mark files as refactored to remove them from the queue and prevent immediate re-refactoring.",
    inputSchema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string" },
          description: "Array of file paths that were successfully refactored",
        },
      },
      required: ["files"],
    },
  },
  {
    name: "get_stats",
    description:
      "Get statistics about the file watcher including files watched, changes detected, and refactors completed.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "stop_watching",
    description: "Stop watching for file changes.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "start_watching") {
      const watchPath = (args?.path as string) || projectPath;
      projectPath = path.resolve(watchPath);

      // Close existing watcher if any
      if (watcher) {
        await watcher.close();
        log("Closed existing watcher");
      }

      // Create new watcher
      watcher = chokidar.watch(
        [
          `${projectPath}/app/**/*.{ts,tsx,js,jsx}`,
          `${projectPath}/components/**/*.{ts,tsx,js,jsx}`,
          `${projectPath}/lib/**/*.{ts,tsx,js,jsx}`,
          `${projectPath}/hooks/**/*.{ts,tsx,js,jsx}`,
        ],
        {
          ignored: [
            "**/node_modules/**",
            "**/.next/**",
            "**/.git/**",
            "**/*.test.{ts,tsx,js,jsx}",
            "**/*.spec.{ts,tsx,js,jsx}",
            "**/*.backup",
          ],
          persistent: true,
          ignoreInitial: true,
          awaitWriteFinish: {
            stabilityThreshold: 500,
            pollInterval: 100,
          },
        }
      );

      watcher.on("add", (filePath: string) => {
        stats.filesWatched++;
        log(`Now watching: ${formatPath(filePath)}`);
      });

      watcher.on("change", (filePath: string) => {
        stats.changeDetected++;

        // Skip if recently refactored
        if (wasRecentlyRefactored(filePath)) {
          log(`⏭️  Skipping ${formatPath(filePath)} (recently refactored)`);
          return;
        }

        // Clear existing debounce timer
        const existing = debounceTimers.get(filePath);
        if (existing) {
          clearTimeout(existing);
        }

        // Set new debounce timer
        const timer = setTimeout(async () => {
          // Check file size before queueing
          const tooLarge = await isFileTooLarge(filePath);
          if (tooLarge) {
            log(
              `⏭️  Skipping ${formatPath(filePath)} (file too large, max ${MAX_FILE_LINES} lines)`
            );
            return;
          }

          pendingRefactors.add(filePath);
          stats.filesQueued++;
          log(`📝 Queued for refactor: ${formatPath(filePath)}`);
        }, DEBOUNCE_MS);

        debounceTimers.set(filePath, timer);
      });

      watcher.on("error", (error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`Error: ${errorMessage}`);
      });

      log(`Started watching: ${projectPath}`);
      log(`Debounce: ${DEBOUNCE_MS}ms`);
      log(`Lockout: ${REFACTOR_LOCKOUT_MS}ms`);
      log(`Max file size: ${MAX_FILE_LINES} lines`);

      return {
        content: [
          {
            type: "text",
            text: `✅ Started watching ${projectPath}\n\n**Settings:**\n- Debounce: ${DEBOUNCE_MS}ms (waits 2 seconds after you stop typing)\n- Lockout: ${REFACTOR_LOCKOUT_MS}ms (prevents re-refactoring same file for 30 seconds)\n- Max file size: ${MAX_FILE_LINES} lines\n\n**Watching:**\n- app/**/*.{ts,tsx,js,jsx}\n- components/**/*.{ts,tsx,js,jsx}\n- lib/**/*.{ts,tsx,js,jsx}\n- hooks/**/*.{ts,tsx,js,jsx}\n\nFiles will be automatically queued when you save changes!`,
          },
        ],
      };
    }

    if (name === "get_pending_refactors") {
      const files = Array.from(pendingRefactors);

      if (files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "✅ No files pending refactoring.",
            },
          ],
        };
      }

      const fileList = files.map((f) => `- ${formatPath(f)}`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `📋 **${files.length} file(s) pending refactoring:**\n\n${fileList}\n\n**Next steps:**\n1. Review each file for refactoring opportunities\n2. Apply refactorings (better naming, extract functions, add types, etc.)\n3. Call mark_refactored with the file paths when done`,
          },
        ],
      };
    }

    if (name === "mark_refactored") {
      const files = args?.files as string[];

      if (!Array.isArray(files) || files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "❌ Error: 'files' parameter must be a non-empty array of file paths",
            },
          ],
        };
      }

      const timestamp = Date.now();
      let marked = 0;

      for (const file of files) {
        if (pendingRefactors.has(file)) {
          pendingRefactors.delete(file);
          refactoredFiles.set(file, timestamp);
          stats.filesRefactored++;
          marked++;
          log(`✅ Marked as refactored: ${formatPath(file)}`);
        }
      }

      return {
        content: [
          {
            type: "text",
            text: `✅ Marked ${marked} file(s) as refactored.\n\nThese files are now locked for ${REFACTOR_LOCKOUT_MS / 1000} seconds to prevent immediate re-refactoring.`,
          },
        ],
      };
    }

    if (name === "get_stats") {
      const pendingCount = pendingRefactors.size;
      const watcherActive = watcher !== null;

      return {
        content: [
          {
            type: "text",
            text: `📊 **Refactor Watcher Statistics**\n\n**Status:** ${watcherActive ? "🟢 Active" : "🔴 Inactive"}\n**Project:** ${projectPath}\n\n**Totals:**\n- Files watched: ${stats.filesWatched}\n- Changes detected: ${stats.changeDetected}\n- Files queued: ${stats.filesQueued}\n- Files refactored: ${stats.filesRefactored}\n\n**Current:**\n- Pending refactors: ${pendingCount}\n- Lockout period: ${REFACTOR_LOCKOUT_MS / 1000}s\n- Debounce delay: ${DEBOUNCE_MS / 1000}s`,
          },
        ],
      };
    }

    if (name === "stop_watching") {
      if (watcher) {
        await watcher.close();
        watcher = null;
        log("Stopped watching");

        return {
          content: [
            {
              type: "text",
              text: "✅ Stopped watching for file changes.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: "ℹ️  Watcher was not running.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `❌ Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    log(`Error in ${name}: ${errorMessage}`);

    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log("Refactor Watcher MCP Server running on stdio");
  log("Waiting for start_watching command...");
}

main().catch((error) => {
  log(`Fatal error: ${error}`);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  log("Shutting down...");
  if (watcher) {
    watcher.close();
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  log("Received SIGTERM, shutting down...");
  if (watcher) {
    watcher.close();
  }
  process.exit(0);
});
