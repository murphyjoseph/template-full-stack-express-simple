# Frontend Build Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete frontend for the existing items CRUD API with dashboard, search, and create pages plus edit/delete dialogs.

**Architecture:** Dojo-kit pattern — routes → features/ → shared/. Each feature uses controller/presenter/view separation. TanStack Router file-based routing, TanStack React Query for server state, TanStack Form + Zod for forms, Chakra UI v3 for components.

**Tech Stack:** React 19, Vite 7, TanStack Router v1, TanStack React Query v5, TanStack React Form v1, Chakra UI v3, Zod

---

### Task 1: Add PATCH endpoint to server

**Files:**

- Modify: `server/src/server.ts:91` (before the delete route)
- Modify: `server/src/__tests__/server.test.ts` (add test block)

**Step 1: Write the failing tests**

Add to `server/src/__tests__/server.test.ts` after the existing "Items CRUD" describe block:

```typescript
describe('PATCH /api/items/:id', () => {
  let patchItemId: number;

  beforeAll(async () => {
    const res = await request(app).post('/api/items').send({
      title: 'Patch Test Item',
      description: 'Original description',
      priority: 2,
      status: 'todo',
    });
    patchItemId = res.body.id;
    testItemIds.push(patchItemId);
  });

  it('updates title only', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.description).toBe('Original description');
  });

  it('updates multiple fields', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ priority: 5, status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.priority).toBe(5);
    expect(res.body.status).toBe('done');
  });

  it('rejects invalid fields', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ priority: 10 });
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent item', async () => {
    const res = await request(app)
      .patch('/api/items/999999')
      .send({ title: 'Nope' });
    expect(res.status).toBe(404);
  });

  it('rejects invalid id', async () => {
    const res = await request(app)
      .patch('/api/items/abc')
      .send({ title: 'Nope' });
    expect(res.status).toBe(400);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `pnpm --filter @template-fullstack-express-simple/server test`
Expected: FAIL — no PATCH route defined

**Step 3: Implement the PATCH endpoint**

Add to `server/src/server.ts` before the `app.delete` block (around line 91). Also create `updateItemSchema` near the top:

```typescript
const updateItemSchema = createItemSchema.partial();
```

Then the route:

```typescript
app.patch('/api/items/:id', async (req, res) => {
  const idParsed = idParamSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    res.status(400).json({ error: 'Invalid item ID' });
    return;
  }

  const bodyParsed = updateItemSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const item = await prisma.item.update({
      where: { id: idParsed.data },
      data: bodyParsed.data,
    });
    res.json(item);
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});
```

**Step 4: Run tests to verify they pass**

Run: `pnpm --filter @template-fullstack-express-simple/server test`
Expected: ALL PASS

**Step 5: Commit**

```bash
git add server/src/server.ts server/src/__tests__/server.test.ts
git commit -m "feat: add PATCH /api/items/:id endpoint"
```

---

### Task 2: Create shared types and API gateway

**Files:**

- Create: `client/src/features/items/types.ts`
- Create: `client/src/features/items/api/items.api.ts`

**Step 1: Create types**

```typescript
// client/src/features/items/types.ts
export type ItemStatus = 'todo' | 'in_progress' | 'done';

export type Item = {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  status: ItemStatus;
  createdAt: string;
};

export type ItemFormData = {
  title: string;
  description: string;
  priority: number;
  status: ItemStatus;
};
```

**Step 2: Create API gateway**

```typescript
// client/src/features/items/api/items.api.ts
import type { Item, ItemFormData } from '../types';

const API_BASE = '/api';

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function searchItems(q: string): Promise<Item[]> {
  const res = await fetch(
    `${API_BASE}/items/search?q=${encodeURIComponent(q)}`,
  );
  if (!res.ok) throw new Error('Failed to search items');
  return res.json();
}

export async function createItem(data: ItemFormData): Promise<Item> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.error ? JSON.stringify(err.error) : 'Failed to create item',
    );
  }
  return res.json();
}

