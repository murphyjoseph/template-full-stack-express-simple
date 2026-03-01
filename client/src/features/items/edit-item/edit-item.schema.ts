import { z } from 'zod';

export const editItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1).max(5),
  status: z.enum(['todo', 'in_progress', 'done']),
});

export type EditItemFormValues = z.infer<typeof editItemSchema>;
