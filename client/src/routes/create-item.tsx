import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toaster } from '@/shared/toaster-instance';
import { useCreateItemController } from '@/features/items/create-item/create-item.controller';
import { CreateItemView } from '@/features/items/create-item/create-item.view';

export const Route = createFileRoute('/create-item')({
  component: CreateItemRoute,
});

function CreateItemRoute() {
  const navigate = useNavigate();

  const controller = useCreateItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item created successfully' });
      navigate({ to: '/' });
    },
    onError: (error) => {
      toaster.error({
        title: 'Failed to create item',
        description: error.message,
      });
    },
  });

  return <CreateItemView {...controller} />;
}
