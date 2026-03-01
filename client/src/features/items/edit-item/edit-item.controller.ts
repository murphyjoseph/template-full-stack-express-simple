import { useForm } from '@tanstack/react-form';
import { useUpdateItem } from '../api/items.mutations';
import { editItemSchema } from './edit-item.schema';
import type { EditItemFormData } from './edit-item.schema';
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
    } as EditItemFormData,
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
