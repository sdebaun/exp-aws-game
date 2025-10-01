# Locality of Behavior

**Thesis:** Code that changes together should live together.

**Why it matters:**
When related code is scattered across folders (UI here, logic there, persistence way over there), every change turns into a scavenger hunt. This slows you down, increases merge conflicts, and makes context-switching expensive. Locality reduces friction, keeps mental load low, and helps new devs onboard faster.

**Do:**

* Group code by feature or domain, not by technical type.
* Keep UI, logic, and persistence for a feature in one place.
* Refactor when a feature spreads across too many distant files.

**Avoid:**

* “Sock drawer” structures: `components/`, `services/`, `db/`, each holding a jumble of unrelated stuff.
* Forcing devs to jump across the repo to follow a single user story.
* Collapsing multiple concerns into a single mega-file.

**Tradeoffs:**

* Shared utilities may live outside features, but keep them lean.
* Some cross-cutting concerns (logging, auth) naturally break locality—handle with stable interfaces.

**Examples:**

```
/features/orders/
  OrderForm.tsx
  orderService.ts
  orderRepo.ts
```

versus:

```
/components/OrderForm.tsx
/services/orderService.ts
/db/orderRepo.ts
```
