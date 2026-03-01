# Items Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the frontend for the items CRUD API with dashboard, search, and create pages.

**Architecture:** Single `features/items/` domain with concern-based splits (dashboard, search, create-item, edit-item, delete-item). TanStack Router file-based routing. TanStack Query for server state. TanStack Form + Zod for form validation. Chakra UI v3 for components.

**Tech Stack:** React 19, Chakra UI v3 (defaultSystem), TanStack Router/Query/Form, Zod, Vite

---

### Task 1: Types + API layer

**Files:**

- Create: `client/src/features/items/types.ts`
- Create: `client/src/features/items/api/items.api.ts`

**Step 1: Create shared types**

```ts
// client/src/features/items/types.ts
export type ItemStatus = 'todo' | 'in_progress' | 'done';

export interface Item {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  status: ItemStatus;
  createdAt: string;
}

export interface CreateItemInput {
  title: string;
  description?: string;
  priority?: number;
  status?: ItemStatus;
}

export interface UpdateItemInput {
  title?: string;
  description?: string | null;
  priority?: number;
  status?: ItemStatus;
}
```

**Step 2: Create API gateway functions**

```ts
// client/src/features/items/api/items.api.ts
import type { Item, CreateItemInput, UpdateItemInput } from '../types';

const BASE = '/api/items';

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function searchItems(q: string): Promise<Item[]> {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Failed to search items');
  return res.json();
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ? JSON.stringify(body.error) : 'Failed to create item',
    );
  }
  return res.json();
}

export async function updateItem(
  id: number,
  input: UpdateItemInput,
): Promise<Item> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ? JSON.stringify(body.error) : 'Failed to update item',
    );
  }
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
}
```

**Step 3: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```
feat: add items types and API gateway
```

---

### Task 2: Query + mutation hooks

**Files:**

- Create: `client/src/features/items/api/items.queries.ts`
- Create: `client/src/features/items/api/items.mutations.ts`

**Step 1: Create query hooks**

```ts
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

```ts
// client/src/features/items/api/items.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem, deleteItem } from './items.api';
import { itemKeys } from './items.queries';
import type { CreateItemInput, UpdateItemInput } from '../types';

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateItemInput) => createItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateItemInput }) =>
      updateItem(id, input),
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

**Step 3: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```
feat: add items query and mutation hooks
```

---

### Task 3: Toaster setup + root layout

The toaster in Chakra UI v3 requires a composition file and needs to be rendered in the root layout. TanStack Router uses `routes/__root.tsx` for the root layout.

**Files:**

- Create: `client/src/components/ui/toaster.tsx`
- Create: `client/src/routes/__root.tsx`

**Step 1: Create toaster composition**

```tsx
// client/src/components/ui/toaster.tsx
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
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
```

**Step 2: Create root layout with navigation**

```tsx
// client/src/routes/__root.tsx
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Box, Container, Flex, HStack, Heading } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box as="header" bg="bg" borderBottomWidth="1px" py="3">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg">Items</Heading>
            <HStack gap="4">
              <Link to="/">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Dashboard
                  </Box>
                )}
              </Link>
              <Link to="/items-search">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Search
                  </Box>
                )}
              </Link>
              <Link to="/create-item">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Create
                  </Box>
                )}
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="6xl" py="6">
        <Outlet />
      </Container>
      <Toaster />
    </Box>
  );
}
```

**Step 3: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```
feat: add root layout with navigation and toaster
```

---

### Task 4: Dashboard presenter + view

**Files:**

- Create: `client/src/features/items/dashboard/dashboard.presenter.ts`
- Create: `client/src/features/items/dashboard/dashboard.view.tsx`

**Step 1: Write presenter test**

```ts
// client/src/features/items/dashboard/dashboard.presenter.test.ts
import { describe, it, expect } from 'vitest';
import { presentDashboard } from './dashboard.presenter';
import type { Item } from '../types';

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  title: 'Test',
  description: null,
  priority: 3,
  status: 'todo',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('presentDashboard', () => {
  it('returns empty state when no items', () => {
    const result = presentDashboard([]);
    expect(result.renderAs).toBe('empty');
  });

  it('computes status counts', () => {
    const items = [
      makeItem({ id: 1, status: 'todo' }),
      makeItem({ id: 2, status: 'todo' }),
      makeItem({ id: 3, status: 'in_progress' }),
      makeItem({ id: 4, status: 'done' }),
    ];
    const result = presentDashboard(items);
    expect(result.renderAs).toBe('content');
    if (result.renderAs !== 'content') return;
    expect(result.counts).toEqual({
      total: 4,
      todo: 2,
      inProgress: 1,
      done: 1,
    });
  });

  it('passes items through', () => {
    const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
    const result = presentDashboard(items);
    if (result.renderAs !== 'content') return;
    expect(result.items).toHaveLength(2);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd client && npx vitest run src/features/items/dashboard/dashboard.presenter.test.ts 2>&1 | tail -10`
