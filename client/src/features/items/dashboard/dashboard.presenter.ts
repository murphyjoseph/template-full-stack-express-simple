import type { Item, ItemStatus } from '../types';

type StatusCounts = {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
};

type CardViewModel = {
  id: number;
  title: string;
  description: string | null;
  priority: number;
  priorityLabel: string;
  priorityColor: string;
  status: ItemStatus;
  statusLabel: string;
  statusColor: string;
  createdAt: string;
};

type DashboardContent = {
  renderAs: 'content';
  summary: StatusCounts;
  cards: CardViewModel[];
};

type DashboardLoading = { renderAs: 'loading' };
type DashboardError = { renderAs: 'error'; message: string };
type DashboardEmpty = { renderAs: 'empty' };

export type DashboardViewModel =
  | DashboardLoading
  | DashboardError
  | DashboardEmpty
  | DashboardContent;

const PRIORITY_COLORS: Record<number, string> = {
  1: 'red',
  2: 'orange',
  3: 'yellow',
  4: 'blue',
  5: 'gray',
};

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Critical',
  2: 'High',
  3: 'Medium',
  4: 'Low',
  5: 'Minimal',
};

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string }> = {
  todo: { label: 'To Do', color: 'gray' },
  in_progress: { label: 'In Progress', color: 'blue' },
  done: { label: 'Done', color: 'green' },
};

export function presentDashboard(
  items: Item[] | undefined,
  isLoading: boolean,
  error: Error | null,
): DashboardViewModel {
  if (isLoading) return { renderAs: 'loading' };
  if (error) return { renderAs: 'error', message: error.message };
  if (!items || items.length === 0) return { renderAs: 'empty' };

  const summary: StatusCounts = {
    total: items.length,
    todo: items.filter((i) => i.status === 'todo').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
  };

  const cards: CardViewModel[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    priority: item.priority,
    priorityLabel: PRIORITY_LABELS[item.priority] ?? 'Unknown',
    priorityColor: PRIORITY_COLORS[item.priority] ?? 'gray',
    status: item.status,
    statusLabel: STATUS_CONFIG[item.status]?.label ?? item.status,
    statusColor: STATUS_CONFIG[item.status]?.color ?? 'gray',
    createdAt: new Date(item.createdAt).toLocaleDateString(),
  }));

  return { renderAs: 'content', summary, cards };
}
