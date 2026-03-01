import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Box, Container, Flex, HStack, Heading } from '@chakra-ui/react';
import { Toaster } from '@/components/ui/toaster';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box as="header" bg="bg" borderBottomWidth="1px" py="3">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading size="lg">Items</Heading>
            <HStack gap="4">
              <Link to="/">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Dashboard
                  </Box>
                )}
              </Link>
              <Link to="/items-search">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Search
                  </Box>
                )}
              </Link>
              <Link to="/create-item">
                {({ isActive }) => (
                  <Box
                    fontWeight={isActive ? 'bold' : 'normal'}
                    color={isActive ? 'colorPalette.fg' : 'fg.muted'}
                  >
                    Create
                  </Box>
                )}
              </Link>
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
