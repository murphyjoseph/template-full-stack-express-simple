import { useForm } from '@tanstack/react-form';
import { useCreateItem } from '../api/items.mutations';
import { createItemSchema } from './create-item.schema';

type CreateItemCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useCreateItemController(callbacks?: CreateItemCallbacks) {
  const mutation = useCreateItem(callbacks);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 3,
      status: 'todo' as 'todo' | 'in_progress' | 'done',
    },
    onSubmit: ({ value }) => {
      const parsed = createItemSchema.safeParse(value);
      if (parsed.success) {
        mutation.mutate(parsed.data);
      }
    },
  });

  return { form, isPending: mutation.isPending };
}
