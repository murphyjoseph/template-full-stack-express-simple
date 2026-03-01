import {
  Badge,
  Box,
  Button,
  Card,
  EmptyState,
  HStack,
  SimpleGrid,
  Spinner,
  Stat,
  Text,
  VStack,
} from '@chakra-ui/react';
import type {
  DashboardViewModel,
  ItemCardViewModel,
} from './dashboard.presenter';

type DashboardViewProps = {
  viewModel: DashboardViewModel;
  error: Error | null;
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
};

function SummaryStats({ counts }: { counts: DashboardViewModel['counts'] }) {
  const stats = [
    { label: 'Todo', value: counts.todo, color: 'gray.400' },
    { label: 'In Progress', value: counts.inProgress, color: 'orange.400' },
    { label: 'Done', value: counts.done, color: 'green.400' },
    { label: 'Total', value: counts.total, color: 'teal.500' },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
      {stats.map((stat) => (
        <Card.Root
          key={stat.label}
          variant="elevated"
          borderLeftWidth="4px"
          borderLeftColor={stat.color}
        >
          <Card.Body py="4">
            <Stat.Root>
              <Stat.Label
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {stat.label}
              </Stat.Label>
              <Stat.ValueText
                fontSize="3xl"
                fontWeight="700"
                fontFamily="heading"
              >
                {stat.value}
              </Stat.ValueText>
            </Stat.Root>
          </Card.Body>
        </Card.Root>
      ))}
    </SimpleGrid>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ItemCardViewModel;
  onEdit: (itemId: number) => void;
  onDelete: (itemId: number) => void;
}) {
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
          <Badge colorPalette={item.statusColor} size="sm">
            {item.statusLabel}
          </Badge>
        </HStack>
        {item.description && (
          <Text color="fg.muted" fontSize="sm" lineClamp={2}>
            {item.description}
          </Text>
        )}
        <HStack gap="2">
          <Badge variant="outline" size="sm">
            {item.priorityLabel}
          </Badge>
          <Text textStyle="xs" color="fg.muted">
            {item.createdAtFormatted}
          </Text>
        </HStack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end" gap="2" pt="0">
        <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)}>
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          colorPalette="red"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

export function DashboardView({
  viewModel,
  error,
  onEdit,
  onDelete,
}: DashboardViewProps) {
  if (error) {
    return (
      <Box p="4">
        <Text color="fg.error">Error: {error.message}</Text>
      </Box>
    );
  }

  if (viewModel.renderAs === 'loading') {
    return (
      <VStack justify="center" minH="300px">
        <Spinner size="lg" color="teal.500" />
      </VStack>
    );
  }

  if (viewModel.renderAs === 'empty') {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <VStack textAlign="center" gap="2">
            <EmptyState.Title fontFamily="heading" fontSize="xl">
              No items yet
            </EmptyState.Title>
            <EmptyState.Description>
              Create your first item to get started.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    );
  }

  return (
    <VStack gap="8" align="stretch">
      <SummaryStats counts={viewModel.counts} />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
        {viewModel.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}
