import { useQuery } from '@tanstack/react-query';
import { getItems, searchItems } from './items.api';

export const itemKeys = {
  all: ['items'] as const,
  search: (q: string) => ['items', 'search', q] as const,
};

export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: getItems,
  });
}

export function useSearchItems(q: string) {
  return useQuery({
    queryKey: itemKeys.search(q),
    queryFn: () => searchItems(q),
  });
}
