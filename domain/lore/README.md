# Lore Domain

This domain manages the game's lore content and publishes it to OpenAI's vector store for use with AI content generation.

## Setup

1. Copy `.env.local.example` to `.env.local` in the project root:
   ```bash
   cp ../../.env.local.example ../../.env.local
   ```

2. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

## Publishing Lore

To publish lore content to the OpenAI vector store:

```bash
# From project root
yarn lore:publish

# Or from this directory
yarn publish
```

This will:
1. Upload all markdown files from `content/` to OpenAI
2. Create or update a vector store named "game-lore"
3. Save the vector store ID to `vector-store-config.json`

## Adding Lore Content

Add markdown files to the `content/` directory. The publish script will automatically pick them up.

## Vector Store Config

After publishing, the vector store ID is saved to `vector-store-config.json`. This file should be committed to version control so the application knows which vector store to use.