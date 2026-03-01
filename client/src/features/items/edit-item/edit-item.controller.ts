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