export async function updateItem(
  id: number,
  data: Partial<ItemFormData>,
): Promise<Item> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.error ? JSON.stringify(err.error) : 'Failed to update item',
    );
  }
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete item');
}
```

**Step 3: Commit**

```bash
git add client/src/features/items/types.ts client/src/features/items/api/items.api.ts
git commit -m "feat: add item types and API gateway"
```

---

### Task 3: Create query and mutation hooks

**Files:**

- Create: `client/src/features/items/api/items.queries.ts`
- Create: `client/src/features/items/api/items.mutations.ts`

**Step 1: Create query hooks**

```typescript
// client/src/features/items/api/items.queries.ts
import { useQuery } from '@tanstack/react-query';
import { fetchItems, searchItems } from './items.api';

export const itemKeys = {
  all: ['items'] as const,
  search: (q: string) => ['items', 'search', q] as const,
};

export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: fetchItems,
  });
}

export function useSearchItems(q: string) {
  return useQuery({
    queryKey: itemKeys.search(q),
    queryFn: () => searchItems(q),
    enabled: q.length > 0,
  });
}
```

**Step 2: Create mutation hooks**

```typescript
// client/src/features/items/api/items.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem, deleteItem } from './items.api';
import { itemKeys } from './items.queries';
import type { ItemFormData } from '../types';

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemFormData) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ItemFormData> }) =>
      updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
```

**Step 3: Commit**

```bash
git add client/src/features/items/api/items.queries.ts client/src/features/items/api/items.mutations.ts
git commit -m "feat: add item query and mutation hooks"
```

---

### Task 4: Create toaster setup and shared useDebounce hook

**Files:**

- Create: `client/src/shared/toaster.tsx`
- Create: `client/src/shared/use-debounce.ts`

**Step 1: Create toaster**

Chakra v3 requires a `createToaster` instance + `Toaster` component mounted once in the root.

```tsx
// client/src/shared/toaster.tsx
import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export function Toaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
```

**Step 2: Create useDebounce hook**

```typescript
// client/src/shared/use-debounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Step 3: Commit**

```bash
git add client/src/shared/toaster.tsx client/src/shared/use-debounce.ts
git commit -m "feat: add toaster setup and useDebounce hook"
```

---

### Task 5: Create root layout

**Files:**

- Create: `client/src/routes/__root.tsx`

**Step 1: Create the root route with navigation layout**

```tsx
// client/src/routes/__root.tsx
import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Toaster } from '@/shared/toaster';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box as="header" bg="bg" borderBottomWidth="1px" py="3">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" textStyle="lg">
              Items
            </Text>
            <HStack gap="6">
              <Link to="/">
                {({ isActive }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Dashboard
                  </Text>
                )}
              </Link>
              <Link to="/items-search">
                {({ isActive }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Search
                  </Text>
                )}
              </Link>
              <Link to="/create-item">
                {({ isActive }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Create
                  </Text>
                )}
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="6xl" py="8">
        <Outlet />
      </Container>
      <Toaster />
    </Box>
  );
}
```

**Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS (TanStack Router plugin will auto-generate routeTree)

**Step 3: Commit**

```bash
git add client/src/routes/__root.tsx
git commit -m "feat: add root layout with navigation"
```

---

### Task 6: Dashboard presenter

**Files:**

- Create: `client/src/features/items/dashboard/dashboard.presenter.ts`

**Step 1: Create the presenter**

Pure function — no React, no hooks. Takes raw items → returns view model.

