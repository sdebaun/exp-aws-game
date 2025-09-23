# Content Domain

The content domain owns all AI-generated game content and its data storage. This includes characters, valleys (coming soon), scenarios (coming soon), and other game objects. 

## Domain Architecture Philosophy

### Data Ownership
This domain **owns the GameTable** (main DynamoDB table) where all content entities are stored. This is an intentional architectural decision:
- Content domain is self-contained with its own data layer
- Other domains (like game-web) depend on content through APIs, not direct database access
- Enables true domain isolation and independent deployment

### Why Content Owns the Database
1. **Clear Dependencies**: Content domain has zero external dependencies. Game-web depends on content, creating a clean dependency graph.
2. **API-First**: Other domains access content through Lambda invocations or tRPC, never direct entity imports
3. **Domain Boundaries**: Changes to content storage/schema don't leak to other domains
4. **Future Flexibility**: Could split into a microservice or use different storage without affecting consumers

## Current Structure

### Features (by Game Object)

Each content type is organized as a self-contained feature:

- **character/** - Character generation and recruitment
  - `entity.ts` - ElectroDB entity definition
  - `generator.ts` - OpenAI-based character generation
  - `batch-generator.ts` - Lambda handler for batch generation
  - (API endpoints coming soon)

### Shared

- **shared/** - Common utilities
  - `pool-counter.ts` - Generic counter entity for tracking available content

### Infrastructure

- `stack.ts` - SST configuration
  - Character batch generator Lambda
  - EventBridge schedule (currently disabled)
  - Links to OpenAI secrets

## Current Implementation Status

### ✅ Implemented
- Character entity with recruitment states (available → recruitable → rostered)
- Character generator using OpenAI's structured responses
- Batch generation Lambda (generates 5 characters per invocation)
- Pool counter entity for tracking

### 🚧 Not Yet Implemented
- API endpoints for character recruitment flow
- Pool monitoring (currently just batch generation)
- Other content types (valleys, scenarios)
- ContentSmith abstraction layer

## Design Decisions

### Character States
- **available**: In the general pool, any player can recruit
- **recruitable**: Reserved by a specific player, hidden from others
- **rostered**: Permanently owned by a player
- When dismissed from recruitable, characters return to available (not deleted)

### Simple Batch Generation
Instead of complex pool management, we use a simple batch generator:
- Generates 5 characters at a time
- Can be triggered manually or by EventBridge
- No complex state management or monitoring (for now)

### No Character Stats
Characters have:
- name, description, aspects[] (not stats/classes)
- Portraits generated from character data (not separate prompts)
- No complex D&D-style mechanics

## API Patterns (Coming Soon)

Other domains should NEVER:
```typescript
// ❌ Don't do this
import { CharacterEntity } from "@domain/content/character/entity";
```

Instead, use domain APIs:
```typescript
// ✅ Do this
const content = createContentClient();
await content.character.reserve({ characterId });
```

## Future Content Types

The same pattern will apply to:
- **Valleys**: Settings for stories and potential demenses
- **Scenarios**: Plot setups for character groups
- Each gets its own folder with entity, generator, and API

## Development Notes

- Run `yarn sst dev` to deploy infrastructure
- The batch generator starts disabled - enable in AWS Console when ready
- Check CloudWatch logs for generation results and costs