# Transformation over Mutation

**Thesis:** Prefer transforming data into new values over mutating data in place.

**Why it matters:**
Mutation hides changes. When a function mutates its input, the caller may be surprised later by unexpected state. This makes debugging painful and reasoning harder. Transformation—returning new values—keeps data flow explicit, predictable, and testable.

**Do:**

* Return new objects or values rather than editing inputs.
* Use pure functions wherever possible.
* Favor pipelines or chaining to build transformations step by step.

**Avoid:**

* Functions that change arguments, shared state, or global variables.
* Silent mutations buried inside helpers.
* Interleaving transformation with unrelated side effects.

**Tradeoffs:**

* Heavy object creation can add overhead; mutation may be justified in tight loops or performance-critical code.
* Some APIs (e.g., DOM or database clients) are inherently mutable; isolate those at the edges.

**Examples:**
Instead of mutating:

```ts
function applyDiscount(order, discount) {
  order.total -= discount;
  return order;
}
```

Transform:

```ts
function applyDiscount(order, discount) {
  return { ...order, total: order.total - discount };
}
```

Using a pipeline:

```ts
const result = pipe(
  order,
  assertValid,
  calculateTotal,
  o => applyDiscount(o, 10),
  saveOrder,
  notifyCustomer
);
```
