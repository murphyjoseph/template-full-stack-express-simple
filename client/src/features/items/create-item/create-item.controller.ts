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
