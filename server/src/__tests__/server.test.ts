import request from 'supertest';
import { app, prisma } from '../server';

const testItemIds: number[] = [];

afterAll(async () => {
  const ids = testItemIds.filter((id) => id != null);
  if (ids.length > 0) {
    await prisma.item.deleteMany({ where: { id: { in: ids } } });
  }
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

  it('POST /api/items creates an item with all fields', async () => {
    const res = await request(app).post('/api/items').send({
      title: 'Test Item',
      description: 'A test description',
      priority: 2,
      status: 'in_progress',
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Item');
    expect(res.body.description).toBe('A test description');
    expect(res.body.priority).toBe(2);
    expect(res.body.status).toBe('in_progress');
    expect(res.body.id).toBeDefined();
    itemId = res.body.id;
    testItemIds.push(itemId);
  });

  it('POST /api/items uses defaults for optional fields', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ title: 'Minimal Item' });

    expect(res.status).toBe(201);
    expect(res.body.description).toBeNull();
    expect(res.body.priority).toBe(3);
    expect(res.body.status).toBe('todo');
    testItemIds.push(res.body.id);
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
    testItemIds.splice(testItemIds.indexOf(itemId), 1);
  });
});

describe('Validation errors', () => {
  it('POST /api/items rejects missing title', async () => {
    const res = await request(app).post('/api/items').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/items rejects title shorter than 3 characters', async () => {
    const res = await request(app).post('/api/items').send({ title: 'ab' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/items rejects invalid priority', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ title: 'Test Item', priority: 6 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('POST /api/items rejects invalid status', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ title: 'Test Item', status: 'invalid' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('DELETE /api/items/:id rejects invalid id', async () => {
    const res = await request(app).delete('/api/items/abc');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid item ID');
  });

  it('DELETE /api/items/:id returns 404 for non-existent item', async () => {
    const res = await request(app).delete('/api/items/999999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Item not found');
  });
});

describe('PATCH /api/items/:id', () => {
  let patchItemId: number;

  beforeAll(async () => {
    const res = await request(app).post('/api/items').send({
      title: 'Patch Test Item',
      description: 'Original description',
      priority: 2,
      status: 'todo',
    });
    patchItemId = res.body.id;
    testItemIds.push(patchItemId);
  });

  it('updates title only', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.description).toBe('Original description');
  });

  it('updates multiple fields', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ priority: 5, status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.priority).toBe(5);
    expect(res.body.status).toBe('done');
  });

  it('rejects invalid fields', async () => {
    const res = await request(app)
      .patch(`/api/items/${patchItemId}`)
      .send({ priority: 10 });
    expect(res.status).toBe(400);
  });

  it('returns 404 for non-existent item', async () => {
    const res = await request(app)
      .patch('/api/items/999999')
      .send({ title: 'Nope' });
    expect(res.status).toBe(404);
  });

  it('rejects invalid id', async () => {
    const res = await request(app)
      .patch('/api/items/abc')
      .send({ title: 'Nope' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/items/search', () => {
  const searchItemIds: number[] = [];

  beforeAll(async () => {
    const items = [
      { title: 'Alpha Widget', description: 'A fancy widget' },
      { title: 'Beta Gadget', description: 'A useful gadget' },
      { title: 'Gamma Widget' },
    ];
    for (const item of items) {
      const res = await request(app).post('/api/items').send(item);
      searchItemIds.push(res.body.id);
      testItemIds.push(res.body.id);
    }
  });

  it('returns items matching title', async () => {
    const res = await request(app).get('/api/items/search?q=Widget');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(
      res.body.every((item: { title: string }) =>
        item.title.includes('Widget'),
      ),
    ).toBe(true);
  });

  it('returns items matching description', async () => {
    const res = await request(app).get('/api/items/search?q=fancy');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].description).toContain('fancy');
  });

  it('returns empty array for no matches', async () => {
    const res = await request(app).get('/api/items/search?q=zzzznonexistent');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns recent items for empty query', async () => {
    const res = await request(app).get('/api/items/search?q=');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns recent items when q is omitted', async () => {
    const res = await request(app).get('/api/items/search');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
