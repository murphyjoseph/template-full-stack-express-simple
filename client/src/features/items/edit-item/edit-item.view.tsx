import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  NativeSelect,
  Portal,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import type { Item, ItemStatus } from '../types';
import { useEditItemController } from './edit-item.controller';

type Props = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export function EditItemDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
  onError,
}: Props) {
  const { form, isPending } = useEditItemController(item, {
    onSuccess: () => {
      onOpenChange(false);
      onSuccess();
    },
    onError,
  });

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Edit Item</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                id="edit-item-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <Stack gap="4">
                  <form.Field name="title">
                    {(field) => (
                      <Field.Root
                        invalid={field.state.meta.errors.length > 0}
                        required
                      >
                        <Field.Label>Title</Field.Label>
                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors.join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="description">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="priority">
                    {(field) => (
                      <Field.Root invalid={field.state.meta.errors.length > 0}>
                        <Field.Label>Priority</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={String(field.state.value)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          >
                            <option value="1">1 - Critical</option>
                            <option value="2">2 - High</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - Low</option>
                            <option value="5">5 - Minimal</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors.join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  </form.Field>

                  <form.Field name="status">
                    {(field) => (
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.value as ItemStatus)
                            }
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  </form.Field>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button type="submit" form="edit-item-form" loading={isPending}>
                Save
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
