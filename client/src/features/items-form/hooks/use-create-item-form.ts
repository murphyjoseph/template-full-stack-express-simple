import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useCreateItem } from '../api';

const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
});

export function useCreateItemForm() {
  const createItem = useCreateItem();

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 3,
      status: 'todo' as 'todo' | 'in_progress' | 'done',
    },
    validators: {
      onSubmit: ({ value }) => {
        const result = createItemSchema.safeParse(value);
        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          return {
            fields: {
              title: fieldErrors.title?.[0],
              description: fieldErrors.description?.[0],
              priority: fieldErrors.priority?.[0],
              status: fieldErrors.status?.[0],
            },
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const parsed = createItemSchema.parse(value);
      try {
        await createItem.mutateAsync(parsed);
        form.reset();
      } catch {
        form.setErrorMap({
          onSubmit: 'Failed to create item. Please try again.',
        });
      }
    },
  });

  return form;
}

export type CreateItemFormApi = ReturnType<typeof useCreateItemForm>;
