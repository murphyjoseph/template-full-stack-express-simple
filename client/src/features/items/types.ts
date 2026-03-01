export type ItemStatus = 'todo' | 'in_progress' | 'done';

export type Item = {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  status: ItemStatus;
  createdAt: string;
};

export type ItemFormData = {
  title: string;
  description: string;
  priority: number;
  status: ItemStatus;
};
