import { useSearchForm } from '../hooks/use-search-form';
import { SearchInputView } from '../views/search-input-view';
import { SearchResultsView } from '../views/search-results-view';
import { Flex } from '@chakra-ui/react';

export function SearchController() {
  const {
    query,
    setQuery,
    deferredQuery,
    items,
    isLoading,
    isFetching,
    isError,
  } = useSearchForm();

  return (
    <Flex direction="column" gap="4">
      <SearchInputView query={query} onChange={setQuery} />
      <SearchResultsView
        items={items}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        query={deferredQuery}
      />
    </Flex>
  );
}
