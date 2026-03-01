# Items Frontend Design

## Context

Build a frontend for the existing Express/Prisma/SQLite server API. The client directory has infrastructure (Vite, React 19, TanStack Router/Query/Form, Chakra UI v3, Zod) but no application code.

## Server API

Existing endpoints:

- `GET /api/items` — list all, ordered by createdAt desc
- `POST /api/items` — create (title 3+ chars required, description optional, priority 1-5 default 3, status enum default "todo")
- `GET /api/items/search?q=` — search title/description, max 20 results
- `DELETE /api/items/:id` — delete by id

New endpoint to add:

- `PATCH /api/items/:id` — partial update, same validation as create but all fields optional

## Item Model

```
id: Int (autoincrement)
title: String (required, min 3 chars)
description: String? (optional)
priority: Int (1-5, default 3)
status: "todo" | "in_progress" | "done" (default "todo")
createdAt: DateTime
```

## Pages

| Route           | Purpose                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| `/`             | Dashboard: status summary counts + full items list as cards with edit/delete actions |
| `/items-search` | Search with debounced input + results                                                |
| `/create-item`  | Form for creating an item with success/failure feedback                              |

## Architecture

```
client/src/
  features/
    items/
      types.ts
      api/
        items.api.ts
        items.queries.ts
        items.mutations.ts
      dashboard/
        dashboard.controller.ts
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
        delete-item.view.tsx
  shared/
    use-debounce.ts
  routes/
    __root.tsx
    index.tsx
    items-search.tsx
    create-item.tsx
```

### Import Hierarchy

routes -> features/ -> shared/

Routes are thin: import controllers/views, wire toasts and navigation via callbacks. Features never import toasts, navigation, or analytics directly.

## Data Layer

### Gateway (`items.api.ts`)

Five functions: `getItems()`, `searchItems(q)`, `createItem(data)`, `updateItem(id, data)`, `deleteItem(id)`.

### Queries (`items.queries.ts`)

- `useItems()` — queryKey: `['items']`
- `useSearchItems(q)` — queryKey: `['items', 'search', q]`

### Mutations (`items.mutations.ts`)

- `useCreateItem({ onSuccess })` — invalidates `['items']`
- `useUpdateItem({ onSuccess })` — invalidates `['items']`
- `useDeleteItem({ onSuccess })` — invalidates `['items']`

All mutations accept `onSuccess`/`onError` callbacks for the route layer to provide toast/navigation.

## Component Design

### Dashboard

**Presenter** returns:

```ts
type DashboardViewModel = {
  renderAs: 'loading' | 'empty' | 'content';
  counts: { todo: number; inProgress: number; done: number; total: number };
  items: ItemCardViewModel[];
};
```

**View** renders:

- 3 stat cards (Todo / In Progress / Done) + total count
- Responsive grid of item cards
- Each card: title, description snippet, priority badge, status badge, edit button, delete button

### Search

- Debounced text input (300ms via `useDebounce` hook)
- Results rendered as cards
- "No results" empty state

### Create Item

- Zod schema mirrors server validation
- TanStack Form for form state
- Fields: title (text), description (textarea), priority (number input 1-5), status (select)
- Submit with loading state
- Route toasts success and navigates to `/`

### Edit Item (Modal)

- Chakra `Dialog` modal
- Same form fields as create, pre-populated with item data
- Save/Cancel buttons
- Route toasts success and closes modal

### Delete Confirmation (Dialog)

- Chakra `Dialog` with confirmation message
- Delete/Cancel buttons
- Route toasts success

### Layout (`__root.tsx`)

- Nav bar with links: Dashboard, Search, Create Item
- Chakra `Toaster` component
- `Outlet` for page content

## Error Handling

- Mutations: server error messages surfaced via toast (error variant)
- Success: green toasts
- Query errors: inline error states in views
- Form validation: inline per-field errors via Chakra Field component

## Decisions

- Status counts derived client-side from `GET /api/items` response (no dedicated endpoint)
- Edit via modal dialog (not inline or separate page)
- Delete with confirmation dialog
- All framework concerns (toasts, navigation) stay in route layer
