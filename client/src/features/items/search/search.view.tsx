import {
  Badge,
  Card,
  EmptyState,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Item, ItemStatus } from '../types';

const STATUS_LABELS: Record<ItemStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

const STATUS_COLORS: Record<ItemStatus, string> = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
};

type SearchViewProps = {
  query: string;
  onQueryChange: (query: string) => void;
  items: Item[];
  isLoading: boolean;
};

function ResultCard({ item }: { item: Item }) {
  return (
    <Card.Root>
      <Card.Body gap="2">
        <HStack justifyContent="space-between">
          <Card.Title>{item.title}</Card.Title>
          <Badge colorPalette={STATUS_COLORS[item.status]}>
            {STATUS_LABELS[item.status]}
          </Badge>
        </HStack>
        {item.description && (
          <Text color="fg.muted" lineClamp={2}>
            {item.description}
          </Text>
        )}
        <HStack gap="2" mt="2">
          <Badge variant="outline">P{item.priority}</Badge>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

function SearchResults({
  query,
  items,
  isLoading,
}: Omit<SearchViewProps, 'onQueryChange'>) {
  if (isLoading && query) {
    return (
      <VStack justify="center" minH="200px">
        <Spinner size="lg" />
      </VStack>
    );
  }

  if (!query) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title>Enter a search term</EmptyState.Title>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title>No results found</EmptyState.Title>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </SimpleGrid>
  );
}

export function SearchView({
  query,
  onQueryChange,
  items,
  isLoading,
}: SearchViewProps) {
  return (
    <VStack gap="6" align="stretch">
      <Input
        placeholder="Search items..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <SearchResults query={query} items={items} isLoading={isLoading} />
    </VStack>
  );
}
