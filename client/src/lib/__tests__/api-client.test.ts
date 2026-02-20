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
  });

  it('GET request does not send Content-Type header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    await api.get('/items');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers).not.toHaveProperty('Content-Type');
  });

  it('POST request sends JSON body with Content-Type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 1, title: 'New' }),
    });

    const result = await api.post('/items', { title: 'New' });
    expect(result).toEqual({ id: 1, title: 'New' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'New' }),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
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

  it('DELETE request does not send Content-Type header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    await api.delete('/items/1');
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers).not.toHaveProperty('Content-Type');
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(api.get('/items/999')).rejects.toThrow('API error: 404');
  });
});
