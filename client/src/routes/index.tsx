import { createFileRoute } from '@tanstack/react-router';
import { toaster } from '@/shared/toaster-instance';
import { useDashboardController } from '@/features/items/dashboard/dashboard.controller';
import { DashboardView } from '@/features/items/dashboard/dashboard.view';

export const Route = createFileRoute('/')({
  component: DashboardRoute,
});

function DashboardRoute() {
  const controller = useDashboardController();

  return (
    <DashboardView
      {...controller}
      onEditSuccess={() => {
        controller.onEditClose();
        toaster.success({ title: 'Item updated successfully' });
      }}
      onEditError={(error) => {
        toaster.error({
          title: 'Failed to update item',
          description: error.message,
        });
      }}
      onDeleteSuccess={() => {
        controller.onDeleteClose();
        toaster.success({ title: 'Item deleted successfully' });
      }}
      onDeleteError={(error) => {
        toaster.error({
          title: 'Failed to delete item',
          description: error.message,
        });
      }}
    />
  );
}
