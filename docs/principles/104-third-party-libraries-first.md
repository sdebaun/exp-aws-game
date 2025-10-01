# Third‑Party Libraries First

**Thesis:** Don’t reinvent the wheel. Prefer well‑maintained libraries for non‑differentiating problems.

**Why it matters:**
Homegrown plumbing drifts, breaks, and steals focus from product work. Mature libraries amortize edge cases, security fixes, and docs across thousands of users—you get reliability and velocity for cheap.

**Do:**

* Reach for a vetted library when the problem is commodity (dates, schema validation, HTTP clients, auth flows, retries, queues, CSV/Excel, PDFs, i18n).
* Evaluate candidates with the checklist below; pick one and commit.
* Wrap the lib behind a thin interface so we can swap it later.

**Avoid:**

* Writing bespoke utilities because “it’s only 50 LOC.” Those 50 LOC acquire tests, bugs, and maintenance debt.
* Prematurely abstracting over five libs you *might* use. Choose one; isolate it.
* Adopting trendy libs without evidence of maintenance or a migration path.

**Tradeoffs:**

* External deps add supply‑chain and lock‑in risk. Mitigate by wrapping and pinning versions.
* For truly core, differentiating logic, prefer in‑house code with minimal dependencies.

## Vetting Checklist (pick winners fast)

**Signals (objective):**

* **Activity:** Last commit < **6–12 months**; regular releases.
* **Adoption:** GitHub ★ and **npm weekly downloads** relative to peers (don’t cargo‑cult raw counts; look for an adoption curve and ecosystem usage).
* **Bus factor:** ≥ **2** active maintainers; PRs reviewed by more than one human.
* **Issues/PRs:** Low open‑issue backlog for critical bugs; PRs see responses within **~2 weeks**.
* **SemVer & Changelog:** Clear migration notes for breaking changes.
* **TypeScript:** First‑class types; ESM/CJS support; tree‑shakable.
* **License:** MIT/Apache‑2/BSD (no copyleft surprises).
* **Security:** No unresolved advisories; sensible dependency tree.
* **Footprint:** Size and transitive deps are reasonable for our target (web/server).

**Context (subjective):**

* API fits how we think (data‑first, composable).
* Plays nicely with our stack (Next.js, Node Lambda, fp‑ts optional).
* Exit strategy is clear (adapter interface + test coverage around our wrapper).

## Selection Flow (10 minutes, tops)

1. **Define the job** (“validate JSON to typed object,” “format dates,” etc.).
2. **Shortlist 2–3** libs via stars/downloads and recency.
3. **Skim APIs** and docs; spike a 20‑line usage for our case.
4. **Check maintenance** (commits, issues/PR response, maintainers).
5. **Decide**. Write a 2–3 line rationale in the PR description.
6. **Wrap** the lib behind `/lib/<capability>/` with a narrow interface and tests.

## Examples

* **Schema validation:** Prefer a maintained validator (e.g., Zod, Valibot, or Ajv) over custom `validateFoo()` functions. Wrap as `parseFoo(input): Either<Error,Foo>`.
* **Dates:** Use a battle‑tested date lib (e.g., date‑fns/Day.js) rather than hand‑rolling timezone math. Keep it inside `lib/date/`.

## Practice Notes

* Pin exact versions in `package.json` for libs that can break us; upgrade intentionally.
* If two candidates are close, pick the one with the *simplest API* and *cleanest migration docs*.
* Periodically **garden**: if a lib goes stale, we already have an interface to replace it.

> Rule of thumb: If it’s plumbing and other companies have the same problem, buy—don’t build. Save our inventiveness for the parts customers can see.
