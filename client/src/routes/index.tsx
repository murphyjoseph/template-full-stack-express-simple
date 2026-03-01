import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useDashboardController } from '@/features/items/dashboard/dashboard.controller';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';
import { useItems } from '@/features/items/api/items.queries';
import { useEditItemController } from '@/features/items/edit-item/edit-item.controller';
import { EditItemView } from '@/features/items/edit-item/edit-item.view';
import { useDeleteItemController } from '@/features/items/delete-item/delete-item.controller';
import { DeleteItemView } from '@/features/items/delete-item/delete-item.view';
import { toaster } from '@/shared/toaster';
import type { Item } from '@/features/items/types';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { viewModel, error } = useDashboardController();
  const { data: items } = useItems();

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const editingItem = editingItemId
    ? (items?.find((item) => item.id === editingItemId) ?? null)
    : null;

  const deletingItem = deletingItemId
    ? (items?.find((item) => item.id === deletingItemId) ?? null)
    : null;

  return (
    <>
      <DashboardView
        viewModel={viewModel}
        error={error}
        onEdit={setEditingItemId}
        onDelete={setDeletingItemId}
      />

      {editingItem && (
        <EditItemDialog
          item={editingItem}
          open={editingItemId !== null}
          onOpenChange={(open) => {
            if (!open) setEditingItemId(null);
          }}
        />
      )}

      <DeleteItemDialog
        item={deletingItem}
        open={deletingItemId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingItemId(null);
        }}
      />
    </>
  );
}

function EditItemDialog({
  item,
  open,
  onOpenChange,
}: {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { form, isPending } = useEditItemController({
    itemId: item.id,
    defaultValues: {
      title: item.title,
      description: item.description ?? '',
      priority: item.priority,
      status: item.status,
    },
    onSuccess: () => {
      toaster.create({ title: 'Item updated', type: 'success' });
      onOpenChange(false);
    },
    onError: (err) => {
      toaster.create({ title: err.message, type: 'error' });
    },
  });

  return (
    <EditItemView
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      isPending={isPending}
    />
  );
}

function DeleteItemDialog({
  item,
  open,
  onOpenChange,
}: {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { handleDelete, isPending } = useDeleteItemController({
    onSuccess: () => {
      toaster.create({ title: 'Item deleted', type: 'success' });
      onOpenChange(false);
    },
    onError: (err) => {
      toaster.create({ title: err.message, type: 'error' });
    },
  });

  return (
    <DeleteItemView
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={() => {
        if (item) handleDelete(item.id);
      }}
      isPending={isPending}
      itemTitle={item?.title ?? ''}
    />
  );
}
