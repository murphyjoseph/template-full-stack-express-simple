import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  NativeSelect,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import type { useCreateItemController } from './create-item.controller';

type Controller = ReturnType<typeof useCreateItemController>;

interface CreateItemViewProps {
  form: Controller['form'];
  isSubmitting: boolean;
}

export function CreateItemView({ form, isSubmitting }: CreateItemViewProps) {
  return (
    <Box maxW="lg" mx="auto">
      <Heading size="xl" mb="6">
        Create Item
      </Heading>
      <Card.Root shadow="sm">
        <Card.Body>
          <form
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
                      placeholder="Item title"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Field.ErrorText>
                        {field.state.meta.errors
                          .map((e) => e.message ?? e)
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
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
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
                            e.target.value as 'todo' | 'in_progress' | 'done',
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

              <Button
                type="submit"
                colorPalette="blue"
                loading={isSubmitting}
                alignSelf="flex-start"
              >
                Create Item
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
