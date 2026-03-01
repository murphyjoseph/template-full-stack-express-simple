import { useState } from 'react';
import { useSearchItems } from '../api/items.queries';
import { useDebounce } from '@/shared/use-debounce';

export function useSearchController() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, error } = useSearchItems(debouncedQuery);

  return {
    query,
    setQuery,
    items: data ?? [],
    isLoading: isLoading && debouncedQuery.length > 0,
    error,
    hasSearched: debouncedQuery.length > 0,
  };
}