```typescript
// client/src/features/items/dashboard/dashboard.presenter.ts
import type { Item, ItemStatus } from '../types';

type StatusCounts = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
};

type CardViewModel = {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  priorityLabel: string;
  priorityColor: string;
  status: ItemStatus;
  statusLabel: string;
  statusColor: string;
  createdAt: string;
};

type DashboardContent = {
  renderAs: 'content';
  summary: StatusCounts;
  cards: CardViewModel[];
};

type DashboardLoading = { renderAs: 'loading' };
type DashboardError = { renderAs: 'error'; message: string };
type DashboardEmpty = { renderAs: 'empty' };

export type DashboardViewModel =
  | DashboardLoading
  | DashboardError
  | DashboardEmpty
  | DashboardContent;

const PRIORITY_COLORS: Record<number, string> = {
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'blue',
  5: 'gray',
};

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Minimal',
};

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  done: { label: 'Done', color: 'green' },
};

export function presentDashboard(
  items: Item[] | undefined,
  isLoading: boolean,
  error: Error | null,
): DashboardViewModel {
  if (isLoading) return { renderAs: 'loading' };
  if (error) return { renderAs: 'error', message: error.message };
  if (!items || items.length === 0) return { renderAs: 'empty' };

  const summary: StatusCounts = {
    total: items.length,
    todo: items.filter((i) => i.status === 'todo').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
  };

  const cards: CardViewModel[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    priority: item.priority,
    priorityLabel: PRIORITY_LABELS[item.priority] ?? 'Unknown',
    priorityColor: PRIORITY_COLORS[item.priority] ?? 'gray',
    status: item.status,
    statusLabel: STATUS_CONFIG[item.status]?.label ?? item.status,
    statusColor: STATUS_CONFIG[item.status]?.color ?? 'gray',
    createdAt: new Date(item.createdAt).toLocaleDateString(),
  }));

  return { renderAs: 'content', summary, cards };
}
```

**Step 2: Commit**

```bash
git add client/src/features/items/dashboard/dashboard.presenter.ts
git commit -m "feat: add dashboard presenter"
```

---

### Task 7: Item form schema (shared between create and edit)

**Files:**

- Create: `client/src/features/items/create-item/create-item.schema.ts`
- Create: `client/src/features/items/edit-item/edit-item.schema.ts`

**Step 1: Create the create item schema**

```typescript
// client/src/features/items/create-item/create-item.schema.ts
import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1, 'Min 1').max(5, 'Max 5').default(3),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
});

export type CreateItemFormData = z.input<typeof createItemSchema>;
```

**Step 2: Create the edit item schema (same validation)**

```typescript
// client/src/features/items/edit-item/edit-item.schema.ts
import { z } from 'zod';

export const editItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1, 'Min 1').max(5, 'Max 5'),
  status: z.enum(['todo', 'in_progress', 'done']),
});

export type EditItemFormData = z.input<typeof editItemSchema>;
```

**Step 3: Commit**

```bash
git add client/src/features/items/create-item/create-item.schema.ts client/src/features/items/edit-item/edit-item.schema.ts
git commit -m "feat: add create and edit item Zod schemas"
```

---

### Task 8: Create Item feature (controller + view + route)

**Files:**

- Create: `client/src/features/items/create-item/create-item.controller.ts`
- Create: `client/src/features/items/create-item/create-item.view.tsx`
- Create: `client/src/routes/create-item.tsx`

**Step 1: Create the controller**

```typescript
// client/src/features/items/create-item/create-item.controller.ts
import { useForm } from '@tanstack/react-form';
import { useCreateItem } from '../api/items.mutations';
import { createItemSchema } from './create-item.schema';
import type { CreateItemFormData } from './create-item.schema';

export function useCreateItemController(callbacks: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useCreateItem();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 3,
      status: 'todo',
    } satisfies CreateItemFormData,
    validators: {
      onChange: createItemSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const parsed = createItemSchema.parse(value);
        await mutation.mutateAsync({
          title: parsed.title,
          description: parsed.description ?? '',
          priority: parsed.priority,
          status: parsed.status,
        });
        callbacks.onSuccess();
      } catch (err) {
        callbacks.onError(
          err instanceof Error ? err : new Error('Failed to create item'),
        );
      }
    },
  });

  return { form, isPending: mutation.isPending };
}
```

**Step 2: Create the view**

