import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import type { Item } from '../types';
import { useDeleteItemController } from './delete-item.controller';

type Props = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export function DeleteItemDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: Props) {
  const { handleDelete, isPending } = useDeleteItemController({
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
    onError,
  });

  return (
    <Dialog.Root
      role="alertdialog"
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
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
                Are you sure you want to delete <strong>{item.title}</strong>?
                This action cannot be undone.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="red"
                loading={isPending}
                onClick={() => handleDelete(item.id)}
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
