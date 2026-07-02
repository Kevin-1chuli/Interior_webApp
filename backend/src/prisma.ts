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

// Test connection on init
prisma.$connect()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Prisma Client: Connection pool initialized');
    }
  })
  .catch((error) => {
    console.error('Prisma Client: Failed to initialize connection pool:', error);
  });

export default prisma;
