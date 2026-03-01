import { useState, useDeferredValue } from 'react';
import { useSearchItems } from '../api/items.queries';

export function useSearchController() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { data, isLoading, error } = useSearchItems(deferredQuery);

  return {
    query,
    setQuery,
    results: data ?? [],
    isLoading,
    isStale: query !== deferredQuery,
    error: error instanceof Error ? error : null,
  };
}
