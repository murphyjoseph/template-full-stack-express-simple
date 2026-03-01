import { useItems } from '../api/items.queries';
import { presentDashboard } from './dashboard.presenter';
import type { DashboardViewModel } from './dashboard.presenter';

export type DashboardControllerResult = {
  viewModel: DashboardViewModel;
  error: Error | null;
};

export function useDashboardController(): DashboardControllerResult {
  const { data: items, isLoading, error } = useItems();
  const viewModel = presentDashboard(items ?? [], isLoading);
  return { viewModel, error };
}
