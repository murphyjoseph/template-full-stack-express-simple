import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { Toaster } from '@/shared/toaster';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box as="header" bg="bg" borderBottomWidth="1px" py="3">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold" textStyle="lg">
              Items
            </Text>
            <HStack gap="6">
              <Link to="/">
                {({ isActive }: { isActive: boolean }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Dashboard
                  </Text>
                )}
              </Link>
              <Link to="/items-search">
                {({ isActive }: { isActive: boolean }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Search
                  </Text>
                )}
              </Link>
              <Link to="/create-item">
                {({ isActive }: { isActive: boolean }) => (
                  <Text
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'fg' : 'fg.muted'}
                    _hover={{ color: 'fg' }}
                  >
                    Create
                  </Text>
                )}
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
      <Container maxW="6xl" py="8">
        <Outlet />
      </Container>
      <Toaster />
    </Box>
  );
}
