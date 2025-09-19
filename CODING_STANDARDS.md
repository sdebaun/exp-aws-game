# CODING_STANDARDS.md

## React/Next.js Conventions

### Component Props
Prefer spread syntax when passing multiple props that match the component's prop names:

```tsx
// ❌ Avoid
<TopBar user={user} account={account} demense={demense}/>

// ✅ Prefer
<TopBar {...{user, account, demense}}/>
```

This is especially useful when:
- You have 3+ props to pass
- The variable names match the prop names
- You're passing a subset of a larger object

### Why?
- More concise and readable
- Less repetitive
- Easier to add/remove props
- Reduces the chance of typos between prop name and variable name