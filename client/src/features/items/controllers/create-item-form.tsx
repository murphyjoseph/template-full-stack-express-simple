import { useCreateItemForm } from '../hooks/use-create-item-form';
import { CreateItemFormView } from '../views/create-item-form-view';

export function CreateItemForm() {
  const {
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    errors,
    isPending,
    handleSubmit,
  } = useCreateItemForm();

  return (
    <CreateItemFormView
      title={title}
      description={description}
      priority={priority}
      status={status}
      errors={errors}
      isPending={isPending}
      onTitleChange={setTitle}
      onDescriptionChange={setDescription}
      onPriorityChange={setPriority}
      onStatusChange={setStatus}
      onSubmit={handleSubmit}
    />
  );
}
