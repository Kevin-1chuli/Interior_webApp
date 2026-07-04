import { PrismaClient } from '@prisma/client';

// Global variable to ensure singleton pattern
declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure DATABASE_URL has proper connection pool settings for Neon
function getConnectionUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  // Neon pooler URLs should use pgbouncer=true for stability
  // Check if using Neon pooler and add pgbouncer parameter if missing
  if (url.includes('pooler.') && !url.includes('pgbouncer=')) {
    const separator = url.includes('?') ? '&' : '?';
    const enhancedUrl = `${url}${separator}pgbouncer=true&connection_limit=1`;
    console.log('✓ Enhanced DATABASE_URL with pgbouncer settings for Neon');
    return enhancedUrl;
  }
  
  return url;
}

// Prisma client singleton - standard Prisma v5 initialization
// No custom overrides, no lifecycle hooks, no method wrapping
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getConnectionUrl(),
    },
  },
});

// Store singleton in global for development hot-reload
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
