import { createFileRoute } from '@tanstack/react-router';
import { Container, Heading, Text } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Container maxW="600px">
      <Heading size="2xl" mb="4">
        Welcome
      </Heading>
      <Text color="fg.muted">
        Full-stack template with React, Express, and Prisma.{' '}
        <Link to="/items" style={{ textDecoration: 'underline' }}>
          Check out the items demo
        </Link>
        .
      </Text>
    </Container>
  );
}
