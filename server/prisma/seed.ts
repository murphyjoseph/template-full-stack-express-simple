import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  {
    title: 'Set up project structure',
    description: 'Initialize monorepo with client and server packages',
    priority: 1,
    status: 'done',
  },
  {
    title: 'Design database schema',
    description: 'Define Item model with priority and status fields',
    priority: 2,
    status: 'done',
  },
  {
    title: 'Implement REST API',
    description: 'Create CRUD endpoints for items with Zod validation',
    priority: 1,
    status: 'in_progress',
  },
  {
    title: 'Build search endpoint',
    description: 'Add autocomplete search across title and description',
    priority: 2,
    status: 'in_progress',
  },
  {
    title: 'Create React components',
    description: null,
    priority: 3,
    status: 'todo',
  },
  {
    title: 'Add form validation',
    description: 'Client-side validation with Zod schemas',
    priority: 2,
    status: 'todo',
  },
  {
    title: 'Write unit tests',
    description: 'Server endpoint tests with supertest',
    priority: 3,
    status: 'todo',
  },
  {
    title: 'Set up CI pipeline',
    description: 'GitHub Actions for lint, typecheck, and test',
    priority: 4,
    status: 'todo',
  },
  {
    title: 'Add dark mode support',
    description: null,
    priority: 5,
    status: 'todo',
  },
  {
    title: 'Performance optimization',
    description: 'Investigate query caching and bundle splitting',
    priority: 4,
    status: 'todo',
  },
];

async function main() {
  await prisma.item.deleteMany();
  for (const item of items) {
    await prisma.item.create({ data: item });
  }
  console.log(`Seeded ${items.length} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
