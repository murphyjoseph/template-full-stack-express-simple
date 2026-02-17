import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Flex, Text } from '@chakra-ui/react';
import { CreateItemForm } from '@/features/items-swr/components/create-item-form';
import { ItemList } from '@/features/items-swr/components/item-list';

export const Route = createFileRoute('/items-swr/')({
  component: ItemsSwrPage,
});

function ItemsSwrPage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="2">
        Items (SWR)
      </Heading>
      <Text color="fg.muted" mb="4">
        Same CRUD, using SWR for fetching + useActionState with Zod validation.
      </Text>
      <Flex direction="column" gap="6">
        <CreateItemForm />
        <ItemList />
      </Flex>
    </Container>
  );
}
