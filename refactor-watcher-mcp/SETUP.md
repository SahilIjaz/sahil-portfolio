# 🚀 Universal Code Refactoring Agent - Setup Guide

**NO API KEYS REQUIRED** - Uses Claude Code directly!

---

## ✨ What You'll Get

An intelligent refactoring agent that:
- ✅ Watches your code as you type
- ✅ Queues files for refactoring (2-second debounce)
- ✅ Uses **Claude Code** (me!) to refactor - **no API costs**
- ✅ Follows **YOUR custom rules** from `.refactor-rules.md`
- ✅ Works with **any project, any language**
- ✅ **Zero configuration** after initial setup

---

## 📦 Quick Setup (5 Minutes)

### Step 1: Build the MCP Server

```bash
cd refactor-watcher-mcp
npm install
npm run build
```

✅ You should see: `Built successfully!`

### Step 2: Configure Claude Code

Create or edit `~/.claude/settings.json`:

```bash
mkdir -p ~/.claude
nano ~/.claude/settings.json
```

Add this configuration:

```json
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/refactor-watcher-mcp/build/index.js"]
    }
  }
}
```

**⚠️ IMPORTANT:** Replace `/ABSOLUTE/PATH/TO/` with the actual path!

**To get the absolute path:**
```bash
cd refactor-watcher-mcp
pwd
# Copy this path and use it in settings.json
```

**Example (macOS/Linux):**
```json
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["/Users/sahilijaz/Desktop/Ambition/sahil-portfolio/refactor-watcher-mcp/build/index.js"]
    }
  }
}
```

**Example (Windows):**
```json
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["C:\\Users\\sahil\\projects\\refactor-watcher-mcp\\build\\index.js"]
    }
  }
}
```

### Step 3: Verify Installation

Start Claude Code:

```bash
claude
```

In the conversation, type:

```
List all available MCP servers
```

You should see `refactor-watcher` in the list!

---

## 🎯 How to Use

### 1. Start Watching Your Project

In Claude Code conversation:

```
Start watching for file changes in my project
```

I'll respond with confirmation and start monitoring your code!

### 2. Edit Your Code

Make changes to any file in your project. The watcher detects changes after 2 seconds of inactivity.

### 3. Check for Pending Refactors

Anytime you want, ask:

```
Check for pending refactors
```

I'll show you which files changed and are ready for refactoring.

### 4. Refactor with Your Rules

When I find pending files, I'll ask if you want to refactor them. Say:

```
Yes, refactor them using my .refactor-rules.md file
```

I'll:
- Read your custom refactoring rules
- Apply them to each file
- Show you what changed
- Mark files as refactored

### 5. Keep Coding!

The cycle continues automatically. Just keep editing, and periodically check for pending refactors!

---

## 🎨 Customize Refactoring Rules

Edit `.refactor-rules.md` in your project root to control how code is refactored.

**Current project has a template** - check it out and customize it!

### Example Custom Rules

**For Python Projects:**
```markdown
# Python Refactoring Rules

## Style
- Follow PEP 8
- Use type hints for all functions
- Max line length: 88 characters

## Patterns
- Use list comprehensions when readable
- Prefer pathlib over os.path
- Use f-strings for formatting
```

**For Any Language:**
```markdown
# My Refactoring Rules

## Goals
- [Your primary goals]

## Style
- [Your code style preferences]

## Patterns
- [Preferred patterns to use]

## What NOT to Change
- [Things to preserve]
```

---

## 🌍 Using with Multiple Projects

### Option 1: Copy to Each Project

```bash
# In each new project
cp -r /path/to/refactor-watcher-mcp ./
cd refactor-watcher-mcp
npm install
npm run build

# Update ~/.claude/settings.json with new path
```

### Option 2: Global Installation (Recommended)

```bash
# One-time setup
mkdir -p ~/.claude/mcp-servers
cp -r refactor-watcher-mcp ~/.claude/mcp-servers/
cd ~/.claude/mcp-servers/refactor-watcher-mcp
npm install
npm run build
```

Update `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/.claude/mcp-servers/refactor-watcher-mcp/build/index.js"]
    }
  }
}
```

