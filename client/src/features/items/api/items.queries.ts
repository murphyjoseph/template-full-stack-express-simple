import { useQuery } from '@tanstack/react-query';
import { fetchItems, searchItems } from './items.api';

export const itemKeys = {
  all: ['items'] as const,
  search: (q: string) => ['items', 'search', q] as const,
};

export function useItems() {
  return useQuery({
    queryKey: itemKeys.all,
    queryFn: fetchItems,
  });
}

export function useSearchItems(q: string) {
  return useQuery({
    queryKey: itemKeys.search(q),
    queryFn: () => searchItems(q),
    enabled: q.length > 0,
  });
}
