# Frontend Build Design

## Summary

Build a frontend for the existing Express/Prisma items API. Three pages: dashboard (list + stats), search (debounced), create item (form). Edit via modal dialog, delete with confirmation, toast on success/failure.

## Server Change

Add `PATCH /api/items/:id` — partial update using `.partial()` of create schema. Returns updated item. 404 if not found.

## Architecture

Full dojo-kit pattern: routes → features/ → shared/

```
src/
  routes/
    __root.tsx
    index.tsx
    items-search.tsx
    create-item.tsx
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
```

## Data Model

```ts
type Item = {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
};
```

## API Layer

- Gateway: `fetchItems()`, `searchItems(q)`, `createItem(data)`, `updateItem(id, data)`, `deleteItem(id)`
- Queries: `useItems()`, `useSearchItems(q)` (enabled when q is truthy)
- Mutations: `useCreateItem()`, `useUpdateItem()`, `useDeleteItem()` — all invalidate `['items']` on success

## Pages

### Dashboard (`/`)

- Summary stat cards: total, todo, in_progress, done counts
- Item cards grid: title, description, priority badge (color-coded), status badge, created date, edit/delete buttons
- Presenter: pure function returning `{ renderAs, summary, cards }` discriminated union for loading/empty/error/content
- Edit button opens edit modal dialog
- Delete button opens confirmation dialog

### Search (`/items-search`)

- Debounced input (300ms) via `useDebounce` hook
- Results as cards (same layout as dashboard cards, read-only)
- Empty state when no results

### Create Item (`/create-item`)

- Form: title (input), description (textarea), priority (number input), status (select)
- Zod schema: title min 3 chars, priority 1-5, status enum
- TanStack Form + create mutation
- Toast + navigate to dashboard on success

## Dialogs

### Edit Item (modal)

- Same form fields as create, pre-filled with item data
- TanStack Form + update mutation
- Closes + toasts on success

### Delete Item (confirmation)

- "Delete [title]?" with confirm/cancel
- Delete mutation, closes + toasts on success

## Layout (`__root.tsx`)

- Top nav bar with links: Dashboard, Search, Create Item
- Toaster mounted globally
- `<Outlet />` for child routes

## Data Flow

```
Route (toast, navigation) → Controller (hooks, state) → Presenter (pure transform) → View (render only)
```

Mutations invalidate query cache for automatic refresh.
