import { createFileRoute } from '@tanstack/react-router';
import { useSearchController } from '@/features/items/search/search.controller';
import { SearchView } from '@/features/items/search/search.view';

export const Route = createFileRoute('/items-search')({
  component: SearchRoute,
});

function SearchRoute() {
  const controller = useSearchController();
  return <SearchView {...controller} />;
}
