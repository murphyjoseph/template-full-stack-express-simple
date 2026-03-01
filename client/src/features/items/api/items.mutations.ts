import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem, deleteItem } from './items.api';
import { itemKeys } from './items.queries';
import type { CreateItemInput, UpdateItemInput } from '../types';

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateItemInput) => createItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateItemInput }) =>
      updateItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