```tsx
// client/src/features/items/create-item/create-item.view.tsx
import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import type { useCreateItemController } from './create-item.controller';

type Props = ReturnType<typeof useCreateItemController>;

export function CreateItemView({ form, isPending }: Props) {
  return (
    <Box maxW="lg" mx="auto">
      <Heading size="xl" mb="6">
        Create Item
      </Heading>
      <Card.Root>
        <Card.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Stack gap="4">
              <form.Field name="title">
                {(field) => (
                  <Field.Root
                    invalid={field.state.meta.errors.length > 0}
                    required
                  >
                    <Field.Label>Title</Field.Label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Item title"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Field.ErrorText>
                        {field.state.meta.errors.join(', ')}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
                    />
                  </Field.Root>
                )}
              </form.Field>

              <form.Field name="priority">
                {(field) => (
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
                    <Field.Label>Priority</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      >
                        <option value="1">1 - Critical</option>
                        <option value="2">2 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - Low</option>
                        <option value="5">5 - Minimal</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    {field.state.meta.errors.length > 0 && (
                      <Field.ErrorText>
                        {field.state.meta.errors.join(', ')}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                )}
              </form.Field>

              <Button type="submit" loading={isPending} alignSelf="flex-start">
                Create Item
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
```

**Step 3: Create the route**

```tsx
// client/src/routes/create-item.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toaster } from '@/shared/toaster';
import { useCreateItemController } from '@/features/items/create-item/create-item.controller';
import { CreateItemView } from '@/features/items/create-item/create-item.view';

export const Route = createFileRoute('/create-item')({
  component: CreateItemRoute,
});

function CreateItemRoute() {
  const navigate = useNavigate();

  const controller = useCreateItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item created successfully' });
      navigate({ to: '/' });
    },
    onError: (error) => {
      toaster.error({
        title: 'Failed to create item',
        description: error.message,
      });
    },
  });

  return <CreateItemView {...controller} />;
}
```

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 5: Commit**

```bash
git add client/src/features/items/create-item/ client/src/routes/create-item.tsx
git commit -m "feat: add create item page with form validation"
```

---

### Task 9: Edit Item feature (controller + view as dialog)

**Files:**

- Create: `client/src/features/items/edit-item/edit-item.controller.ts`
- Create: `client/src/features/items/edit-item/edit-item.view.tsx`

**Step 1: Create the controller**

```typescript
// client/src/features/items/edit-item/edit-item.controller.ts
import { useForm } from '@tanstack/react-form';
import { useUpdateItem } from '../api/items.mutations';
import { editItemSchema } from './edit-item.schema';
import type { Item } from '../types';

export function useEditItemController(
  item: Item,
  callbacks: {
    onSuccess: () => void;
    onError: (error: Error) => void;
  },
) {
  const mutation = useUpdateItem();

  const form = useForm({
    defaultValues: {
      title: item.title,
      description: item.description ?? '',
      priority: item.priority,
      status: item.status,
    },
    validators: {
      onChange: editItemSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const parsed = editItemSchema.parse(value);
        await mutation.mutateAsync({
          id: item.id,
          data: {
            title: parsed.title,
            description: parsed.description ?? '',
            priority: parsed.priority,
            status: parsed.status,
          },
        });
        callbacks.onSuccess();
      } catch (err) {
        callbacks.onError(
          err instanceof Error ? err : new Error('Failed to update item'),
        );
      }
    },
  });

  return { form, isPending: mutation.isPending };
}
```

**Step 2: Create the dialog view**

```tsx
// client/src/features/items/edit-item/edit-item.view.tsx
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import type { Item } from '../types';
import { useEditItemController } from './edit-item.controller';

type Props = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export function EditItemDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: Props) {
  const { form, isPending } = useEditItemController(item, {
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
    onError,
  });

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Item</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                id="edit-item-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <Stack gap="4">
                  <form.Field name="title">
                    {(field) => (
                      <Field.Root
                        invalid={field.state.meta.errors.length > 0}
                        required
                      >
                        <Field.Label>Title</Field.Label>
                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors.join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="description">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="priority">
                    {(field) => (
                      <Field.Root invalid={field.state.meta.errors.length > 0}>
                        <Field.Label>Priority</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={String(field.state.value)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          >
                            <option value="1">1 - Critical</option>
                            <option value="2">2 - High</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - Low</option>
                            <option value="5">5 - Minimal</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors.join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="status">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  </form.Field>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="edit-item-form" loading={isPending}>
                Save
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

**Step 3: Commit**

```bash
git add client/src/features/items/edit-item/
git commit -m "feat: add edit item dialog with form"
```

---

### Task 10: Delete Item feature (controller + confirmation dialog)

**Files:**

- Create: `client/src/features/items/delete-item/delete-item.controller.ts`
- Create: `client/src/features/items/delete-item/delete-item.view.tsx`

**Step 1: Create the controller**

```typescript
// client/src/features/items/delete-item/delete-item.controller.ts
import { useDeleteItem } from '../api/items.mutations';

