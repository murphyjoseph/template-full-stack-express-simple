import type { Item, ItemFormData } from '../types';

const API_BASE = '/api';

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function searchItems(q: string): Promise<Item[]> {
  const res = await fetch(
    `${API_BASE}/items/search?q=${encodeURIComponent(q)}`,
  );
  if (!res.ok) throw new Error('Failed to search items');
  return res.json();
}

export async function createItem(data: ItemFormData): Promise<Item> {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.error ? JSON.stringify(err.error) : 'Failed to create item',
    );
  }
  return res.json();
}

export async function updateItem(
  id: number,
  data: Partial<ItemFormData>,
): Promise<Item> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(
      err.error ? JSON.stringify(err.error) : 'Failed to update item',
    );
  }
  return res.json();
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/items/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete item');
}
