import { createFileRoute } from '@tanstack/react-router';
import { useSearchController } from '@/features/items/search/search.controller';
import { SearchView } from '@/features/items/search/search.view';

export const Route = createFileRoute('/items-search')({
  component: SearchPage,
});

function SearchPage() {
  const { query, setQuery, results, isLoading, isStale, error } =
    useSearchController();

  return (
    <SearchView
      query={query}
      onQueryChange={setQuery}
      results={results}
      isLoading={isLoading}
      isStale={isStale}
      error={error}
    />
  );
}
