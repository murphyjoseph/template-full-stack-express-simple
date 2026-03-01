import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Box, Container, Flex, Heading, HStack } from '@chakra-ui/react';
import { Toaster } from '@/shared/toaster.tsx';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh">
      <Box as="nav" borderBottomWidth="1px" py="3">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading size="md">Items App</Heading>
            <HStack gap="6">
              <Link to="/">Dashboard</Link>
              <Link to="/items-search">Search</Link>
              <Link to="/create-item">Create</Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="6xl" py="6">
        <Outlet />
      </Container>
      <Toaster />
    </Box>
  );
}