Expected: FAIL — module not found

**Step 3: Write presenter implementation**

```ts
// client/src/features/items/dashboard/dashboard.presenter.ts
import type { Item } from '../types';

interface StatusCounts {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

interface DashboardEmpty {
  renderAs: 'empty';
}

interface DashboardContent {
  renderAs: 'content';
  counts: StatusCounts;
  items: Item[];
}

export type DashboardView = DashboardEmpty | DashboardContent;

export function presentDashboard(items: Item[]): DashboardView {
  if (items.length === 0) {
    return { renderAs: 'empty' };
  }

  const counts: StatusCounts = {
    total: items.length,
    todo: items.filter((i) => i.status === 'todo').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
  };

  return { renderAs: 'content', counts, items };
}
```

**Step 4: Run test to verify it passes**

Run: `cd client && npx vitest run src/features/items/dashboard/dashboard.presenter.test.ts 2>&1 | tail -10`
Expected: PASS

**Step 5: Write dashboard view**

This is the main view component. It renders summary stat cards and an items grid. It receives data from the presenter and callbacks for edit/delete actions.

```tsx
// client/src/features/items/dashboard/dashboard.view.tsx
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stat,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { DashboardView } from './dashboard.presenter';
import type { Item } from '../types';

const STATUS_COLORS: Record<string, string> = {
  todo: 'blue',
  in_progress: 'orange',
  done: 'green',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

interface DashboardViewProps {
  view: DashboardView | null;
  isLoading: boolean;
  error: Error | null;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function DashboardView({
  view,
  isLoading,
  error,
  onEdit,
  onDelete,
}: DashboardViewProps) {
  if (isLoading) {
    return (
      <Flex justify="center" py="20">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p="4" bg="red.subtle" borderRadius="md">
        <Text color="red.fg">Failed to load items: {error.message}</Text>
      </Box>
    );
  }

  if (!view || view.renderAs === 'empty') {
    return (
      <VStack py="20" gap="4">
        <Heading size="md" color="fg.muted">
          No items yet
        </Heading>
        <Text color="fg.muted">Create your first item to get started.</Text>
      </VStack>
    );
  }

  const { counts, items } = view;

  return (
    <VStack gap="6" align="stretch">
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
        <StatCard label="Total" value={counts.total} colorPalette="gray" />
        <StatCard label="Todo" value={counts.todo} colorPalette="blue" />
        <StatCard
          label="In Progress"
          value={counts.inProgress}
          colorPalette="orange"
        />
        <StatCard label="Done" value={counts.done} colorPalette="green" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

function StatCard({
  label,
  value,
  colorPalette,
}: {
  label: string;
  value: number;
  colorPalette: string;
}) {
  return (
    <Card.Root size="sm" shadow="sm">
      <Card.Body>
        <Stat.Root>
          <Stat.Label color="fg.muted">{label}</Stat.Label>
          <Stat.ValueText
            fontSize="3xl"
            fontWeight="bold"
            color={`${colorPalette}.fg`}
          >
            {value}
          </Stat.ValueText>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card.Root shadow="sm" transition="shadow 0.2s" _hover={{ shadow: 'md' }}>
      <Card.Body gap="3">
        <Flex justify="space-between" align="start">
          <Heading size="sm" lineClamp={1}>
            {item.title}
          </Heading>
          <Badge
            colorPalette={STATUS_COLORS[item.status]}
            size="sm"
            flexShrink={0}
          >
            {STATUS_LABELS[item.status]}
          </Badge>
        </Flex>

        {item.description && (
          <Text color="fg.muted" fontSize="sm" lineClamp={2}>
            {item.description}
          </Text>
        )}

        <Flex justify="space-between" align="center">
          <HStack gap="2">
            <Badge variant="outline" size="sm">
              P{item.priority}
            </Badge>
            <Text fontSize="xs" color="fg.subtle">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </HStack>
          <HStack gap="1">
            <Button size="xs" variant="ghost" onClick={onEdit}>
              Edit
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={onDelete}
            >
              Delete
            </Button>
          </HStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
```

**Step 6: Commit**

```
feat: add dashboard presenter and view
```

---

### Task 5: Create item form

