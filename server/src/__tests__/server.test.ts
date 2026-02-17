import request from 'supertest';
import { app, prisma } from '../server';

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Items CRUD', () => {
  let itemId: number;

  it('POST /api/items creates an item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ title: 'Test Item' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Item');
    expect(res.body.id).toBeDefined();
    itemId = res.body.id;
  });

  it('GET /api/items returns items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: itemId, title: 'Test Item' }),
      ]),
    );
  });

  it('DELETE /api/items/:id removes an item', async () => {
    const res = await request(app).delete(`/api/items/${itemId}`);
    expect(res.status).toBe(204);

    const listRes = await request(app).get('/api/items');
    const found = listRes.body.find(
      (item: { id: number }) => item.id === itemId,
    );
    expect(found).toBeUndefined();
  });
});
