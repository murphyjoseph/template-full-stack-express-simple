import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { DashboardViewModel } from './dashboard.presenter';
import type { Item } from '../types';
import { EditItemDialog } from '../edit-item/edit-item.view';
import { DeleteItemDialog } from '../delete-item/delete-item.view';

type Props = {
  viewModel: DashboardViewModel;
  editItem: Item | null;
  deleteItem: Item | null;
  onEdit: (item: Item) => void;
  onEditClose: () => void;
  onDelete: (item: Item) => void;
  onDeleteClose: () => void;
  onEditSuccess: () => void;
  onEditError: (error: Error) => void;
  onDeleteSuccess: () => void;
  onDeleteError: (error: Error) => void;
};

export function DashboardView({
  viewModel,
  editItem,
  deleteItem,
  onEdit,
  onEditClose,
  onDelete,
  onDeleteClose,
  onEditSuccess,
  onEditError,
  onDeleteSuccess,
  onDeleteError,
}: Props) {
  if (viewModel.renderAs === 'loading') {
    return (
      <Box textAlign="center" py="20">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (viewModel.renderAs === 'error') {
    return (
      <Box textAlign="center" py="20">
        <Text color="fg.error">{viewModel.message}</Text>
      </Box>
    );
  }

  if (viewModel.renderAs === 'empty') {
    return (
      <Box textAlign="center" py="20">
        <Text color="fg.muted">No items yet. Create one to get started.</Text>
      </Box>
    );
  }

  const { summary, cards } = viewModel;

  return (
    <Stack gap="8">
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="4">
        <StatCard label="Total" value={summary.total} color="purple" />
        <StatCard label="To Do" value={summary.todo} color="gray" />
        <StatCard label="In Progress" value={summary.inProgress} color="blue" />
        <StatCard label="Done" value={summary.done} color="green" />
      </SimpleGrid>

      <Box>
        <Heading size="lg" mb="4">
          All Items
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
          {cards.map((card) => (
            <Card.Root key={card.id} variant="outline">
              <Card.Body gap="3">
                <HStack justify="space-between">
                  <Card.Title textStyle="md">{card.title}</Card.Title>
                  <HStack gap="1">
                    <Badge
                      size="sm"
                      colorPalette={card.priorityColor}
                      variant="subtle"
                    >
                      {card.priorityLabel}
                    </Badge>
                    <Badge
                      size="sm"
                      colorPalette={card.statusColor}
                      variant="solid"
                    >
                      {card.statusLabel}
                    </Badge>
                  </HStack>
                </HStack>
                {card.description && (
                  <Text color="fg.muted" textStyle="sm">
                    {card.description}
                  </Text>
                )}
                <Text color="fg.subtle" textStyle="xs">
                  {card.createdAt}
                </Text>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() =>
                    onEdit({
                      id: card.id,
                      title: card.title,
                      description: card.description,
                      priority: card.priority,
                      status: card.status,
                      createdAt: card.createdAt,
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  colorPalette="red"
                  onClick={() =>
                    onDelete({
                      id: card.id,
                      title: card.title,
                      description: card.description,
                      priority: card.priority,
                      status: card.status,
                      createdAt: card.createdAt,
                    })
                  }
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>

      {editItem && (
        <EditItemDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => {
            if (!open) onEditClose();
          }}
          onSuccess={onEditSuccess}
          onError={onEditError}
        />
      )}

      {deleteItem && (
        <DeleteItemDialog
          item={deleteItem}
          open={!!deleteItem}
          onOpenChange={(open) => {
            if (!open) onDeleteClose();
          }}
          onSuccess={onDeleteSuccess}
          onError={onDeleteError}
        />
      )}
    </Stack>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card.Root>
      <Card.Body py="4" px="5">
        <Text textStyle="sm" color="fg.muted">
          {label}
        </Text>
        <Text textStyle="3xl" fontWeight="bold" color={`${color}.fg`}>
          {value}
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
