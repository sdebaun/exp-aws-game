# exp-aws-game

A multiplayer, social, long-term, web-based game.

- @./design/README.md
- @./experiment/README.md

## ⚠️ PACKAGE MANAGER: YARN ONLY ⚠️

**THIS PROJECT USES YARN. NOT NPM. NEVER NPM.**

- ✅ Use `yarn` for installing packages
- ✅ Use `yarn add` for adding dependencies
- ✅ Use `yarn dev` for running development servers
- ✅ Use `npx` when needed for running binaries
- ❌ DO NOT use `npm install`
- ❌ DO NOT use `npm add`
- ❌ DO NOT use `npm run`
- ❌ NO NPM COMMANDS WHATSOEVER

If you see any `package-lock.json` files, DELETE THEM. We use `yarn.lock`.

## Development Instructions

### SST Dev vs Deploy

**For Frontend Development:**
1. Run `sst dev` in one terminal (creates real AWS resources)
2. Run `yarn dev` in `domain/game-web` directory (starts Next.js on localhost:3000)
3. Access the site at `http://localhost:3000`

**Important Notes:**
- `sst dev` creates real AWS resources (DynamoDB, EventBridge, etc.) but runs Lambda locally
- Next.js in dev mode bypasses CloudFront and any edge infrastructure
- The URL output shows "url-unavailable-in-dev.mode" - this is normal
- Use localhost:3000 for frontend work with hot reload

**For Full Stack Testing:**
- Run `sst deploy --stage dev` to test with all AWS infrastructure
- This is slow (2-5 min per deploy) but tests the real setup
- Includes CloudFront, auth, routing, edge functions
- No hot reload - every change requires a new deploy

### Understanding SST Deploy Performance

The `sst deploy` command can take several minutes, but it's not actually the Next.js build that's slow:
- Next.js compilation typically takes only 1-2 seconds
- The real time is spent on AWS operations:
  - OpenNext code patches and bundling (~2-3 seconds)
  - Uploading built assets to S3 (6-8 seconds per bundle)
  - Updating Lambda functions (6-7 seconds each for server, image optimizer, revalidation functions)
  - CloudFront cache invalidation

This is inherent to serverless Next.js deployment - you're updating an entire distributed infrastructure, not just uploading files to a server. Use `sst dev` for iterative development and reserve full deploys for testing production-like environments.