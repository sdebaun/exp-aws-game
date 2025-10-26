#!/bin/bash

# Helper script to run chat WebSocket tests
#
# Usage:
#   ./test-chat.sh [watch]
#
# This script automatically fetches the WebSocket URL from SST

set -e

# Change to project root
cd "$(dirname "$0")/../.."

echo "🔍 Getting ChatApi WebSocket URL from SST..."

# Get the URL using sst shell node with dynamic import
# Filter out SST banner lines and only get the actual URL
CHAT_WS_URL=$(echo "const { Resource } = await import('sst'); console.log(Resource.ChatApi.url)" | sst shell node 2>/dev/null | grep -E '^wss://' | head -1)

if [ -z "$CHAT_WS_URL" ]; then
  echo "❌ Failed to get ChatApi URL. Make sure 'sst dev' is running."
  exit 1
fi

echo "✅ Found ChatApi URL: $CHAT_WS_URL"

# Change back to game-web directory
cd domain/game-web

# Run tests
export CHAT_WS_URL

if [ "$1" = "watch" ]; then
  echo "🧪 Running tests in watch mode..."
  yarn test:watch
else
  echo "🧪 Running tests once..."
  yarn test
fi