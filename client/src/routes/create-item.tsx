import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toaster } from '@/components/ui/create-toaster';
import { useCreateItemController } from '@/features/items/create-item/create-item.controller';
import { CreateItemView } from '@/features/items/create-item/create-item.view';

export const Route = createFileRoute('/create-item')({
  component: CreateItemPage,
});

function CreateItemPage() {
  const navigate = useNavigate();

  const { form, isSubmitting } = useCreateItemController({
    onSuccess: () => {
      toaster.success({ title: 'Item created' });
      navigate({ to: '/' });
    },
    onError: (err) => {
      toaster.error({
        title: 'Failed to create item',
        description: err.message,
      });
    },
  });

  return <CreateItemView form={form} isSubmitting={isSubmitting} />;
}
