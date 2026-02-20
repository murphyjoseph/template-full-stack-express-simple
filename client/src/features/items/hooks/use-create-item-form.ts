import { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [status, setStatus] = useState('todo');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createItem = useCreateItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createItemSchema.safeParse({
      title,
      description,
      priority,
      status,
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0] ?? '',
        description: fieldErrors.description?.[0] ?? '',
        priority: fieldErrors.priority?.[0] ?? '',
        status: fieldErrors.status?.[0] ?? '',
      });
      return;
    }

    setErrors({});
    try {
      await createItem.mutateAsync(result.data);
      setTitle('');
      setDescription('');
      setPriority(3);
      setStatus('todo');
    } catch {
      setErrors({ title: 'Failed to create item. Please try again.' });
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    errors,
    isPending: createItem.isPending,
    handleSubmit,
  };
}
