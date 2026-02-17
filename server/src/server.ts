import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const app = express();
export const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Items CRUD
app.get('/api/items', async (_req, res) => {
  const items = await prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(items);
});

app.post('/api/items', async (req, res) => {
  const { title } = req.body;
  const item = await prisma.item.create({ data: { title } });
  res.status(201).json(item);
});

app.delete('/api/items/:id', async (req, res) => {
  await prisma.item.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
