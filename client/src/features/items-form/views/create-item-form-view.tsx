import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@chakra-ui/react/native-select';
import type { CreateItemFormApi } from '../hooks/use-create-item-form';

interface CreateItemFormViewProps {
  form: CreateItemFormApi;
}

export function CreateItemFormView({ form }: CreateItemFormViewProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Flex direction="column" gap="3">
        <Box>
          <form.Field name="title">
            {(field) => (
              <>
                <Input
                  placeholder="New item title..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <Text color="red.500" fontSize="sm" mt="1">
                    {field.state.meta.errors.join(', ')}
                  </Text>
                )}
              </>
            )}
          </form.Field>
        </Box>
        <form.Field name="description">
          {(field) => (
            <Textarea
              placeholder="Description (optional)"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={2}
            />
          )}
        </form.Field>
        <Flex gap="3">
          <Box flex="1">
            <form.Field name="priority">
              {(field) => (
                <NativeSelectRoot>
                  <NativeSelectField
                    value={String(field.state.value)}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  >
                    <option value="1">Priority 1 (Highest)</option>
                    <option value="2">Priority 2</option>
                    <option value="3">Priority 3 (Default)</option>
                    <option value="4">Priority 4</option>
                    <option value="5">Priority 5 (Lowest)</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              )}
            </form.Field>
          </Box>
          <Box flex="1">
            <form.Field name="status">
              {(field) => (
                <NativeSelectRoot>
                  <NativeSelectField
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value as 'todo' | 'in_progress' | 'done',
                      )
                    }
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              )}
            </form.Field>
          </Box>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" colorPalette="blue" loading={isSubmitting}>
                Add
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </Flex>
      <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
        {(error) =>
          error ? (
            <Text color="red.500" fontSize="sm" mt="1">
              {error.toString()}
            </Text>
          ) : null
        }
      </form.Subscribe>
    </form>
  );
}
