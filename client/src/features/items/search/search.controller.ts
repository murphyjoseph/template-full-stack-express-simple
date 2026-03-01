import { useState } from 'react';
import { useDebounce } from '@/shared/use-debounce';
import { useSearchItems } from '../api/items.queries';

export function useSearchController() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, error } = useSearchItems(debouncedQuery);

  return {
    query,
    setQuery,
    items: data ?? [],
    isLoading,
    error,
  };
}
