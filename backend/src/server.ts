import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST before any other imports
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('✓ .env loaded successfully');
  console.log('CLOUDINARY_CLOUD_NAME from env:', process.env.CLOUDINARY_CLOUD_NAME);
}

// Verify critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET is not set in .env');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ CRITICAL: DATABASE_URL is not set in .env');
  process.exit(1);
}

console.log('✓ JWT_SECRET configured');

import app from './app';
import prisma from './prisma';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected');

    // Log Cloudinary status
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name-here') {
      console.log('✓ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
    } else {
      console.warn('⚠ Cloudinary credentials not found or invalid in .env');
      console.warn('Current value:', process.env.CLOUDINARY_CLOUD_NAME);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Listening on 0.0.0.0:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
