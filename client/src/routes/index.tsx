import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  return <div>Dashboard placeholder</div>;
}
