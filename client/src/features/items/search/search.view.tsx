import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { Item } from '../types';

const STATUS_COLORS: Record<string, string> = {
  todo: 'blue',
  in_progress: 'orange',
  done: 'green',
};

const STATUS_LABELS: Record<string, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

interface SearchViewProps {
  query: string;
  onQueryChange: (value: string) => void;
  results: Item[];
  isLoading: boolean;
  isStale: boolean;
  error: Error | null;
}

export function SearchView({
  query,
  onQueryChange,
  results,
  isLoading,
  isStale,
  error,
}: SearchViewProps) {
  return (
    <VStack gap="6" align="stretch">
      <Heading size="xl">Search Items</Heading>

      <Box position="relative">
        <Input
          placeholder="Search by title or description..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          size="lg"
        />
        {(isLoading || isStale) && (
          <Spinner
            size="sm"
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
          />
        )}
      </Box>

      {error && (
        <Box p="4" bg="red.subtle" borderRadius="md">
          <Text color="red.fg">Search failed: {error.message}</Text>
        </Box>
      )}

      {query.length > 0 && !isLoading && results.length === 0 && (
        <VStack py="12" gap="2">
          <Text color="fg.muted" fontSize="lg">
            No results found
          </Text>
          <Text color="fg.subtle" fontSize="sm">
            Try a different search term
          </Text>
        </VStack>
      )}

      {query.length === 0 && (
        <VStack py="12">
          <Text color="fg.muted">Type to search items</Text>
        </VStack>
      )}

      {results.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {results.map((item) => (
            <Card.Root key={item.id} shadow="sm">
              <Card.Body gap="3">
                <Flex justify="space-between" align="start">
                  <Heading size="sm" lineClamp={1}>
                    {item.title}
                  </Heading>
                  <Badge
                    colorPalette={STATUS_COLORS[item.status]}
                    size="sm"
                    flexShrink={0}
                  >
                    {STATUS_LABELS[item.status]}
                  </Badge>
                </Flex>
                {item.description && (
                  <Text color="fg.muted" fontSize="sm" lineClamp={2}>
                    {item.description}
                  </Text>
                )}
                <HStack gap="2">
                  <Badge variant="outline" size="sm">
                    P{item.priority}
                  </Badge>
                  <Text fontSize="xs" color="fg.subtle">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
}
