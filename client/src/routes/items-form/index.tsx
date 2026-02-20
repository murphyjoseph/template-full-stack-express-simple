import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Flex, Text } from '@chakra-ui/react';
import { CreateItemForm } from '@/features/items-form/controllers/create-item-form';
import { ItemList } from '@/features/items-form/controllers/item-list';

export const Route = createFileRoute('/items-form/')({
  component: ItemsFormPage,
});

function ItemsFormPage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="2">
        Items (TanStack Form)
      </Heading>
      <Text color="fg.muted" mb="4">
        Same CRUD, using TanStack Form + React Query with validation.
      </Text>
      <Flex direction="column" gap="6">
        <CreateItemForm />
        <ItemList />
      </Flex>
    </Container>
  );
}
