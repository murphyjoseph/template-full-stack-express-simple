import { api } from '@/lib/api-client';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

afterEach(() => {
  mockFetch.mockReset();
});

describe('api-client', () => {
  it('GET request returns parsed JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 1, title: 'Test' }]),
    });

    const result = await api.get('/items');
    expect(result).toEqual([{ id: 1, title: 'Test' }]);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/items',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('POST request sends JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 1, title: 'New' }),
    });

    const result = await api.post('/items', { title: 'New' });
    expect(result).toEqual({ id: 1, title: 'New' });
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/items',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'New' }),
      }),
    );
  });

  it('DELETE request returns undefined for 204', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await api.delete('/items/1');
    expect(result).toBeUndefined();
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(api.get('/items/999')).rejects.toThrow('API error: 404');
  });
});
