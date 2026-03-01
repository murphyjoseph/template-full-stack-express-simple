import { createFileRoute } from '@tanstack/react-router';
import { useSearchController } from '@/features/items/search/search.controller';
import { SearchView } from '@/features/items/search/search.view';

export const Route = createFileRoute('/items-search')({
  component: SearchRoute,
});

function SearchRoute() {
  const controller = useSearchController();

  return (
    <SearchView
      query={controller.query}
      onQueryChange={controller.setQuery}
      items={controller.items}
      isLoading={controller.isLoading}
    />
  );
}
