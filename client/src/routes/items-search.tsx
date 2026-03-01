import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/items-search')({
  component: SearchRoute,
});

function SearchRoute() {
  return <div>Search placeholder</div>;
}
