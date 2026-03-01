import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stat,
  Text,
  VStack,
} from '@chakra-ui/react';
import type { DashboardView } from './dashboard.presenter';
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

interface DashboardViewProps {
  view: DashboardView | null;
  isLoading: boolean;
  error: Error | null;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function DashboardView({
  view,
  isLoading,
  error,
  onEdit,
  onDelete,
}: DashboardViewProps) {
  if (isLoading) {
    return (
      <Flex justify="center" py="20">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box p="4" bg="red.subtle" borderRadius="md">
        <Text color="red.fg">Failed to load items: {error.message}</Text>
      </Box>
    );
  }

  if (!view || view.renderAs === 'empty') {
    return (
      <VStack py="20" gap="4">
        <Heading size="md" color="fg.muted">
          No items yet
        </Heading>
        <Text color="fg.muted">Create your first item to get started.</Text>
      </VStack>
    );
  }

  const { counts, items } = view;

  return (
    <VStack gap="6" align="stretch">
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
        <StatCard label="Total" value={counts.total} colorPalette="gray" />
        <StatCard label="Todo" value={counts.todo} colorPalette="blue" />
        <StatCard
          label="In Progress"
          value={counts.inProgress}
          colorPalette="orange"
        />
        <StatCard label="Done" value={counts.done} colorPalette="green" />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
}

function StatCard({
  label,
  value,
  colorPalette,
}: {
  label: string;
  value: number;
  colorPalette: string;
}) {
  return (
    <Card.Root size="sm" shadow="sm">
      <Card.Body>
        <Stat.Root>
          <Stat.Label color="fg.muted">{label}</Stat.Label>
          <Stat.ValueText
            fontSize="3xl"
            fontWeight="bold"
            color={`${colorPalette}.fg`}
          >
            {value}
          </Stat.ValueText>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

function ItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card.Root shadow="sm" transition="shadow 0.2s" _hover={{ shadow: 'md' }}>
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

        <Flex justify="space-between" align="center">
          <HStack gap="2">
            <Badge variant="outline" size="sm">
              P{item.priority}
            </Badge>
            <Text fontSize="xs" color="fg.subtle">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </HStack>
          <HStack gap="1">
            <Button size="xs" variant="ghost" onClick={onEdit}>
              Edit
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={onDelete}
            >
              Delete
            </Button>
          </HStack>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