export function useDeleteItemController(callbacks: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useDeleteItem();

  const handleDelete = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      callbacks.onSuccess();
    } catch (err) {
      callbacks.onError(
        err instanceof Error ? err : new Error('Failed to delete item'),
      );
    }
  };

  return { handleDelete, isPending: mutation.isPending };
}
```

**Step 2: Create the confirmation dialog view**

```tsx
// client/src/features/items/delete-item/delete-item.view.tsx
import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import type { Item } from '../types';
import { useDeleteItemController } from './delete-item.controller';

type Props = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: Props) {
  const { handleDelete, isPending } = useDeleteItemController({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
    onError,
  });

  return (
    <Dialog.Root
      role="alertdialog"
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Item</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to delete <strong>{item.title}</strong>?
                This action cannot be undone.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                loading={isPending}
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
```

**Step 3: Commit**

```bash
git add client/src/features/items/delete-item/
git commit -m "feat: add delete item confirmation dialog"
```

---

### Task 11: Dashboard controller, view, and route

**Files:**

- Create: `client/src/features/items/dashboard/dashboard.controller.ts`
- Create: `client/src/features/items/dashboard/dashboard.view.tsx`
- Create: `client/src/routes/index.tsx`

**Step 1: Create the controller**

```typescript
// client/src/features/items/dashboard/dashboard.controller.ts
import { useState } from 'react';
import { useItems } from '../api/items.queries';
import { presentDashboard } from './dashboard.presenter';
import type { Item } from '../types';

export function useDashboardController() {
  const { data, isLoading, error } = useItems();
  const viewModel = presentDashboard(data, isLoading, error);

  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  return {
    viewModel,
    editItem,
    deleteItem,
    onEdit: (item: Item) => setEditItem(item),
    onEditClose: () => setEditItem(null),
    onDelete: (item: Item) => setDeleteItem(item),
    onDeleteClose: () => setDeleteItem(null),
  };
}
```

**Step 2: Create the dashboard view**

```tsx
// client/src/features/items/dashboard/dashboard.view.tsx
import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { DashboardViewModel } from './dashboard.presenter';
import type { Item } from '../types';
import { EditItemDialog } from '../edit-item/edit-item.view';
import { DeleteItemDialog } from '../delete-item/delete-item.view';

type Props = {
  viewModel: DashboardViewModel;
  editItem: Item | null;
  deleteItem: Item | null;
  onEdit: (item: Item) => void;
  onEditClose: () => void;
  onDelete: (item: Item) => void;
  onDeleteClose: () => void;
  onEditSuccess: () => void;
  onEditError: (error: Error) => void;
  onDeleteSuccess: () => void;
  onDeleteError: (error: Error) => void;
};

export function DashboardView({
  viewModel,
  editItem,
  deleteItem,
  onEdit,
  onEditClose,
  onDelete,
  onDeleteClose,
  onEditSuccess,
  onEditError,
  onDeleteSuccess,
  onDeleteError,
}: Props) {
  if (viewModel.renderAs === 'loading') {
    return (
      <Box textAlign="center" py="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (viewModel.renderAs === 'error') {
    return (
      <Box textAlign="center" py="20">
        <Text color="fg.error">{viewModel.message}</Text>
      </Box>
    );
  }

  if (viewModel.renderAs === 'empty') {
    return (
      <Box textAlign="center" py="20">
        <Text color="fg.muted">No items yet. Create one to get started.</Text>
      </Box>
    );
  }

  const { summary, cards } = viewModel;

  return (
    <Stack gap="8">
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
        <StatCard label="Total" value={summary.total} color="purple" />
        <StatCard label="To Do" value={summary.todo} color="gray" />
        <StatCard label="In Progress" value={summary.inProgress} color="blue" />
        <StatCard label="Done" value={summary.done} color="green" />
      </SimpleGrid>

      <Box>
        <Heading size="lg" mb="4">
          All Items
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {cards.map((card) => (
            <Card.Root key={card.id} variant="outline">
              <Card.Body gap="3">
                <HStack justify="space-between">
                  <Card.Title textStyle="md">{card.title}</Card.Title>
                  <HStack gap="1">
                    <Badge
                      size="sm"
                      colorPalette={card.priorityColor}
                      variant="subtle"
                    >
                      {card.priorityLabel}
                    </Badge>
                    <Badge
                      size="sm"
                      colorPalette={card.statusColor}
                      variant="solid"
                    >
                      {card.statusLabel}
                    </Badge>
                  </HStack>
                </HStack>
                {card.description && (
                  <Text color="fg.muted" textStyle="sm">
                    {card.description}
                  </Text>
                )}
                <Text color="fg.subtle" textStyle="xs">
                  {card.createdAt}
                </Text>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    onEdit({
                      id: card.id,
                      title: card.title,
                      description: card.description,
                      priority: card.priority,
                      status: card.status,
                      createdAt: card.createdAt,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  colorPalette="red"
                  onClick={() =>
                    onDelete({
                      id: card.id,
                      title: card.title,
                      description: card.description,
                      priority: card.priority,
                      status: card.status,
                      createdAt: card.createdAt,
                    })
                  }
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>

      {editItem && (
        <EditItemDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) onEditClose();
          }}
          onSuccess={onEditSuccess}
          onError={onEditError}
        />
      )}

      {deleteItem && (
        <DeleteItemDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => {
            if (!open) onDeleteClose();
          }}
          onSuccess={onDeleteSuccess}
          onError={onDeleteError}
        />
      )}
    </Stack>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card.Root>
      <Card.Body py="4" px="5">
        <Text textStyle="sm" color="fg.muted">
          {label}
        </Text>
        <Text textStyle="3xl" fontWeight="bold" color={`${color}.fg`}>
          {value}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
```

**Step 3: Create the route**

```tsx
// client/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { toaster } from '@/shared/toaster';
import { useDashboardController } from '@/features/items/dashboard/dashboard.controller';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const controller = useDashboardController();

  return (
    <DashboardView
      {...controller}
      onEditSuccess={() => {
        controller.onEditClose();
        toaster.success({ title: 'Item updated successfully' });
      }}
      onEditError={(error) => {
        toaster.error({
          title: 'Failed to update item',
          description: error.message,
        });
      }}
      onDeleteSuccess={() => {
        controller.onDeleteClose();
        toaster.success({ title: 'Item deleted successfully' });
      }}
      onDeleteError={(error) => {
        toaster.error({
          title: 'Failed to delete item',
          description: error.message,
        });
      }}
    />
  );
}
```

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 5: Commit**

```bash
git add client/src/features/items/dashboard/ client/src/routes/index.tsx
git commit -m "feat: add dashboard page with item cards and edit/delete dialogs"
```

---

### Task 12: Search feature (controller + view + route)

**Files:**

- Create: `client/src/features/items/search/search.controller.ts`
- Create: `client/src/features/items/search/search.view.tsx`
- Create: `client/src/routes/items-search.tsx`

**Step 1: Create the controller**

```typescript
// client/src/features/items/search/search.controller.ts
import { useState } from 'react';
import { useSearchItems } from '../api/items.queries';
import { useDebounce } from '@/shared/use-debounce';

export function useSearchController() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, error } = useSearchItems(debouncedQuery);

  return {
    query,
    setQuery,
    items: data ?? [],
    isLoading: isLoading && debouncedQuery.length > 0,
    error,
    hasSearched: debouncedQuery.length > 0,
  };
}
```

**Step 2: Create the view**

```tsx
// client/src/features/items/search/search.view.tsx
import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { useSearchController } from './search.controller';
import type { Item } from '../types';

type Props = ReturnType<typeof useSearchController>;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  done: { label: 'Done', color: 'green' },
};

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: 'Critical', color: 'red' },
  2: { label: 'High', color: 'orange' },
  3: { label: 'Medium', color: 'yellow' },
  4: { label: 'Low', color: 'blue' },
  5: { label: 'Minimal', color: 'gray' },
};

