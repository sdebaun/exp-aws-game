# React Component Props

**Scope:** How to pass multiple props into React components when the variable names match the prop names.

**Rule:** Prefer spread syntax when passing three or more props whose variable names match the component’s prop names.

**Rationale:**
Explicit repetition (`prop={prop}`) clutters code, increases surface area for typos, and makes adding/removing props noisy. Spread syntax is concise, consistent, and easier to maintain.

**Do:**

* Use spread syntax when passing 3+ props with matching names.
* Destructure objects to a subset and spread only what’s needed.
* Keep the spread inline and obvious, not hidden behind extra layers.

**Avoid:**

* Writing `prop={prop}` repeatedly when names match.
* Mixing explicit props and spread in the same call (unless clarity demands it).
* Spreading large objects wholesale (be intentional about what’s passed).

**Examples:**

```tsx
// ✅ Good: concise, obvious
<TopBar {...{ user, account, demense }} />

// ✅ Good: destructure subset then spread
const { user, account } = session;
<TopBar {...{ user, account }} />

// ❌ Bad: noisy repetition
<TopBar user={user} account={account} demense={demense} />

// ❌ Bad: mixing spread + explicit for no reason
<TopBar {...{ user, account }} demense={demense} />
```

**Notes:**

* For one or two props, explicit props are fine and sometimes clearer.
* Don’t overuse spread—favor readability when in doubt.
* Linters won’t enforce this; it’s a convention for consistency and clarity.
