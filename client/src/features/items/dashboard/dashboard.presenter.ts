import type { Item } from '../types';

interface StatusCounts {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

interface DashboardEmpty {
  renderAs: 'empty';
}

interface DashboardContent {
  renderAs: 'content';
  counts: StatusCounts;
  items: Item[];
}

export type DashboardView = DashboardEmpty | DashboardContent;

export function presentDashboard(items: Item[]): DashboardView {
  if (items.length === 0) {
    return { renderAs: 'empty' };
  }

  const counts: StatusCounts = {
    total: items.length,
    todo: items.filter((i) => i.status === 'todo').length,
    inProgress: items.filter((i) => i.status === 'in_progress').length,
    done: items.filter((i) => i.status === 'done').length,
  };

  return { renderAs: 'content', counts, items };
}
