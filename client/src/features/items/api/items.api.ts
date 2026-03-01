import type { Item, CreateItemInput, UpdateItemInput } from '../types';

const BASE_URL = '/api/items';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      typeof body.error === 'string' ? body.error : 'Something went wrong',
    );
  }
  return response.json() as Promise<T>;
}

export async function getItems(): Promise<Item[]> {
  const res = await fetch(BASE_URL);
  return handleResponse<Item[]>(res);
}

export async function searchItems(q: string): Promise<Item[]> {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);
  return handleResponse<Item[]>(res);
}

export async function createItem(data: CreateItemInput): Promise<Item> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Item>(res);
}

export async function updateItem(
  id: number,
  data: UpdateItemInput,
): Promise<Item> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Item>(res);
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      typeof body.error === 'string' ? body.error : 'Failed to delete item',
    );
  }
}
