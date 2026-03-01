import { z } from 'zod';

export const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim(),
  priority: z.number().int().min(1).max(5),
  status: z.enum(['todo', 'in_progress', 'done']),
});

export type CreateItemFormValues = z.input<typeof createItemSchema>;
