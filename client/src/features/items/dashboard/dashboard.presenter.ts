import type { Item, ItemStatus } from '../types';

export type ItemCardViewModel = {
  id: number;
  title: string;
  description: string | null;
  priorityLabel: string;
  statusLabel: string;
  statusColor: string;
  createdAtFormatted: string;
};

export type DashboardViewModel = {
  renderAs: 'loading' | 'empty' | 'content';
  counts: { todo: number; inProgress: number; done: number; total: number };
  items: ItemCardViewModel[];
};

const STATUS_LABELS: Record<ItemStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

const STATUS_COLORS: Record<ItemStatus, string> = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
};

export function presentDashboard(
  items: Item[],
  isLoading: boolean,
): DashboardViewModel {
  if (isLoading) {
    return {
      renderAs: 'loading',
      counts: { todo: 0, inProgress: 0, done: 0, total: 0 },
      items: [],
    };
  }

  if (items.length === 0) {
    return {
      renderAs: 'empty',
      counts: { todo: 0, inProgress: 0, done: 0, total: 0 },
      items: [],
    };
  }

  const counts = {
    todo: items.filter((i) => i.status === 'todo').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
    total: items.length,
  };

  const mappedItems: ItemCardViewModel[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    priorityLabel: `P${item.priority}`,
    statusLabel: STATUS_LABELS[item.status],
    statusColor: STATUS_COLORS[item.status],
    createdAtFormatted: new Date(item.createdAt).toLocaleDateString(),
  }));

  return { renderAs: 'content', counts, items: mappedItems };
}
