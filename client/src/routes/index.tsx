import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import { toaster } from '@/components/ui/create-toaster';
import { useItems } from '@/features/items/api/items.queries';
import { presentDashboard } from '@/features/items/dashboard/dashboard.presenter';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';
import { useEditItemController } from '@/features/items/edit-item/edit-item.controller';
import { EditItemView } from '@/features/items/edit-item/edit-item.view';
import { useDeleteItemController } from '@/features/items/delete-item/delete-item.controller';
import type { Item } from '@/features/items/types';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data, isLoading, error } = useItems();
  const view = data ? presentDashboard(data) : null;

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  return (
    <>
      <DashboardView
        view={view}
        isLoading={isLoading}
        error={error}
        onEdit={setEditingItem}
        onDelete={setDeletingItem}
      />

      {editingItem && (
        <EditDialog item={editingItem} onClose={() => setEditingItem(null)} />
      )}

      <DeleteDialog item={deletingItem} onClose={() => setDeletingItem(null)} />
    </>
  );
}

function EditDialog({ item, onClose }: { item: Item; onClose: () => void }) {
  const { form, isSubmitting } = useEditItemController(item, {
    onSuccess: () => {
      toaster.success({ title: 'Item updated' });
      onClose();
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to update item',
        description: err.message,
      });
    },
  });

  return (
    <EditItemView
      open={true}
      onClose={onClose}
      form={form}
      isSubmitting={isSubmitting}
    />
  );
}

function DeleteDialog({
  item,
  onClose,
}: {
  item: Item | null;
  onClose: () => void;
}) {
  const { handleDelete, isDeleting } = useDeleteItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item deleted' });
      onClose();
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to delete item',
        description: err.message,
      });
    },
  });

  return (
    <Dialog.Root
      role="alertdialog"
      open={item !== null}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Item</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to delete <strong>{item?.title}</strong>?
                This action cannot be undone.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                loading={isDeleting}
                onClick={() => item && handleDelete(item.id)}
              >
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
