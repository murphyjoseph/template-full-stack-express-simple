import {
  Badge,
  Card,
  EmptyState,
  Heading,
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
  in_progress: 'orange',
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
    <Card.Root
      variant="elevated"
      transition="all 0.2s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    >
      <Card.Body gap="3">
        <HStack justifyContent="space-between" alignItems="flex-start">
          <Card.Title fontFamily="heading" fontWeight="600">
            {item.title}
          </Card.Title>
          <Badge colorPalette={STATUS_COLORS[item.status]} size="sm">
            {STATUS_LABELS[item.status]}
          </Badge>
        </HStack>
        {item.description && (
          <Text color="fg.muted" fontSize="sm" lineClamp={2}>
            {item.description}
          </Text>
        )}
        <HStack gap="2">
          <Badge variant="outline" size="sm">
            P{item.priority}
          </Badge>
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
        <Spinner size="lg" color="teal.500" />
      </VStack>
    );
  }

  if (!query) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title color="fg.muted">
            Enter a search term to find items
          </EmptyState.Title>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Title>No results found</EmptyState.Title>
          <EmptyState.Description>
            Try a different search term.
          </EmptyState.Description>
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
      <Heading fontFamily="heading" size="2xl">
        Search
      </Heading>
      <Input
        placeholder="Search items by title or description..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        size="lg"
      />
      <SearchResults query={query} items={items} isLoading={isLoading} />
    </VStack>
  );
}
