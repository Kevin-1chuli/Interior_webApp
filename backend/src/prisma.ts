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

// Prisma client with production-ready connection pooling and error handling
// Using singleton pattern to prevent multiple instances
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

// Graceful error handling for connection issues
const originalConnect = prisma.$connect.bind(prisma);
prisma.$connect = async function() {
  try {
    return await originalConnect();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
};

// Do NOT auto-connect on import - let server.ts handle connection
// This prevents crashes during module loading

export default prisma;
