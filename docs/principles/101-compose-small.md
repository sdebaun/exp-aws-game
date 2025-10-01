# Compose Small

**Thesis:** Many small, focused pieces beat one giant, clever one.

**Why it matters:**
Big functions and classes grow tangled fast. They hide bugs, block reuse, and make tests painful. Small, composable units are easier to reason about, swap out, and build upon. They’re Lego bricks, not cement walls.

**Do:**

* Write functions that do one clear thing and return quickly.
* Extract helpers when logic or conditions start nesting deeply.
* Chain or compose small units to express higher-level behavior.

**Avoid:**

* Functions that scroll for pages or require mental gymnastics.
* Hidden side effects that blur what the unit really does.
* “God objects” that know or do too much.

**Tradeoffs:**

* Too many micro-functions can be noise. Merge when clarity suffers.
* Performance hot spots may justify fatter functions, but only after measurement.

**Examples:**
Instead of:

```ts
function processOrder(order) {
  // validate, calculate totals, apply discounts, persist, send email...
}
```

Do:

```ts
function processOrder(order) {
  assertValid(order);
  const total = calculateTotal(order);
  const discounted = applyDiscounts(order, total);
  const saved = saveOrder(discounted);
  return notifyCustomer(saved);
}
```