export function SearchView({
  query,
  setQuery,
  items,
  isLoading,
  hasSearched,
}: Props) {
  return (
    <Stack gap="6">
      <Box>
        <Heading size="xl" mb="4">
          Search Items
        </Heading>
        <Input
          placeholder="Search by title or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
        />
      </Box>

      {isLoading && (
        <Box textAlign="center" py="10">
          <Spinner size="lg" />
        </Box>
      )}

      {!isLoading && hasSearched && items.length === 0 && (
        <Box textAlign="center" py="10">
          <Text color="fg.muted">No items found matching your search.</Text>
        </Box>
      )}

      {!isLoading && !hasSearched && (
        <Box textAlign="center" py="10">
          <Text color="fg.muted">Start typing to search items.</Text>
        </Box>
      )}

      {items.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {items.map((item: Item) => {
            const statusCfg = STATUS_CONFIG[item.status] ?? {
              label: item.status,
              color: 'gray',
            };
            const priorityCfg = PRIORITY_CONFIG[item.priority] ?? {
              label: 'Unknown',
              color: 'gray',
            };
            return (
              <Card.Root key={item.id} variant="outline">
                <Card.Body gap="3">
                  <HStack justify="space-between">
                    <Card.Title textStyle="md">{item.title}</Card.Title>
                    <HStack gap="1">
                      <Badge
                        size="sm"
                        colorPalette={priorityCfg.color}
                        variant="subtle"
                      >
                        {priorityCfg.label}
                      </Badge>
                      <Badge
                        size="sm"
                        colorPalette={statusCfg.color}
                        variant="solid"
                      >
                        {statusCfg.label}
                      </Badge>
                    </HStack>
                  </HStack>
                  {item.description && (
                    <Text color="fg.muted" textStyle="sm">
                      {item.description}
                    </Text>
                  )}
                  <Text color="fg.subtle" textStyle="xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </Card.Body>
              </Card.Root>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
```

**Step 3: Create the route**

```tsx
// client/src/routes/items-search.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useSearchController } from '@/features/items/search/search.controller';
import { SearchView } from '@/features/items/search/search.view';

export const Route = createFileRoute('/items-search')({
  component: SearchRoute,
});

function SearchRoute() {
  const controller = useSearchController();
  return <SearchView {...controller} />;
}
```

**Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS

**Step 5: Commit**

```bash
git add client/src/features/items/search/ client/src/routes/items-search.tsx
git commit -m "feat: add search page with debounced input"
```

---

### Task 13: Smoke test — run dev and verify

**Step 1: Start the dev server**

Run: `pnpm dev`

**Step 2: Verify manually**

- Visit http://localhost:5173 — dashboard loads, shows items from seed data
- Click "Create" — navigate to /create-item, fill form, submit
- Back on dashboard — new item appears
- Click "Edit" on a card — dialog opens, modify fields, save
- Click "Delete" on a card — confirmation dialog, confirm
- Visit /items-search — type a search query, results appear after debounce
- Toast notifications appear on success/failure for all mutations

**Step 3: Run full check suite**

Run: `pnpm lint && pnpm typecheck && pnpm test`
Expected: ALL PASS

**Step 4: Fix any issues found**

Address lint errors, type errors, or test failures.

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: fix lint and type issues from frontend build"
```
