import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Box } from '@chakra-ui/react';
import { NavBar } from '@/components/nav-bar';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <Box minH="100vh">
      <NavBar />
      <Box p="6">
        <Outlet />
      </Box>
    </Box>
  );
}
