import { useActionState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '@/lib/api-client';
import type { Item } from '../types';

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

type FormState = {
  errors?: Record<string, string>;
};

export function useCreateItemForm() {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const result = createItemSchema.safeParse({
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        status: formData.get('status'),
      });

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        return {
          errors: {
            title: fieldErrors.title?.[0] ?? '',
            description: fieldErrors.description?.[0] ?? '',
            priority: fieldErrors.priority?.[0] ?? '',
            status: fieldErrors.status?.[0] ?? '',
          },
        };
      }

      try {
        await api.post<Item>('/items', result.data);
      } catch {
        return {
          errors: {
            title: 'Failed to create item. Please try again.',
          } as Record<string, string>,
        };
      }

      await queryClient.invalidateQueries({ queryKey: ['items'] });
      formRef.current?.reset();
      return {} as FormState;
    },
    {},
  );

  return { formRef, formAction, isPending, errors: state.errors };
}
