import { useDeleteItem } from '../api/items.mutations';

export function useDeleteItemController(callbacks: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) {
  const mutation = useDeleteItem();

  const handleDelete = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      callbacks.onSuccess();
    } catch (err) {
      callbacks.onError(
        err instanceof Error ? err : new Error('Failed to delete item'),
      );
    }
  };

  return { handleDelete, isPending: mutation.isPending };
}
