import { createFileRoute } from '@tanstack/react-router';
import { useDashboardController } from '@/features/items/dashboard/dashboard.controller';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const { viewModel, error } = useDashboardController();

  return (
    <DashboardView
      viewModel={viewModel}
      error={error}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  );
}
