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
    { label: 'Todo', value: counts.todo },
    { label: 'In Progress', value: counts.inProgress },
    { label: 'Done', value: counts.done },
    { label: 'Total', value: counts.total },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
      {stats.map((stat) => (
        <Card.Root key={stat.label}>
          <Card.Body>
            <Stat.Root>
              <Stat.Label>{stat.label}</Stat.Label>
              <Stat.ValueText>{stat.value}</Stat.ValueText>
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
    <Card.Root>
      <Card.Body gap="2">
        <HStack justifyContent="space-between">
          <Card.Title>{item.title}</Card.Title>
          <Badge colorPalette={item.statusColor}>{item.statusLabel}</Badge>
        </HStack>
        {item.description && (
          <Text color="fg.muted" lineClamp={2}>
            {item.description}
          </Text>
        )}
        <HStack gap="2" mt="2">
          <Badge variant="outline">{item.priorityLabel}</Badge>
          <Text textStyle="xs" color="fg.muted">
            {item.createdAtFormatted}
          </Text>
        </HStack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" size="sm" onClick={() => onEdit(item.id)}>
          Edit
        </Button>
        <Button
          variant="outline"
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
      <VStack justify="center" minH="200px">
        <Spinner size="lg" />
      </VStack>
    );
  }

  if (viewModel.renderAs === 'empty') {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <VStack textAlign="center">
            <EmptyState.Title>No items yet</EmptyState.Title>
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
