# Functional Primitives (fp-ts) — Minimal Standard

**Scope:** Use of `fp-ts` primitives (`pipe`, `Option`, `Either`) in pure code; limited use of `TaskEither` at IO edges.

**Rule:** In core/pure modules, prefer `Option` instead of nullable values and `Either` instead of throw/`null` for recoverable errors. Use `pipe` for composing pure transformations. Restrict `TaskEither` to boundary layers (HTTP/DB/FS) and convert to imperative control flow at the edge.

**Rationale:**
These primitives make dataflow and failure modes explicit without dragging the codebase into heavy FP patterns. They improve readability and testability, while keeping side‑effects obvious and localized.

**Do:**

* Import `pipe` from `fp-ts/function` for **pure** composition.
* Use `Option` for presence/absence instead of `null | undefined`.
* Use `Either` for domain parsing/validation and other recoverable errors.
* Use `TaskEither` **only** where IO happens; unwrap/handle it in controllers/handlers.
* Keep signatures **data‑first**: `fn(data, opts)` to compose cleanly.

**Avoid:**

* Point‑free tricks and deep typeclass gymnastics in app code.
* Nesting `TaskEither` inside core domain logic.
* Mixing mutation/side‑effects inside `pipe` chains.
* Returning `null/undefined` to signal failure.

**Examples:**

*Option for safe lookup*

```ts
import { pipe } from "fp-ts/function";
import * as O from "fp-ts/Option";

const getUserId = (q: URLSearchParams) =>
  pipe(
    O.fromNullable(q.get("userId")),
    O.flatMap(str => O.fromNullable(Number.parseInt(str))),
  );
```

*Either for explicit validation*

```ts
import * as E from "fp-ts/Either";

type Invalid = { kind: "INVALID"; reason: string };

const parseIsoDate = (s: string): E.Either<Invalid, Date> =>
  E.tryCatch(
    () => new Date(s),
    () => ({ kind: "INVALID", reason: "bad date" }),
  );
```

*TaskEither at the edge (HTTP client)*

```ts
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";

type HttpErr = { kind: "HTTP"; status: number } | { kind: "NET" } | { kind: "JSON" };

export const fetchProfile = (baseUrl: string) => (id: string) =>
  pipe(
    TE.tryCatch(() => fetch(`${baseUrl}/profiles/${id}`), () => ({ kind: "NET" as const })),
    TE.flatMap(res => (res.ok ? TE.right(res) : TE.left({ kind: "HTTP" as const, status: res.status })) ),
    TE.flatMap(res => TE.tryCatch(() => res.json() as Promise<Profile>, () => ({ kind: "JSON" as const })))
  );
```

*Controller boundary: unwrap TaskEither → HTTP response*

```ts
// Express/Next handler: IO boundary
app.get("/profiles/:id", async (req, res) => {
  const result = await fetchProfile(process.env.API_URL!)(req.params.id)();
  if (result._tag === "Left") {
    const e = result.left;
    if (e.kind === "HTTP") return res.status(e.status).end();
    return res.status(502).json(e);
  }
  return res.json(result.right);
});
```

**Notes:**

* Keep `Option`/`Either`/`TaskEither` usage **shallow**: no `Reader*` stacks.
* Prefer naming inline lambdas over point‑free for clarity.
* It’s fine to return plain values/throw in core code **if** the contract is clear and tests cover it; use `Either` when the caller can reasonably recover.

**Tooling:**

* `npm i fp-ts` (or `yarn add fp-ts`).
* Enable `strictNullChecks` in `tsconfig.json`.
* Consider lightweight helpers in `/lib/fp/` (e.g., `match`/`unwrap`), but avoid large wrapper layers until need is proven.
