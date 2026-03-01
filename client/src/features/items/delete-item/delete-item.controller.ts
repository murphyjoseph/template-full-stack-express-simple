import { useDeleteItem } from '../api/items.mutations';

export function useDeleteItemController(options: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useDeleteItem();

  const handleDelete = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      options.onSuccess();
    } catch (err) {
      options.onError(
        err instanceof Error ? err : new Error('Failed to delete item'),
      );
    }
  };

  return { handleDelete, isDeleting: mutation.isPending };
}
