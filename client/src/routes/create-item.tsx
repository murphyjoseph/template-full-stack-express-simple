import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-item')({
  component: CreateItemRoute,
});

function CreateItemRoute() {
  return <div>Create item placeholder</div>;
}
