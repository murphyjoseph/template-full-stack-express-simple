import {
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

type CreateItemViewProps = {
  form: ReturnType<typeof useCreateItemController>['form'];
  isPending: boolean;
};

export function CreateItemView({ form, isPending }: CreateItemViewProps) {
  return (
    <Stack align="center" py="10">
      <Heading size="2xl" mb="4">
        Create Item
      </Heading>
      <Card.Root variant="elevated" maxW="lg" w="full">
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
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
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
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
                    <Field.Label>Description</Field.Label>
                    <Textarea
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

              <form.Field name="priority">
                {(field) => (
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
                    <Field.Label>Priority</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={String(field.state.value)}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      >
                        <option value="1">1 - Highest</option>
                        <option value="2">2 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - Low</option>
                        <option value="5">5 - Lowest</option>
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
                  <Field.Root invalid={field.state.meta.errors.length > 0}>
                    <Field.Label>Status</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={field.state.value}
                        onBlur={field.handleBlur}
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
                    {field.state.meta.errors.length > 0 && (
                      <Field.ErrorText>
                        {field.state.meta.errors.join(', ')}
                      </Field.ErrorText>
                    )}
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
    </Stack>
  );
}
