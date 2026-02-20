import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Item } from './types';

export function useSearchItems(query: string) {
  return useQuery({
    queryKey: ['items', 'search', query],
    queryFn: () =>
      api.get<Item[]>(`/items/search?q=${encodeURIComponent(query)}`),
    placeholderData: (prev) => prev,
  });
}
