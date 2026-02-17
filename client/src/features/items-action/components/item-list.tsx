import { Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { useItems, useDeleteItem } from '../api';

export function ItemList() {
  const { data: items, isLoading } = useItems();
  const deleteItem = useDeleteItem();

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
            onClick={() => deleteItem.mutate(item.id)}
            loading={deleteItem.isPending && deleteItem.variables === item.id}
          >
            Delete
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
