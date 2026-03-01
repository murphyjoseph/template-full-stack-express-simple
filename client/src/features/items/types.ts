export type ItemStatus = 'todo' | 'in_progress' | 'done';

export interface Item {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  status: ItemStatus;
  createdAt: string;
}

export interface CreateItemInput {
  title: string;
  description?: string;
  priority?: number;
  status?: ItemStatus;
}

export interface UpdateItemInput {
  title?: string;
  description?: string | null;
  priority?: number;
  status?: ItemStatus;
}
