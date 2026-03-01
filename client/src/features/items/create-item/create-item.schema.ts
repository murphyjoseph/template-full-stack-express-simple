import { z } from 'zod';
import type { ItemStatus } from '../types';

export const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim(),
  priority: z.coerce.number().int().min(1, 'Min 1').max(5, 'Max 5'),
  status: z.enum(['todo', 'in_progress', 'done']),
});

export type CreateItemFormData = {
  title: string;
  description: string;
  priority: number;
  status: ItemStatus;
};
