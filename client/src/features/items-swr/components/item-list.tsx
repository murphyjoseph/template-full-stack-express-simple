import { useState } from 'react';
import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useItems, useDeleteItem } from '../api';

export function ItemList() {
  const { data: items, isLoading } = useItems();
  const { trigger: deleteItem, isMutating } = useDeleteItem();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    await deleteItem(id);
    setDeletingId(null);
  };

  if (isLoading) return <Spinner />;

  if (!items?.length) {
    return <Text color="fg.muted">No items yet. Create one above!</Text>;
  }

  return (
    <Flex direction="column" gap="2">
      {items.map((item) => (
        <Flex
          key={item.id}
          align="center"
          justify="space-between"
          p="3"
          borderWidth="1px"
          rounded="md"
        >
          <Box>
            <Text fontWeight="medium">{item.title}</Text>
            <Text fontSize="xs" color="fg.muted">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="red"
            onClick={() => handleDelete(item.id)}
            loading={isMutating && deletingId === item.id}
          >
            Delete
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
