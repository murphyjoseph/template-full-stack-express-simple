import { useState, useDeferredValue } from 'react';
import { useSearchItems } from '../api';

export function useSearchForm() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const {
    data: items,
    isLoading,
    isFetching,
    isError,
  } = useSearchItems(deferredQuery);

  return {
    query,
    setQuery,
    deferredQuery,
    items,
    isLoading,
    isFetching,
    isError,
  };
}
