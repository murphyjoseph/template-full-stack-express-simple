import { useState } from 'react';
import { useItems, useDeleteItem } from '../api';

export function useItemList() {
  const { data: items, isLoading } = useItems();
  const { trigger: deleteItem, isMutating } = useDeleteItem();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteItem(id);
    setDeletingId(null);
  };

  return {
    items,
    isLoading,
    onDelete: handleDelete,
    deletingId: isMutating ? deletingId : null,
  };
}
