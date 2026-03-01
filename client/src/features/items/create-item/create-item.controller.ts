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

  const defaultValues: CreateItemFormValues = {
    title: '',
    description: '',
    priority: 3,
    status: 'todo',
  };

  const form = useForm({
    defaultValues,
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
