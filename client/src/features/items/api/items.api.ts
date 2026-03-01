import type { Item, CreateItemInput, UpdateItemInput } from '../types';

const BASE = '/api/items';

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function searchItems(q: string): Promise<Item[]> {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Failed to search items');
  return res.json();
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ? JSON.stringify(body.error) : 'Failed to create item',
    );
  }
  return res.json();
}

export async function updateItem(
  id: number,
  input: UpdateItemInput,
): Promise<Item> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error ? JSON.stringify(body.error) : 'Failed to update item',
    );
  }
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete item');
}
