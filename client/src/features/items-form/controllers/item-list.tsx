import { useItems, useDeleteItem } from '../api';
import { ItemListView } from '../views/item-list-view';

export function ItemList() {
  const { data: items, isLoading } = useItems();
  const deleteItem = useDeleteItem();

  return (
    <ItemListView
      items={items}
      isLoading={isLoading}
      onDelete={(id) => deleteItem.mutate(id)}
      deletingId={deleteItem.isPending ? (deleteItem.variables ?? null) : null}
    />
  );
}
