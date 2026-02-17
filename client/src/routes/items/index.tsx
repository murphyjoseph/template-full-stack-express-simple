import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Flex } from '@chakra-ui/react';
import { CreateItemForm } from '@/features/items/components/create-item-form';
import { ItemList } from '@/features/items/components/item-list';

export const Route = createFileRoute('/items/')({
  component: ItemsPage,
});

function ItemsPage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="4">
        Items
      </Heading>
      <Flex direction="column" gap="6">
        <CreateItemForm />
        <ItemList />
      </Flex>
    </Container>
  );
}
