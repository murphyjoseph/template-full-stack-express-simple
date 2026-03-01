import { useDeleteItem } from '../api/items.mutations';

type UseDeleteItemControllerProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useDeleteItemController({
  onSuccess,
  onError,
}: UseDeleteItemControllerProps = {}) {
  const mutation = useDeleteItem({ onSuccess, onError });

  const handleDelete = (id: number) => {
    mutation.mutate(id);
  };

  return { handleDelete, isPending: mutation.isPending };
}
