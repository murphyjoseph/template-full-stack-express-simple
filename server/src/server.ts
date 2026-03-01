import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export const app = express();
export const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z.string().trim().optional().default(''),
  priority: z.coerce.number().int().min(1).max(5).default(3),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
});

const updateItemSchema = createItemSchema.partial();

const searchQuerySchema = z.object({
  q: z.string().default(''),
});

const idParamSchema = z.coerce.number().int().positive();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Items CRUD
app.get('/api/items', async (_req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/api/items', async (req, res) => {
  const result = createItemSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  try {
    const { title, description, priority, status } = result.data;
    const item = await prisma.item.create({
      data: { title, description: description || null, priority, status },
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.get('/api/items/search', async (req, res) => {
  const parsed = searchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid search query' });
    return;
  }

  const { q } = parsed.data;
  try {
    const items = await prisma.item.findMany({
      where: q
        ? {
            OR: [{ title: { contains: q } }, { description: { contains: q } }],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search items' });
  }
});

app.patch('/api/items/:id', async (req, res) => {
  const idParsed = idParamSchema.safeParse(req.params.id);
  if (!idParsed.success) {
    res.status(400).json({ error: 'Invalid item ID' });
    return;
  }

  const bodyParsed = updateItemSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.flatten().fieldErrors });
    return;
  }

  try {
    const item = await prisma.item.update({
      where: { id: idParsed.data },
      data: bodyParsed.data,
    });
    res.json(item);
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  const parsed = idParamSchema.safeParse(req.params.id);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid item ID' });
    return;
  }

  try {
    await prisma.item.delete({ where: { id: parsed.data } });
    res.status(204).end();
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'P2025'
    ) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
