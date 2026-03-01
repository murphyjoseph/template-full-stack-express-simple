# Items Frontend Design

## Context

Build a frontend for the existing Express/Prisma items CRUD API. The client directory has providers wired (React 19, Chakra UI v3, TanStack Router/Query/Form, Zod) but no routes or features.

**Server API:**

- `GET /api/items` — all items, ordered by createdAt desc
- `POST /api/items` — create (title, description?, priority 1-5, status todo|in_progress|done)
- `PATCH /api/items/:id` — partial update
- `DELETE /api/items/:id` — delete, 204 on success
- `GET /api/items/search?q=` — search title/description, limit 20

**Item model:** id (int), title (string), description (string?), priority (int 1-5), status (todo|in_progress|done), createdAt (datetime)

## Pages

### `/` — Dashboard

- **Summary row:** 4 stat cards — Total, Todo, In Progress, Done. Color-coded. Computed client-side via presenter from full items list.
- **Items grid:** Responsive card grid. Each card: title, description (truncated), priority badge, status badge, created date.
- **Card actions:** Edit button (opens modal), Delete button (opens confirmation dialog).
- **States:** Loading skeleton, error alert, empty state.

### `/items-search` — Search

- Debounced text input (300ms).
- Calls `GET /api/items/search?q=` with TanStack Query keyed on search term.
- Results as same card layout. Empty state when no results.

### `/create-item` — Create Item

- TanStack Form + Zod validation matching server schema.
- Fields: title (text input), description (textarea), priority (select 1-5), status (select).
- Success: toast + redirect to dashboard.
- Failure: toast + form stays populated.

## Modals

### Edit Item Dialog

- Opened from dashboard card edit button.
- Same fields as create, pre-populated.
- Success: toast + close modal + invalidate query.
- Failure: toast with error.

### Delete Confirmation Dialog

- Shows item title in confirmation message.
- Success: toast + invalidate query.
- Failure: toast with error.

## Architecture

```
features/items/
  types.ts
  api/
    items.api.ts
    items.queries.ts
    items.mutations.ts
  dashboard/
    dashboard.presenter.ts
    dashboard.view.tsx
  search/
    search.controller.ts
    search.view.tsx
  create-item/
    create-item.schema.ts
    create-item.controller.ts
    create-item.view.tsx
  edit-item/
    edit-item.schema.ts
    edit-item.controller.ts
    edit-item.view.tsx
  delete-item/
    delete-item.controller.ts
```

### Data Flow

- `items.api.ts` — fetch wrappers for all 5 endpoints.
- `items.queries.ts` — `useItems()`, `useSearchItems(q)`.
- `items.mutations.ts` — `useCreateItem()`, `useUpdateItem()`, `useDeleteItem()` with query invalidation.
- Mutations expose `onSuccess`/`onError` for route-layer toasts.

### Routing

- `routes/__root.tsx` — layout with nav + Toaster
- `routes/index.tsx` — dashboard (wires presenter + view + edit/delete modals)
- `routes/items-search.tsx` — search (wires controller + view)
- `routes/create-item.tsx` — create form (wires controller + view, handles toast/redirect)

## Visual Design

- Polished & modern tone.
- Status badges: blue (todo), orange (in_progress), green (done).
- Subtle card shadows, hover transitions.
- Priority as numeric badge.
- Chakra UI v3 defaultSystem, no custom theme.
