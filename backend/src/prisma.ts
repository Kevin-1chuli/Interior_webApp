import { PrismaClient } from '@prisma/client';

// Prisma client with connection pooling and timeout settings
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Do NOT auto-connect on import - let server.ts handle connection
// This prevents crashes during module loading

export default prisma;
