#!/bin/bash

# Setup script for API-free refactoring agent

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "🤖 Setting up Automatic Refactoring Agent (NO API KEY NEEDED!)"
echo "================================================================"
echo ""

# Step 1: Install MCP server dependencies
echo "📦 Step 1/3: Installing MCP server dependencies..."
cd refactor-watcher-mcp
npm install
echo ""

# Step 2: Build MCP server
echo "🔨 Step 2/3: Building MCP server..."
npm run build
echo ""

# Step 3: Configure Claude Code
echo "⚙️  Step 3/3: Configuring Claude Code..."
echo ""

CLAUDE_DIR="$HOME/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

# Create .claude directory if it doesn't exist
if [ ! -d "$CLAUDE_DIR" ]; then
    mkdir -p "$CLAUDE_DIR"
    echo "Created $CLAUDE_DIR directory"
fi

# Full path to MCP server
MCP_SERVER_PATH="$SCRIPT_DIR/refactor-watcher-mcp/build/index.js"

# Check if settings.json exists
if [ ! -f "$SETTINGS_FILE" ]; then
    # Create new settings file
    cat > "$SETTINGS_FILE" <<EOF
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF
    echo "✅ Created new settings file: $SETTINGS_FILE"
else
    echo "⚠️  Settings file already exists: $SETTINGS_FILE"
    echo ""
    echo "Please manually add this to your ~/.claude/settings.json:"
    echo ""
    cat <<EOF
{
  "mcpServers": {
    "refactor-watcher": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"]
    }
  }
}
EOF
    echo ""
fi

echo ""
echo "================================================================"
echo "✅ Setup Complete!"
echo "================================================================"
echo ""
echo "🎉 Your refactoring agent is ready (NO API KEY NEEDED!)"
echo ""
echo "Next steps:"
echo ""
echo "1. Start Claude Code in this project:"
echo "   cd $SCRIPT_DIR"
echo "   claude"
echo ""
echo "2. Ask Claude to start watching:"
echo "   'Start watching for file changes'"
echo ""
echo "3. Code normally - Claude will auto-refactor!"
echo ""
echo "📚 For more details, see: REFACTOR_AGENT_NO_API.md"
echo ""