Now it works in **any project**!

---

## 🛠️ Configuration Options

### Change Watch Patterns

Edit `src/index.ts` (lines ~172-177):

```typescript
watcher = chokidar.watch([
  `${projectPath}/app/**/*.{ts,tsx,js,jsx}`,       // Next.js app
  `${projectPath}/components/**/*.{ts,tsx,js,jsx}`, // Components
  `${projectPath}/src/**/*.{py,go,rs,java}`,       // Other languages
  // Add your patterns here!
], {
  // ...
});
```

After editing, rebuild:
```bash
npm run build
```

### Change Timing

Edit `src/index.ts` (lines ~23-25):

```typescript
const DEBOUNCE_MS = 2000;          // Wait 2 seconds after typing
const REFACTOR_LOCKOUT_MS = 30000; // Lock file for 30 seconds after refactor
const MAX_FILE_LINES = 500;        // Skip files larger than this
```

---

## 📊 MCP Tools Reference

### `start_watching`
**Description:** Start monitoring project files
**Usage:** "Start watching my project"

### `get_pending_refactors`
**Description:** Get list of changed files
**Usage:** "Check for pending refactors"

### `mark_refactored`
**Description:** Mark files as refactored (I call this automatically)
**Usage:** Automatic after refactoring

### `get_stats`
**Description:** View watcher statistics
**Usage:** "Show refactor watcher stats"

### `stop_watching`
**Description:** Stop monitoring files
**Usage:** "Stop watching for changes"

---

## 🐛 Troubleshooting

### "MCP server not found"

**Check settings path:**
```bash
cat ~/.claude/settings.json
```

Make sure the path to `index.js` is **absolute** and **correct**.

**Verify build exists:**
```bash
ls /path/to/refactor-watcher-mcp/build/index.js
```

### "No files being detected"

**Check watch patterns** in `src/index.ts` - do they match your project structure?

**Test manually:**
```
In Claude: "Get refactor watcher stats"
```

Check if "Files watched" count is increasing.

### "Files refactored multiple times"

Increase `REFACTOR_LOCKOUT_MS` in `src/index.ts` and rebuild.

### "Build fails"

Make sure you have Node.js and npm installed:
```bash
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

---

## 💡 Pro Tips

### Tip 1: Auto-Check During Session

Tell me once:
```
After each task I complete, automatically check for pending refactors
```

I'll remember and check the queue regularly!

### Tip 2: Batch Refactoring

```
Check for pending refactors. If there are more than 5 files, refactor them all at once.
```

### Tip 3: Selective Refactoring

```
Check for pending refactors. Only refactor files in the src/components directory.
```

### Tip 4: Custom Rules Per Session

```
Check for pending refactors and refactor them, but this time focus ONLY on adding TypeScript types.
```

---

## 📋 Complete Example Workflow

```bash
# 1. Navigate to your project
cd ~/my-project

# 2. Start Claude Code
claude

# In Claude conversation:
```

**You:** Start watching for file changes

**Claude:** ✅ Started watching /Users/you/my-project
Monitoring .ts, .tsx, .js, .jsx files
Debounce: 2 seconds

**You:** *[Edit some files in your editor and save]*

**You:** Check for pending refactors

**Claude:** 📋 3 files pending refactoring:
- src/components/Header.tsx
- src/utils/helpers.ts
- src/pages/index.tsx

Should I refactor these files?

**You:** Yes, use my .refactor-rules.md

**Claude:** *[Reads .refactor-rules.md]*
*[Refactors each file]*
✅ Refactored 3 files successfully!

**You:** *[Continue editing...]*

---

## 🎉 You're All Set!

You now have a **free, intelligent refactoring agent** that:
- Works with **any project**
- Follows **YOUR rules**
- Costs **$0** (uses Claude Code session)
- Runs **automatically** in the background

**Start coding and let me help keep your code clean!** 🚀

---

## 📞 Need Help?

Just ask me in Claude Code:
```
Help me troubleshoot the refactor-watcher MCP server
```

I'll debug the issue with you!
