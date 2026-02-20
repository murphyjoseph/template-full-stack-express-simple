import { Badge, Flex, Spinner, Text } from '@chakra-ui/react';
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

interface SearchResultsViewProps {
  items: Item[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  query: string;
}

export function SearchResultsView({
  items,
  isLoading,
  isFetching,
  isError,
  query,
}: SearchResultsViewProps) {
  if (isLoading) return <Spinner />;

  if (isError) {
    return <Text color="red.500">Failed to search items.</Text>;
  }

  if (!items?.length) {
    return (
      <Text color="fg.muted">
        {query ? `No items matching "${query}"` : 'No items found'}
      </Text>
    );
  }

  return (
    <Flex
      direction="column"
      gap="2"
      opacity={isFetching ? 0.6 : 1}
      transition="opacity 0.2s"
    >
      {items.map((item) => (
        <Flex
          key={item.id}
          p="3"
          borderWidth="1px"
          rounded="md"
          direction="column"
          gap="1"
        >
          <Flex align="center" gap="2">
            <Text fontWeight="medium">{item.title}</Text>
            <Badge
              colorPalette={priorityColors[item.priority] ?? 'gray'}
              size="sm"
            >
              P{item.priority}
            </Badge>
            <Badge colorPalette={statusColors[item.status] ?? 'gray'} size="sm">
              {statusLabels[item.status] ?? item.status}
            </Badge>
          </Flex>
          {item.description && (
            <Text fontSize="sm" color="fg.muted">
              {item.description}
            </Text>
          )}
          <Text fontSize="xs" color="fg.muted">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}
