import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { api } from '@/lib/api-client';
import type { Item } from './types';

async function getItems() {
  return api.get<Item[]>('/items');
}

async function createItem(
  _key: string,
  {
    arg,
  }: {
    arg: {
      title: string;
      description?: string;
      priority?: number;
      status?: string;
    };
  },
) {
  return api.post<Item>('/items', arg);
}

async function deleteItem(_key: string, { arg }: { arg: number }) {
  return api.delete(`/items/${arg}`);
}

export function useItems() {
  return useSWR('items', getItems);
}

export function useCreateItem() {
  return useSWRMutation('items', createItem);
}

export function useDeleteItem() {
  return useSWRMutation('items', deleteItem);
}