**Files:**

- Create: `client/src/features/items/create-item/create-item.schema.ts`
- Create: `client/src/features/items/create-item/create-item.controller.ts`
- Create: `client/src/features/items/create-item/create-item.view.tsx`

**Step 1: Create schema**

```ts
// client/src/features/items/create-item/create-item.schema.ts
import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
});

export type CreateItemFormValues = z.input<typeof createItemSchema>;
```

**Step 2: Create controller**

```ts
// client/src/features/items/create-item/create-item.controller.ts
import { useForm } from '@tanstack/react-form';
import { useCreateItem } from '../api/items.mutations';
import {
  createItemSchema,
  type CreateItemFormValues,
} from './create-item.schema';

export function useCreateItemController(options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useCreateItem();

  const form = useForm<CreateItemFormValues>({
    defaultValues: {
      title: '',
      description: '',
      priority: 3,
      status: 'todo',
    },
    validators: {
      onChange: createItemSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);
        options.onSuccess();
      } catch (err) {
        options.onError(
          err instanceof Error ? err : new Error('Failed to create item'),
        );
      }
    },
  });

  return { form, isSubmitting: mutation.isPending };
}
```

**Step 3: Create view**

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

type Controller = ReturnType<typeof useCreateItemController>;

interface CreateItemViewProps {
  form: Controller['form'];
  isSubmitting: boolean;
}

