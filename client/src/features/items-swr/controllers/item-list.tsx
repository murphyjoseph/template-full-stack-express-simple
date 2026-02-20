import { useItemList } from '../hooks/use-item-list';
import { ItemListView } from '../views/item-list-view';

export function ItemList() {
  const { items, isLoading, onDelete, deletingId } = useItemList();
  return (
    <ItemListView
      items={items}
      isLoading={isLoading}
      onDelete={onDelete}
      deletingId={deletingId}
    />
  );
}
