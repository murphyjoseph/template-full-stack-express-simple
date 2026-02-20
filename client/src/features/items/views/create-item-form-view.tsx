import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import {
  NativeSelectField,
  NativeSelectRoot,
} from '@chakra-ui/react/native-select';

interface CreateItemFormViewProps {
  title: string;
  description: string;
  priority: number;
  status: string;
  errors: Record<string, string>;
  isPending: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriorityChange: (value: number) => void;
  onStatusChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateItemFormView({
  title,
  description,
  priority,
  status,
  errors,
  isPending,
  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onStatusChange,
  onSubmit,
}: CreateItemFormViewProps) {
  return (
    <form onSubmit={onSubmit}>
      <Flex direction="column" gap="3">
        <Box>
          <Input
            placeholder="New item title..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          {errors.title && (
            <Text color="red.500" fontSize="sm" mt="1">
              {errors.title}
            </Text>
          )}
        </Box>
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
        />
        <Flex gap="3">
          <Box flex="1">
            <NativeSelectRoot>
              <NativeSelectField
                value={String(priority)}
                onChange={(e) => onPriorityChange(Number(e.target.value))}
              >
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
              <NativeSelectField
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
              >
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
