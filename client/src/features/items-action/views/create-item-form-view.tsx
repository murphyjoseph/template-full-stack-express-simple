import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@chakra-ui/react/native-select';

interface CreateItemFormViewProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  errors?: Record<string, string>;
}

export function CreateItemFormView({
  formRef,
  formAction,
  isPending,
  errors,
}: CreateItemFormViewProps) {
  return (
    <form ref={formRef} action={formAction}>
      <Flex direction="column" gap="3">
        <Box>
          <Input name="title" placeholder="New item title..." />
          {errors?.title && (
            <Text color="red.500" fontSize="sm" mt="1">
              {errors.title}
            </Text>
          )}
        </Box>
        <Textarea
          name="description"
          placeholder="Description (optional)"
          rows={2}
        />
        <Flex gap="3">
          <Box flex="1">
            <NativeSelectRoot>
              <NativeSelectField name="priority" defaultValue="3">
                <option value="1">Priority 1 (Highest)</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3 (Default)</option>
                <option value="4">Priority 4</option>
                <option value="5">Priority 5 (Lowest)</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
          <Box flex="1">
            <NativeSelectRoot>
              <NativeSelectField name="status" defaultValue="todo">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>
          <Button type="submit" colorPalette="blue" loading={isPending}>
            Add
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
