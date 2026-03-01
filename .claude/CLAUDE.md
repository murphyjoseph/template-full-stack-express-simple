# Style & Behavior

- Be direct, concise, and critical. Challenge my reasoning. No sycophancy.
- Don't include timeline estimates in plans.
- Don't add yourself as a co-author to git commits.

# Standards

- Always choose the correct fix over the quick fix. Technical debt compounds.
- Fix bugs when you find them if they affect current work. Don't defer, don't say "out of scope." Only exception: genuinely blocked by missing infrastructure.
- Never assume — read the code, verify, compare. Document findings with `file:line` references.
- When there's a tradeoff, present options with evidence and let me decide. Don't silently pick the easy path.
- Place documentation in `docs/` — context is lost between sessions.

## Architecture (dojo-kit)

### Import Hierarchy

routes → features/ → shared/ → platform/

Features are portable — no toasts, navigation, or analytics inside features. Features expose `onSuccess`/`onAction` callbacks; the route layer handles framework concerns.

### File Organization

Organize by concern, not file type. **Never create** `hooks/`, `components/`, `schemas/`, or `presenters/` directories inside features.

File naming uses functional suffixes:

| Suffix           | Role                                                  |
| ---------------- | ----------------------------------------------------- |
| `.api.ts`        | Gateway functions (fetch wrappers)                    |
| `.queries.ts`    | Query hooks (grouped per domain)                      |
| `.mutations.ts`  | Mutation hooks (grouped per domain)                   |
| `.schema.ts`     | Zod validation schema                                 |
| `.controller.ts` | Logic hook — form submission or feature orchestration |
| `.presenter.ts`  | Pure function: raw data → view contract               |
| `.view.tsx`      | Thin render component                                 |

### Feature Structure

```
features/<domain>/
  types.ts                     # Shared types
  api/
    <domain>.api.ts            # Gateway functions
    <domain>.queries.ts        # Query hooks (colocated with gateway)
    <domain>.mutations.ts      # Mutation hooks (colocated with gateway)
  <concern>/                   # e.g. create-item/, search/, dashboard/
    <name>.schema.ts           # Form: validation schema
    <name>.controller.ts       # Form: submission logic / Feature: data orchestration
    <name>.view.tsx            # Form: render layer / Feature: renders presenter contract
    <name>.presenter.ts        # Feature only: pure data → view contract
```

### Patterns

- **Forms with API calls** → `.schema.ts` + `.controller.ts` + `.view.tsx` (never put mutations in views)
- **Data display with loading/empty/error** → `.controller.ts` + `.presenter.ts` + `.view.tsx` (presenter returns `renderAs` contract)
- **API integration** → `.api.ts` + `.queries.ts` + `.mutations.ts` in `api/` directory
