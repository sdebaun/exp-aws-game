# exp-aws-game

A multiplayer, social, long-term, web-based game.

- @./design/README.md
- @./experiment/README.md

## Development Instructions

### SST Dev vs Deploy

**For Frontend Development:**
1. Run `sst dev` in one terminal (creates real AWS resources)
2. Run `npm run dev` in `domain/game-web` directory (starts Next.js on localhost:3000)
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