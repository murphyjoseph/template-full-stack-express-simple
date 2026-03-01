import { useState } from 'react';
import { useItems } from '../api/items.queries';
import { presentDashboard } from './dashboard.presenter';
import type { Item } from '../types';

export function useDashboardController() {
  const { data, isLoading, error } = useItems();
  const viewModel = presentDashboard(data, isLoading, error);

  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);

  return {
    viewModel,
    editItem,
    deleteItem,
    onEdit: (item: Item) => setEditItem(item),
    onEditClose: () => setEditItem(null),
    onDelete: (item: Item) => setDeleteItem(item),
    onDeleteClose: () => setDeleteItem(null),
  };
}
