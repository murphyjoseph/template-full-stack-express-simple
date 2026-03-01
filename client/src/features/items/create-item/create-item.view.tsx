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
import type { ItemStatus } from '../types';
import type { useCreateItemController } from './create-item.controller';

type Props = ReturnType<typeof useCreateItemController>;

export function CreateItemView({ form, isPending }: Props) {
  return (
    <Box maxW="lg" mx="auto">
      <Heading size="xl" mb="6">
        Create Item
      </Heading>
      <Card.Root>
        <Card.Body>
          <form
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
                      placeholder="Item title"
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
                      placeholder="Optional description"
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

              <Button type="submit" loading={isPending} alignSelf="flex-start">
                Create Item
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
