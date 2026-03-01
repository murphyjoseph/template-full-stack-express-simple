import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { useSearchController } from './search.controller';
import type { Item } from '../types';

type Props = ReturnType<typeof useSearchController>;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  done: { label: 'Done', color: 'green' },
};

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: 'Critical', color: 'red' },
  2: { label: 'High', color: 'orange' },
  3: { label: 'Medium', color: 'yellow' },
  4: { label: 'Low', color: 'blue' },
  5: { label: 'Minimal', color: 'gray' },
};

export function SearchView({
  query,
  setQuery,
  items,
  isLoading,
  hasSearched,
}: Props) {
  return (
    <Stack gap="6">
      <Box>
        <Heading size="xl" mb="4">
          Search Items
        </Heading>
        <Input
          placeholder="Search by title or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
        />
      </Box>

      {isLoading && (
        <Box textAlign="center" py="10">
          <Spinner size="lg" />
        </Box>
      )}

      {!isLoading && hasSearched && items.length === 0 && (
        <Box textAlign="center" py="10">
          <Text color="fg.muted">No items found matching your search.</Text>
        </Box>
      )}

      {!isLoading && !hasSearched && (
        <Box textAlign="center" py="10">
          <Text color="fg.muted">Start typing to search items.</Text>
        </Box>
      )}

      {items.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {items.map((item: Item) => {
            const statusCfg = STATUS_CONFIG[item.status] ?? {
              label: item.status,
              color: 'gray',
            };
            const priorityCfg = PRIORITY_CONFIG[item.priority] ?? {
              label: 'Unknown',
              color: 'gray',
            };
            return (
              <Card.Root key={item.id} variant="outline">
                <Card.Body gap="3">
                  <HStack justify="space-between">
                    <Card.Title textStyle="md">{item.title}</Card.Title>
                    <HStack gap="1">
                      <Badge
                        size="sm"
                        colorPalette={priorityCfg.color}
                        variant="subtle"
                      >
                        {priorityCfg.label}
                      </Badge>
                      <Badge
                        size="sm"
                        colorPalette={statusCfg.color}
                        variant="solid"
                      >
                        {statusCfg.label}
                      </Badge>
                    </HStack>
                  </HStack>
                  {item.description && (
                    <Text color="fg.muted" textStyle="sm">
                      {item.description}
                    </Text>
                  )}
                  <Text color="fg.subtle" textStyle="xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </Card.Body>
              </Card.Root>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
