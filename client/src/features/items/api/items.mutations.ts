import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createItem, updateItem, deleteItem } from './items.api';
import { itemKeys } from './items.queries';
import type { CreateItemInput, UpdateItemInput } from '../types';

type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export function useCreateItem(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemInput) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}

export function useUpdateItem(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemInput }) =>
      updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}

export function useDeleteItem(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      callbacks?.onSuccess?.();
    },
    onError: callbacks?.onError,
  });
}
