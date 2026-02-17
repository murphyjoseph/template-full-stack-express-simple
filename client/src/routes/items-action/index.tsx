import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Flex, Text } from '@chakra-ui/react';
import { CreateItemForm } from '@/features/items-action/components/create-item-form';
import { ItemList } from '@/features/items-action/components/item-list';

export const Route = createFileRoute('/items-action/')({
  component: ItemsActionPage,
});

function ItemsActionPage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="2">
        Items (Action)
      </Heading>
      <Text color="fg.muted" mb="4">
        Same CRUD, using useActionState + Zod validation with React Query.
      </Text>
      <Flex direction="column" gap="6">
        <CreateItemForm />
        <ItemList />
      </Flex>
    </Container>
  );
}
