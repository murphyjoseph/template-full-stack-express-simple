import { Input } from '@chakra-ui/react';

interface SearchInputViewProps {
  query: string;
  onChange: (value: string) => void;
}

export function SearchInputView({ query, onChange }: SearchInputViewProps) {
  return (
    <Input
      placeholder="Search items by title or description..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
