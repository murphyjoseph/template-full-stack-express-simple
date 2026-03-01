# Items Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete frontend for the existing items CRUD API with dashboard, search, and create pages.

**Architecture:** Feature-based organization following dojo-kit conventions. Routes are thin wiring layers that import feature controllers/views and handle toasts + navigation. Features never import framework concerns directly. Presenter pattern for data display with renderAs contracts.

**Tech Stack:** React 19, TanStack Router (file-based), TanStack React Query, TanStack React Form, Chakra UI v3, Zod, Vite.

---

## Directory Structure (concern-based colocation per CLAUDE.md)

All directories below are concern-based, not type-based. The api/ directory is the data-access concern for the items domain, as specified in the project CLAUDE.md architecture section.

    client/src/
      features/items/
        types.ts
        api/                       ← data-access concern
          items.api.ts
          items.queries.ts
          items.mutations.ts
        dashboard/                 ← dashboard concern
          dashboard.presenter.ts
          dashboard.presenter.test.ts
          dashboard.controller.ts
          dashboard.view.tsx
        create-item/               ← create concern
          create-item.schema.ts
          create-item.controller.ts
          create-item.view.tsx
        edit-item/                 ← edit concern
          edit-item.schema.ts
          edit-item.controller.ts
          edit-item.view.tsx
        delete-item/               ← delete concern
          delete-item.controller.ts
          delete-item.view.tsx
        search/                    ← search concern
          search.controller.ts
          search.view.tsx
      shared/
        use-debounce.ts
        use-debounce.test.ts
        toaster.tsx
      routes/
        __root.tsx
        index.tsx
        items-search.tsx
        create-item.tsx

---

### Task 1: Add PATCH endpoint to server

**Files:**

- Modify: server/src/server.ts (before the NODE_ENV test block)
- Modify: server/src/**tests**/server.test.ts

**Step 1: Write the failing tests**

Add to server/src/**tests**/server.test.ts after the existing Items CRUD describe block. Create a new describe block for PATCH /api/items/:id with tests for:

- updates title only (expects 200, title changed, priority unchanged)
- updates multiple fields (expects 200, priority and status changed)
- rejects invalid title (expects 400)
- rejects invalid id (expects 400, error message)
- returns 404 for non-existent item (expects 404, error message)

**Step 2: Run tests to verify they fail**

Run: cd server && pnpm test
Expected: FAIL

**Step 3: Implement PATCH endpoint**

Add to server/src/server.ts:

- Create updateItemSchema = createItemSchema.partial()
- Add app.patch handler that validates id param, validates body, builds data object from defined fields only, calls prisma.item.update, handles P2025 error for 404

**Step 4: Run tests to verify they pass**

Run: cd server && pnpm test
Expected: ALL PASS

**Step 5: Commit**

---

### Task 2: Shared types and useDebounce hook

**Files:**

- Create: client/src/features/items/types.ts
- Create: client/src/shared/use-debounce.ts
- Test: client/src/shared/use-debounce.test.ts

**Step 1: Write the failing test for useDebounce**

Test with vi.useFakeTimers:

- returns initial value immediately
- debounces value changes (verify old value until timer advances)

**Step 2: Run test to verify it fails**

**Step 3: Create types and useDebounce**

types.ts: ItemStatus, Item, CreateItemInput, UpdateItemInput
use-debounce.ts: useState + useEffect with setTimeout pattern

**Step 4: Run test to verify it passes**

**Step 5: Commit**

---

### Task 3: Data access layer (gateway + queries + mutations)

**Files:**

- Create: client/src/features/items/api/items.api.ts
- Create: client/src/features/items/api/items.queries.ts
- Create: client/src/features/items/api/items.mutations.ts

**Step 1: Create the API gateway**

Five functions: getItems, searchItems, createItem, updateItem, deleteItem
Shared handleResponse helper for error extraction.

**Step 2: Create query hooks**

itemKeys factory, useItems, useSearchItems

