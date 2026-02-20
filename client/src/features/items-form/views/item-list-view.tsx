import { Badge, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
import type { Item } from '../types';

const priorityColors: Record<number, string> = {
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'blue',
  5: 'gray',
};

const statusColors: Record<string, string> = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

interface ItemListViewProps {
  items: Item[] | undefined;
  isLoading: boolean;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function ItemListView({
  items,
  isLoading,
  onDelete,
  deletingId,
}: ItemListViewProps) {
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
          <Box flex="1">
            <Flex align="center" gap="2">
              <Text fontWeight="medium">{item.title}</Text>
              <Badge
                colorPalette={priorityColors[item.priority] ?? 'gray'}
                size="sm"
              >
                P{item.priority}
              </Badge>
              <Badge
                colorPalette={statusColors[item.status] ?? 'gray'}
                size="sm"
              >
                {statusLabels[item.status] ?? item.status}
              </Badge>
            </Flex>
            {item.description && (
              <Text fontSize="sm" color="fg.muted" mt="1">
                {item.description}
              </Text>
            )}
            <Text fontSize="xs" color="fg.muted" mt="1">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            colorPalette="red"
            onClick={() => onDelete(item.id)}
            loading={deletingId === item.id}
          >
            Delete
          </Button>
        </Flex>
      ))}
    </Flex>
  );
}
