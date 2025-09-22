# Character Recruitment System

## Overview

The character recruitment system manages a pool of AI-generated characters that players can add to their roster. This system ensures there are always characters available for players to recruit while managing the ink economy around character acquisition.

## Character States

Characters exist in one of three states:

1. **Available** - Characters in the general pool, visible to all players
2. **Recruitable** - Characters reserved by a specific player, no longer visible to others
3. **Rostered** - Characters permanently added to a player's roster

Note: When a character is dismissed from recruitable state, they return to available state.

## Pool Management

### Automated Generation

A scheduled job monitors the available character pool:
- Runs periodically, frequently
- Checks if available character count < minimum threshold
- Generates new characters until count >= minimum threshold
- Generated characters are immediately added to the available pool

### Configuration

- `MINIMUM_AVAILABLE_CHARACTERS`: Target minimum for the available pool (e.g., 50)
- `GENERATION_BATCH_SIZE`: Number of characters to generate per batch (e.g., 10)
- `CHECK_INTERVAL`: How often the pool size is checked (e.g., 15 minutes)

## Recruitment Flow

### Step 1: Reserve Character
- Player browses available characters
- Player spends ink to move character from "available" to "recruitable"
- Character is now reserved for that player only
- Cost: `RESERVATION_INK_COST` (e.g., 10 ink)

### Step 2: Recruit to Roster
- Player views their recruitable characters
- Player spends ink to permanently add character to roster
- Character moves from "recruitable" to "rostered"
- Cost: `ROSTER_INK_COST` (e.g., 50 ink)

### Step 3: Dismiss (Optional)
- Player can dismiss any recruitable character
- Character returns to the available pool for other players
- Player receives partial ink refund
- Refund: `DISMISSAL_REFUND_RATE` × `RESERVATION_INK_COST` (e.g., 50% × 10 = 5 ink)
- Character's player association is removed

## Ink Economy

Total cost to roster a character:
- Reservation: 10 ink
- Rostering: 50 ink
- **Total: 60 ink**

If dismissed after reservation:
- Spent: 10 ink
- Refunded: 5 ink
- **Net loss: 5 ink**

## Technical Implementation Notes

### Access Patterns

* A backend process needs to get the count of all available characters to determine if it needs to generate more or not
* The game-web app will need to show a user all of their recruitable characters
* The game-web app will need the capability to change a character's state between available, recruitable, and rostered