import { describe, it, expect } from 'vitest';
import { presentDashboard } from './dashboard.presenter';
import type { Item } from '../types';

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  title: 'Test',
  description: null,
  priority: 3,
  status: 'todo',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('presentDashboard', () => {
  it('returns empty state when no items', () => {
    const result = presentDashboard([]);
    expect(result.renderAs).toBe('empty');
  });

  it('computes status counts', () => {
    const items = [
      makeItem({ id: 1, status: 'todo' }),
      makeItem({ id: 2, status: 'todo' }),
      makeItem({ id: 3, status: 'in_progress' }),
      makeItem({ id: 4, status: 'done' }),
    ];
    const result = presentDashboard(items);
    expect(result.renderAs).toBe('content');
    if (result.renderAs !== 'content') return;
    expect(result.counts).toEqual({
      total: 4,
      todo: 2,
      inProgress: 1,
      done: 1,
    });
  });

  it('passes items through', () => {
    const items = [makeItem({ id: 1 }), makeItem({ id: 2 })];
    const result = presentDashboard(items);
    if (result.renderAs !== 'content') return;
    expect(result.items).toHaveLength(2);
  });
});
