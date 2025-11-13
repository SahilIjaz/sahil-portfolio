# 🤖 Automatic Refactoring Agent - NO API KEY REQUIRED!

Your new refactoring agent uses **Claude Code directly** instead of API calls - meaning **$0 cost** and no API key needed!

## 🎉 What Changed

### Old Approach (API-based)
- ❌ Required `ANTHROPIC_API_KEY`
- ❌ Cost ~$0.04 per refactor
- ❌ Monthly cost: $50-150
- ❌ Direct API calls to Anthropic

### New Approach (Claude Code-based)
- ✅ **NO API key needed**
- ✅ **$0 cost** - uses your existing Claude Code session
- ✅ Uses ME (Claude) to do the refactoring
- ✅ Better project context

## 🏗️ Architecture

```
File Changes → MCP Server (watches) → Queues Files → I (Claude Code) Check → Auto-Refactor
```

### How It Works:

1. **MCP Server watches your files** (2-second debounce after you stop typing)
2. **Changed files get queued** automatically
3. **After each operation, I automatically check** for pending refactors
4. **I refactor the files** using my full project understanding
5. **Files are marked as done** and locked for 30 seconds (prevents loops)

## 📦 What Was Created

### MCP Server
- `refactor-watcher-mcp/` - File watching MCP server
- Watches: `app/`, `components/`, `lib/`, `hooks/`
- Debounces: 2 seconds after last change
- Skips: Files >500 lines, test files, node_modules

### Tools Available (via MCP)
1. `start_watching` - Start watching project files
2. `get_pending_refactors` - Check which files need refactoring
3. `mark_refactored` - Mark files as done (locks for 30 sec)
4. `get_stats` - View watcher statistics
5. `stop_watching` - Stop the watcher

## 🚀 Setup Instructions

### Step 1: Install MCP Server Dependencies

```bash
cd refactor-watcher-mcp
npm install
npm run build
```

### Step 2: Configure Claude Code

Edit `~/.claude/settings.json` (create if doesn't exist):

```json
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": [
        "/Users/sahilijaz/Desktop/Ambition/sahil-portfolio/refactor-watcher-mcp/build/index.js"
      ]
    }
  }
}
```

**Important:** Update the path to match your actual project location!

### Step 3: Start Claude Code

```bash
# In your project directory
claude
```

The MCP server will automatically connect!

### Step 4: Start the Watcher

In Claude Code session, ask me:

```
Start watching for file changes
```

I'll call the `start_watching` tool and begin monitoring your files!

### Step 5: Test It!

1. Open [app/page.tsx](app/page.tsx)
2. Make a small change (add a comment)
3. Save the file
4. Wait 2 seconds
5. Ask me: "Check for pending refactors"
6. I'll automatically refactor the file!

## 💡 How to Use

### Automatic Mode (Recommended)

After starting the watcher, just code normally! Every time you save a file:

1. File change detected after 2 seconds
2. File queued for refactoring
3. Next time you ask me anything, I'll mention pending refactors
4. Or explicitly ask: "Check and refactor pending files"

### Manual Check

At any time, ask me:

```
Check for pending refactors
```

I'll use the MCP tools to check the queue and refactor if needed.

### View Stats

```
Show refactor watcher stats
```

I'll show you:
- Files watched
- Changes detected
- Files queued
- Files refactored
- Current pending count

### Stop Watching

```
Stop watching for changes
```

Stops the file watcher (useful when done for the day).

## 🔒 Safety Features

### 1. Automatic Backups
Before refactoring, I'll create `.backup` files (standard Claude Code behavior).

### 2. 30-Second Lockout
After refactoring a file, it's locked for 30 seconds to prevent refactor loops.

### 3. Size Limits
Files over 500 lines are automatically skipped (configure in `src/index.ts`).

### 4. Smart Debouncing
Waits 2 seconds after you stop typing before queueing.

### 5. File Stability Check
Only queues files after they've been stable for 500ms (prevents partial writes).

## 🎛️ Configuration

Edit `refactor-watcher-mcp/src/index.ts` to customize:

```typescript
const DEBOUNCE_MS = 2000;          // Wait time after typing stops
const REFACTOR_LOCKOUT_MS = 30000; // Lockout period after refactor
const MAX_FILE_LINES = 500;        // Skip files larger than this
```

After changes:
```bash
cd refactor-watcher-mcp
npm run build
```

Then restart Claude Code.

## 🐛 Troubleshooting

### MCP Server Not Connecting

1. **Check settings path:**
   ```bash
   cat ~/.claude/settings.json
   ```

2. **Verify MCP server path is correct:**
   ```json
   {
     "mcpServers": {
       "refactor-watcher": {
         "command": "node",
         "args": ["/full/path/to/refactor-watcher-mcp/build/index.js"]
       }
     }
   }
   ```

3. **Check MCP server is built:**
   ```bash
   ls refactor-watcher-mcp/build/index.js
   ```

   If not found:
   ```bash
   cd refactor-watcher-mcp && npm run build
   ```

### Files Not Being Queued

1. **Check watcher is started:**
   Ask me: "Show refactor watcher stats"

2. **Verify file type is watched:**
   Only `.ts`, `.tsx`, `.js`, `.jsx` in:
   - `app/`
   - `components/`
   - `lib/`
   - `hooks/`

3. **Check file size:**
   Files >500 lines are skipped by default.

### File Recently Refactored Message

This is the 30-second lockout working! Wait 30 seconds then try again.

## 📊 Example Workflow

```
You: Start watching for file changes
Me: ✅ Started watching... [calls MCP tool]

[You edit app/page.tsx and save]
[Wait 2 seconds]

You: What's pending?
Me: 📋 1 file pending: app/page.tsx
    Let me refactor it... [reads file, refactors, writes]
    ✅ Refactored! [calls mark_refactored]

[30 seconds later, you edit again]

You: Check for pending refactors
Me: 📋 app/page.tsx is queued again
    [refactors...]
```

## 🎯 Benefits vs API Version

| Feature | API Version | Claude Code Version |
|---------|-------------|---------------------|
| Cost | $50-150/month | **$0** |
| API Key | Required | **Not needed** |
| Project Context | Limited | **Full access** |
| Setup | Complex | **Simple** |
| Control | Automatic | **You control** |

## 🔄 Comparison with Old Daemon

### Old (refactor-daemon/)
- Required ANTHROPIC_API_KEY
- Ran independently in background
- Auto-modified files without asking
- High API costs
- PM2 process management

### New (refactor-watcher-mcp/)
- **NO API key needed**
- Runs as MCP server (managed by Claude Code)
- **You control when refactoring happens**
- **$0 cost**
- Integrated with Claude Code session

## 📚 Next Steps

1. **Install dependencies:**
   ```bash
   cd refactor-watcher-mcp
   npm install
   npm run build
   ```

2. **Configure MCP server** in `~/.claude/settings.json`

3. **Start Claude Code** in your project

4. **Ask me to start watching** for file changes

5. **Code normally** - I'll handle the rest!

## 🎉 You're Done!

The old `refactor-daemon/` folder is now obsolete. You can delete it:

```bash
rm -rf refactor-daemon/
```

The new MCP-based approach is:
- ✅ Simpler
- ✅ Free ($0 cost)
- ✅ Better integrated
- ✅ More control

Just start Claude Code, ask me to start watching, and code away! 🚀

---

**Questions?** Just ask me in the Claude Code session - I'm always here to help!
