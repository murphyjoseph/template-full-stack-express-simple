import { useCreateItemForm } from '../hooks/use-create-item-form';
import { CreateItemFormView } from '../views/create-item-form-view';

export function CreateItemForm() {
  const { formRef, formAction, isPending, errors } = useCreateItemForm();
  return (
    <CreateItemFormView
      formRef={formRef}
      formAction={formAction}
      isPending={isPending}
      errors={errors}
    />
  );
}