**Step 3: Create mutation hooks**

useCreateItem, useUpdateItem, useDeleteItem — all invalidate itemKeys.all and accept onSuccess/onError callbacks

**Step 4: Run typecheck**

**Step 5: Commit**

---

### Task 4: Toaster setup

**Files:**

- Create: client/src/shared/toaster.tsx

Create toaster instance with createToaster and Toaster component following Chakra v3 pattern.

**Commit**

---

### Task 5: Root layout and route shells

**Files:**

- Create: client/src/routes/\_\_root.tsx
- Create: client/src/routes/index.tsx
- Create: client/src/routes/items-search.tsx
- Create: client/src/routes/create-item.tsx

Root layout: nav bar with Links, Container, Outlet, Toaster.
Route stubs: placeholder divs for each route.

**Commit**

---

### Task 6: Dashboard presenter (pure logic, tested)

**Files:**

- Create: client/src/features/items/dashboard/dashboard.presenter.ts
- Test: client/src/features/items/dashboard/dashboard.presenter.test.ts

Pure function presentDashboard(items, isLoading) returns DashboardViewModel with renderAs, counts, and mapped ItemCardViewModels.

Tests cover loading, empty, content states, correct counts, correct status colors/labels.

**Commit**

---

### Task 7: Dashboard controller and view

**Files:**

- Create: client/src/features/items/dashboard/dashboard.controller.ts
- Create: client/src/features/items/dashboard/dashboard.view.tsx
- Modify: client/src/routes/index.tsx

Controller: uses useItems, passes through presenter.
View: stat cards + item card grid with edit/delete buttons.
Route: wire with placeholder callbacks.

**Commit**

---

### Task 8: Create Item form

**Files:**

- Create: client/src/features/items/create-item/create-item.schema.ts
- Create: client/src/features/items/create-item/create-item.controller.ts
- Create: client/src/features/items/create-item/create-item.view.tsx
- Modify: client/src/routes/create-item.tsx

Schema mirrors server validation. Controller uses TanStack Form + useCreateItem.
View: form with title, description, priority select, status select, submit button.
Route: wires toast + navigate callbacks.

**Commit**

---

### Task 9: Edit Item modal

**Files:**

- Create: client/src/features/items/edit-item/edit-item.schema.ts
- Create: client/src/features/items/edit-item/edit-item.controller.ts
- Create: client/src/features/items/edit-item/edit-item.view.tsx

Schema: same shape as create, no defaults.
Controller: takes itemId + defaultValues, uses useUpdateItem.
View: Chakra Dialog.Root (controlled, lazyMount) with same form fields as create.

**Commit**

---

### Task 10: Delete Item confirmation dialog

**Files:**

- Create: client/src/features/items/delete-item/delete-item.controller.ts
- Create: client/src/features/items/delete-item/delete-item.view.tsx

Controller: uses useDeleteItem, returns handleDelete + isPending.
View: Chakra Dialog with role=alertdialog, confirmation text, Cancel + Delete buttons.

**Commit**

---

### Task 11: Wire edit + delete into Dashboard route

**Files:**

- Modify: client/src/routes/index.tsx

Add useState for editingItem and deletingItem. Look up Item from useItems query data.
Render EditItemDialog and DeleteItemDialog sub-components that wire controllers + toasts.

**Commit**

---

### Task 12: Search page

**Files:**

- Create: client/src/features/items/search/search.controller.ts
- Create: client/src/features/items/search/search.view.tsx
- Modify: client/src/routes/items-search.tsx

Controller: useState for query, useDebounce, useSearchItems.
View: search input + results grid + empty state.
Route: wire controller to view.

**Commit**

---

### Task 13: Final verification

- Run all client tests
- Run all server tests
- Run typecheck and lint
- Visual smoke test with pnpm dev
- Fix any issues found

---

### Task 14: Style pass with frontend-design skill

After all functionality works, invoke the frontend-design skill to polish visual design.
