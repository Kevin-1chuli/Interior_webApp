import dotenv from 'dotenv';

// Load .env file ONLY in development (Railway provides env vars directly)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  console.log('✓ Development: .env loaded');
}

console.log('=== Environment Variables Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Verify critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET is not set');
  console.error('Please set JWT_SECRET environment variable in Railway');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL is not set');
  console.error('Please set DATABASE_URL environment variable in Railway');
  process.exit(1);
}

console.log('✓ JWT_SECRET configured');
console.log('✓ DATABASE_URL configured');

// Check optional Cloudinary variables
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn('⚠ WARNING: Cloudinary credentials not fully configured');
  console.warn('Image upload features will not work');
} else {
  console.log('✓ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
}

// Check FRONTEND_URL
if (process.env.FRONTEND_URL) {
  console.log('✓ FRONTEND_URL configured:', process.env.FRONTEND_URL);
} else {
  console.warn('⚠ WARNING: FRONTEND_URL not set - CORS may block requests');
}

import app from './app';
import prisma from './prisma';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    console.log('\n=== Server Startup ===');
    console.log('Starting server...');
    console.log('PORT:', PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    // Test database connection with timeout
    console.log('Connecting to database...');
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout after 10s')), 10000)
      )
    ]);
    console.log('✓ Database connected successfully');

    // Start server on 0.0.0.0 (Railway requirement)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on 0.0.0.0:${PORT}`);
      console.log(`✓ Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('=== Server Ready ===\n');
    });
  } catch (error) {
    console.error('\n❌ FATAL: Server failed to start');
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully (SIGINT)...');
  await prisma.$disconnect();
  console.log('✓ Database disconnected');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nShutting down gracefully (SIGTERM)...');
  await prisma.$disconnect();
  console.log('✓ Database disconnected');
  process.exit(0);
});

// Catch unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

startServer();
