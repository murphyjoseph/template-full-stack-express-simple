import { useCreateItemForm } from '../hooks/use-create-item-form';
import { CreateItemFormView } from '../views/create-item-form-view';

export function CreateItemForm() {
  const form = useCreateItemForm();
  return <CreateItemFormView form={form} />;
}
