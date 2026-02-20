import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Text, Flex } from '@chakra-ui/react';
import { SearchController } from '@/features/items-search/controllers/search-controller';

export const Route = createFileRoute('/items-search/')({
  component: ItemsSearchPage,
});

function ItemsSearchPage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="2">
        Search Items
      </Heading>
      <Text color="fg.muted" mb="4">
        Autocomplete search across item titles and descriptions.
      </Text>
      <Flex direction="column" gap="6">
        <SearchController />
      </Flex>
    </Container>
  );
}
