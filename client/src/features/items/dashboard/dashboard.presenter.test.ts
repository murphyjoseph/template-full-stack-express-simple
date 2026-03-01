import { presentDashboard } from './dashboard.presenter';
import type { Item } from '../types';

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  title: 'Test',
  description: null,
  priority: 3,
  status: 'todo',
  createdAt: '2026-01-15T10:00:00.000Z',
  ...overrides,
});

describe('presentDashboard', () => {
  it('returns loading state when isLoading is true', () => {
    const result = presentDashboard([], true);
    expect(result.renderAs).toBe('loading');
  });

  it('returns empty state when items array is empty', () => {
    const result = presentDashboard([], false);
    expect(result.renderAs).toBe('empty');
  });

  it('returns content state with correct counts', () => {
    const items = [
      makeItem({ id: 1, status: 'todo' }),
      makeItem({ id: 2, status: 'todo' }),
      makeItem({ id: 3, status: 'in_progress' }),
      makeItem({ id: 4, status: 'done' }),
    ];
    const result = presentDashboard(items, false);
    expect(result.renderAs).toBe('content');
    expect(result.counts).toEqual({
      todo: 2,
      inProgress: 1,
      done: 1,
      total: 4,
    });
  });

  it('maps items to card view models', () => {
    const items = [
      makeItem({
        id: 1,
        title: 'My Item',
        description: 'A description',
        priority: 1,
        status: 'in_progress',
      }),
    ];
    const result = presentDashboard(items, false);
    expect(result.items[0]).toEqual(
      expect.objectContaining({
        id: 1,
        title: 'My Item',
        description: 'A description',
        priorityLabel: 'P1',
        statusLabel: 'In Progress',
        statusColor: 'blue',
      }),
    );
  });

  it('uses correct status colors', () => {
    const items = [
      makeItem({ id: 1, status: 'todo' }),
      makeItem({ id: 2, status: 'in_progress' }),
      makeItem({ id: 3, status: 'done' }),
    ];
    const result = presentDashboard(items, false);
    expect(result.items[0].statusColor).toBe('gray');
    expect(result.items[1].statusColor).toBe('blue');
    expect(result.items[2].statusColor).toBe('green');
  });
});