export function CreateItemView({ form, isSubmitting }: CreateItemViewProps) {
  return (
    <Box maxW="lg" mx="auto">
      <Heading size="xl" mb="6">
        Create Item
      </Heading>
      <Card.Root shadow="sm">
        <Card.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Stack gap="4">
              <form.Field
                name="title"
                children={(field) => (
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
                    <Field.Label>Title</Field.Label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Item title"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Field.ErrorText>
                        {field.state.meta.errors
                          .map((e) => e.message ?? e)
                          .join(', ')}
                      </Field.ErrorText>
                    )}
                  </Field.Root>
                )}
              />

              <form.Field
                name="description"
                children={(field) => (
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
              />

              <form.Field
                name="priority"
                children={(field) => (
                  <Field.Root>
                    <Field.Label>Priority</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={String(field.state.value)}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      >
                        <option value="1">1 - Lowest</option>
                        <option value="2">2 - Low</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - High</option>
                        <option value="5">5 - Highest</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                )}
              />

              <form.Field
                name="status"
                children={(field) => (
                  <Field.Root>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value as 'todo' | 'in_progress' | 'done',
                          )
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                )}
              />

              <Button
                type="submit"
                colorPalette="blue"
                loading={isSubmitting}
                alignSelf="flex-start"
              >
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

**Step 4: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 5: Commit**

```
feat: add create item form (schema + controller + view)
```

---

### Task 6: Edit item modal

**Files:**

- Create: `client/src/features/items/edit-item/edit-item.schema.ts`
- Create: `client/src/features/items/edit-item/edit-item.controller.ts`
- Create: `client/src/features/items/edit-item/edit-item.view.tsx`

**Step 1: Create schema**

```ts
// client/src/features/items/edit-item/edit-item.schema.ts
import { z } from 'zod';

export const editItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().nullable(),
  priority: z.coerce.number().int().min(1).max(5),
  status: z.enum(['todo', 'in_progress', 'done']),
});

export type EditItemFormValues = z.input<typeof editItemSchema>;
```

**Step 2: Create controller**

```ts
// client/src/features/items/edit-item/edit-item.controller.ts
import { useForm } from '@tanstack/react-form';
import { useUpdateItem } from '../api/items.mutations';
import { editItemSchema, type EditItemFormValues } from './edit-item.schema';
import type { Item } from '../types';

export function useEditItemController(
  item: Item,
  options: {
    onSuccess: () => void;
    onError: (error: Error) => void;
  },
) {
  const mutation = useUpdateItem();

  const form = useForm<EditItemFormValues>({
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
        await mutation.mutateAsync({
          id: item.id,
          input: {
            ...value,
            description: value.description || null,
          },
        });
        options.onSuccess();
      } catch (err) {
        options.onError(
          err instanceof Error ? err : new Error('Failed to update item'),
        );
      }
    },
  });

  return { form, isSubmitting: mutation.isPending };
}
```

**Step 3: Create edit modal view**

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
import type { useEditItemController } from './edit-item.controller';

type Controller = ReturnType<typeof useEditItemController>;

interface EditItemViewProps {
  open: boolean;
  onClose: () => void;
  form: Controller['form'];
  isSubmitting: boolean;
}

export function EditItemView({
  open,
  onClose,
  form,
  isSubmitting,
}: EditItemViewProps) {
  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
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
                  <form.Field
                    name="title"
                    children={(field) => (
                      <Field.Root invalid={field.state.meta.errors.length > 0}>
                        <Field.Label>Title</Field.Label>
                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors
                              .map((e) => e.message ?? e)
                              .join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="description"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="priority"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Priority</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={String(field.state.value)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          >
                            <option value="1">1 - Lowest</option>
                            <option value="2">2 - Low</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - High</option>
                            <option value="5">5 - Highest</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="status"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value as
                                  | 'todo'
                                  | 'in_progress'
                                  | 'done',
                              )
                            }
                          >
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  />
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="edit-item-form"
                colorPalette="blue"
                loading={isSubmitting}
              >
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

**Step 4: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 5: Commit**

```
feat: add edit item modal (schema + controller + view)
```

---

### Task 7: Delete item confirmation

**Files:**

- Create: `client/src/features/items/delete-item/delete-item.controller.ts`

**Step 1: Create controller**

The delete confirmation is a simple dialog — no schema needed. The controller wraps the delete mutation.

```ts
// client/src/features/items/delete-item/delete-item.controller.ts
import { useDeleteItem } from '../api/items.mutations';

export function useDeleteItemController(options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useDeleteItem();

  const handleDelete = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      options.onSuccess();
    } catch (err) {
      options.onError(
        err instanceof Error ? err : new Error('Failed to delete item'),
      );
    }
  };

  return { handleDelete, isDeleting: mutation.isPending };
}
```

The delete confirmation dialog itself will be inline in the route file since it's a simple alertdialog — no separate view file needed.

**Step 2: Commit**

```
feat: add delete item controller
```

---

### Task 8: Search controller + view

**Files:**

- Create: `client/src/features/items/search/search.controller.ts`
- Create: `client/src/features/items/search/search.view.tsx`

**Step 1: Create search controller with debounce**

```ts
// client/src/features/items/search/search.controller.ts
import { useState, useDeferredValue } from 'react';
import { useSearchItems } from '../api/items.queries';

export function useSearchController() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data, isLoading, error } = useSearchItems(deferredQuery);

  return {
    query,
    setQuery,
    results: data ?? [],
    isLoading,
    isStale: query !== deferredQuery,
    error: error instanceof Error ? error : null,
  };
}
```

**Step 2: Create search view**

```tsx
// client/src/features/items/search/search.view.tsx
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Item } from '../types';

const STATUS_COLORS: Record<string, string> = {
  todo: 'blue',
  in_progress: 'orange',
  done: 'green',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

interface SearchViewProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: Item[];
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
}

export function SearchView({
  query,
  onQueryChange,
  results,
  isLoading,
  isStale,
  error,
}: SearchViewProps) {
  return (
    <VStack gap="6" align="stretch">
      <Heading size="xl">Search Items</Heading>

      <Box position="relative">
        <Input
          placeholder="Search by title or description..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          size="lg"
        />
        {(isLoading || isStale) && (
          <Spinner
            size="sm"
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
          />
        )}
      </Box>

      {error && (
        <Box p="4" bg="red.subtle" borderRadius="md">
          <Text color="red.fg">Search failed: {error.message}</Text>
        </Box>
      )}

      {query.length > 0 && !isLoading && results.length === 0 && (
        <VStack py="12" gap="2">
          <Text color="fg.muted" fontSize="lg">
            No results found
          </Text>
          <Text color="fg.subtle" fontSize="sm">
            Try a different search term
          </Text>
        </VStack>
      )}

      {query.length === 0 && (
        <VStack py="12">
          <Text color="fg.muted">Type to search items</Text>
        </VStack>
      )}

      {results.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {results.map((item) => (
            <Card.Root key={item.id} shadow="sm">
              <Card.Body gap="3">
                <Flex justify="space-between" align="start">
                  <Heading size="sm" lineClamp={1}>
                    {item.title}
                  </Heading>
                  <Badge
                    colorPalette={STATUS_COLORS[item.status]}
                    size="sm"
                    flexShrink={0}
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </Flex>
                {item.description && (
                  <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                    {item.description}
                  </Text>
                )}
                <HStack gap="2">
                  <Badge variant="outline" size="sm">
                    P{item.priority}
                  </Badge>
                  <Text fontSize="xs" color="fg.subtle">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
```

**Step 3: Verify types compile**

Run: `cd client && npx tsc --noEmit --pretty 2>&1 | head -20`

**Step 4: Commit**

```
feat: add search controller and view
```

---

### Task 9: Route files (wiring everything together)

**Files:**

- Create: `client/src/routes/index.tsx`
- Create: `client/src/routes/items-search.tsx`
- Create: `client/src/routes/create-item.tsx`

**Step 1: Create dashboard route**

This is the route layer — it wires features together and handles toasts, navigation, and modal state.

```tsx
// client/src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { useItems } from '@/features/items/api/items.queries';
import { presentDashboard } from '@/features/items/dashboard/dashboard.presenter';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';
import { useEditItemController } from '@/features/items/edit-item/edit-item.controller';
import { EditItemView } from '@/features/items/edit-item/edit-item.view';
import { useDeleteItemController } from '@/features/items/delete-item/delete-item.controller';
import type { Item } from '@/features/items/types';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading, error } = useItems();
  const view = data ? presentDashboard(data) : null;

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  return (
    <>
      <DashboardView
        view={view}
        isLoading={isLoading}
        error={error}
        onEdit={setEditingItem}
        onDelete={setDeletingItem}
      />

      {editingItem && (
        <EditDialog item={editingItem} onClose={() => setEditingItem(null)} />
      )}

      <DeleteDialog item={deletingItem} onClose={() => setDeletingItem(null)} />
    </>
  );
}

function EditDialog({ item, onClose }: { item: Item; onClose: () => void }) {
  const { form, isSubmitting } = useEditItemController(item, {
    onSuccess: () => {
      toaster.success({ title: 'Item updated' });
      onClose();
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to update item',
        description: err.message,
      });
    },
  });

  return (
    <EditItemView
      open={true}
      onClose={onClose}
      form={form}
      isSubmitting={isSubmitting}
    />
  );
}

function DeleteDialog({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const { handleDelete, isDeleting } = useDeleteItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item deleted' });
      onClose();
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to delete item',
        description: err.message,
      });
    },
  });

  return (
    <Dialog.Root
      role="alertdialog"
      open={item !== null}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
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
                Are you sure you want to delete <strong>{item?.title}</strong>?
                This action cannot be undone.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                loading={isDeleting}
                onClick={() => item && handleDelete(item.id)}
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

**Step 2: Create search route**

```tsx
// client/src/routes/items-search.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useSearchController } from '@/features/items/search/search.controller';
import { SearchView } from '@/features/items/search/search.view';

export const Route = createFileRoute('/items-search')({
  component: SearchPage,
});

function SearchPage() {
  const { query, setQuery, results, isLoading, isStale, error } =
    useSearchController();

  return (
    <SearchView
      query={query}
      onQueryChange={setQuery}
      results={results}
      isLoading={isLoading}
      isStale={isStale}
      error={error}
    />
  );
}
```

**Step 3: Create create-item route**

```tsx
// client/src/routes/create-item.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toaster } from '@/components/ui/toaster';
import { useCreateItemController } from '@/features/items/create-item/create-item.controller';
import { CreateItemView } from '@/features/items/create-item/create-item.view';

export const Route = createFileRoute('/create-item')({
  component: CreateItemPage,
});

function CreateItemPage() {
  const navigate = useNavigate();

  const { form, isSubmitting } = useCreateItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item created' });
      navigate({ to: '/' });
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to create item',
        description: err.message,
      });
    },
  });

  return <CreateItemView form={form} isSubmitting={isSubmitting} />;
}
```

**Step 4: Generate route tree and verify**

Run: `cd client && npx vite build 2>&1 | tail -20`

If there are type errors, fix them before proceeding.

**Step 5: Commit**

```
feat: add route files wiring dashboard, search, and create pages
```

---

### Task 10: Smoke test

**Step 1: Start dev servers**

Run: `pnpm dev` (from project root)

**Step 2: Manual verification checklist**

- [ ] `/` loads, shows empty state
- [ ] Navigate to `/create-item`, fill form, submit — toast appears, redirects to dashboard
- [ ] Dashboard shows stat cards with correct counts
- [ ] Item cards display with status/priority badges
- [ ] Click Edit — modal opens with pre-populated values
- [ ] Save edit — toast, modal closes, data updates
- [ ] Click Delete — confirmation dialog shows item title
- [ ] Confirm delete — toast, item disappears
- [ ] Navigate to `/items-search`, type query — results appear with debounce
- [ ] Navigation links highlight active state
- [ ] Error states work (stop server, try actions)

**Step 3: Fix any issues found**

**Step 4: Final commit**

```
chore: complete items frontend smoke test
```
