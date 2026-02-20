import { Flex, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

export function NavBar() {
  return (
    <Flex as="nav" gap="4" p="4" borderBottomWidth="1px">
      <ChakraLink asChild fontWeight="medium">
        <Link to="/">Home</Link>
      </ChakraLink>
      <ChakraLink asChild fontWeight="medium">
        <Link to="/items">Items</Link>
      </ChakraLink>
      <ChakraLink asChild fontWeight="medium">
        <Link to="/items-swr">Items (SWR)</Link>
      </ChakraLink>
      <ChakraLink asChild fontWeight="medium">
        <Link to="/items-form">Items (Form)</Link>
      </ChakraLink>
      <ChakraLink asChild fontWeight="medium">
        <Link to="/items-action">Items (Action)</Link>
      </ChakraLink>
      <ChakraLink asChild fontWeight="medium">
        <Link to="/items-search">Search</Link>
      </ChakraLink>
    </Flex>
  );
}
