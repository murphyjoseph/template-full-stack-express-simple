import type { CSSProperties } from 'react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Box, Container, Flex, Heading, HStack } from '@chakra-ui/react';
import { Toaster } from '@/shared/toaster.tsx';

export const Route = createRootRoute({
  component: RootLayout,
});

const navLink: CSSProperties = {
  color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.025em',
  paddingBottom: '4px',
  borderBottom: '2px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
};

const navLinkActive: CSSProperties = {
  ...navLink,
  color: '#FFFFFF',
  borderBottom: '2px solid rgba(255,255,255,0.35)',
};

function RootLayout() {
  return (
    <Box minH="100vh" bg="#FAFAF7">
      <Box as="nav" bg="gray.900" py="3.5">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="white">
              Items
            </Heading>
            <HStack gap="6">
              <Link
                to="/"
                style={navLink}
                activeProps={{ style: navLinkActive }}
              >
                Dashboard
              </Link>
              <Link
                to="/items-search"
                style={navLink}
                activeProps={{ style: navLinkActive }}
              >
                Search
              </Link>
              <Link
                to="/create-item"
                style={navLink}
                activeProps={{ style: navLinkActive }}
              >
                Create
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
