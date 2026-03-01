import { useForm } from '@tanstack/react-form';
import { useUpdateItem } from '../api/items.mutations';
import { editItemSchema } from './edit-item.schema';
import type { EditItemFormValues } from './edit-item.schema';

type UseEditItemControllerProps = {
  itemId: number;
  defaultValues: EditItemFormValues;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useEditItemController({
  itemId,
  defaultValues,
  onSuccess,
  onError,
}: UseEditItemControllerProps) {
  const mutation = useUpdateItem({ onSuccess, onError });

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const parsed = editItemSchema.safeParse(value);
      if (parsed.success) {
        mutation.mutate({ id: itemId, data: parsed.data });
      }
    },
  });

  return { form, isPending: mutation.isPending };
}
