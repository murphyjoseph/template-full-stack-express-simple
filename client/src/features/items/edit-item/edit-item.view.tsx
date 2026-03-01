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
import type { useEditItemController } from './edit-item.controller';

type Controller = ReturnType<typeof useEditItemController>;

interface EditItemViewProps {
  open: boolean;
  onClose: () => void;
  form: Controller['form'];
  isSubmitting: boolean;
}

export function EditItemView({
  open,
  onClose,
  form,
  isSubmitting,
}: EditItemViewProps) {
  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
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
                  <form.Field
                    name="title"
                    children={(field) => (
                      <Field.Root invalid={field.state.meta.errors.length > 0}>
                        <Field.Label>Title</Field.Label>
                        <Input
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <Field.ErrorText>
                            {field.state.meta.errors
                              .map((e) =>
                                typeof e === 'string' ? e : (e?.message ?? ''),
                              )
                              .filter(Boolean)
                              .join(', ')}
                          </Field.ErrorText>
                        )}
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="description"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="priority"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Priority</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={String(field.state.value)}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          >
                            <option value="1">1 - Lowest</option>
                            <option value="2">2 - Low</option>
                            <option value="3">3 - Medium</option>
                            <option value="4">4 - High</option>
                            <option value="5">5 - Highest</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  />

                  <form.Field
                    name="status"
                    children={(field) => (
                      <Field.Root>
                        <Field.Label>Status</Field.Label>
                        <NativeSelect.Root>
                          <NativeSelect.Field
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value as
                                  | 'todo'
                                  | 'in_progress'
                                  | 'done',
                              )
                            }
                          >
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    )}
                  />
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                form="edit-item-form"
                colorPalette="blue"
                loading={isSubmitting}
              >
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
