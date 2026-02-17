import { useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useCreateItem } from '../api';

export function CreateItemForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const createItem = useCreateItem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Title is required');
      return;
    }
    if (trimmed.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }
    setError('');
    await createItem.mutateAsync({ title: trimmed });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="2" align="flex-start">
        <Box flex="1">
          <Input
            placeholder="New item title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && (
            <Text color="red.500" fontSize="sm" mt="1">
              {error}
            </Text>
          )}
        </Box>
        <Button
          type="submit"
          colorPalette="blue"
          loading={createItem.isPending}
        >
          Add
        </Button>
      </Flex>
    </form>
  );
}
