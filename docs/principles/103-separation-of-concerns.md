# Separation of Concerns

**Thesis:** Give each part of the system one job and one reason to change.

**Why it matters:**
When rendering, business rules, and IO are blended, every edit risks breakage elsewhere. Clear seams reduce coupling, make tests cheap, and keep changes local.

**Do:**

* Keep **presentation**, **domain logic**, and **data access** distinct.
* Put **IO at the edges** (HTTP, DB, file system). Keep core logic pure.
* Hide cross‑cutting concerns (auth, logging, caching) behind interfaces.
* Define **stable boundaries**: functions or modules with narrow, explicit contracts.

**Avoid:**

* Components that fetch, validate, transform, and persist all at once.
* Domain logic that knows HTTP/DB shapes.
* Helpers that mix side effects with computation.

**Tradeoffs:**

* Too many layers can create ceremony; collapse when clarity suffers.
* Small apps may co-locate concerns temporarily—keep an upgrade path.

**Examples:**
*Express handler keeps IO; service keeps rules; repo hides persistence.*

```ts
// route.ts
app.post("/orders", async (req, res) => {
  const cmd = toCreateOrderCommand(req.body); // parse/validate IO shape
  const order = await createOrder(cmd, { repo, clock, discountPolicy });
  res.status(201).json(toOrderDto(order)); // map back to IO shape
});

// service.ts (pure core logic)
export async function createOrder(cmd: CreateOrder, deps: Deps) {
  const base = makeOrder(cmd, deps.clock.now());
  const priced = deps.discountPolicy.apply(base);
  await deps.repo.save(priced);
  return priced;
}

// repo.ts (edge)
export const repo = {
  async save(order: Order) {
    await db.insert("orders", serialize(order));
  },
};
```

**Practice notes:**

* Favor "ports & adapters": define interfaces (ports) in the domain; implement them at the edges (adapters).
* Types are contracts—use them to make illegal states unrepresentable across boundaries.
