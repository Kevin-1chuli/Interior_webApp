// Catch unhandled errors FIRST - before any imports
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // Don't exit on unhandled rejection, just log it
});

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

// Railway provides PORT - no fallback needed
if (!process.env.PORT) {
  console.error('❌ CRITICAL: PORT environment variable not set');
  console.error('Railway must provide PORT. If running locally, set PORT in .env');
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

// Add startup timestamp to detect duplicate initializations
const STARTUP_ID = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
console.log(`🚀 SERVER INITIALIZATION ID: ${STARTUP_ID}`);

async function startServer() {
  let serverStarted = false;
  
  try {
    console.log('\n=== Server Startup ===');
    console.log('Startup ID:', STARTUP_ID);
    console.log('Process PID:', process.pid);
    console.log('Starting server...');
    console.log('PORT:', PORT);
    console.log('PORT from env:', process.env.PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    // Start server IMMEDIATELY on 0.0.0.0 (Railway requirement)
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ SERVER LISTENING - ID: ${STARTUP_ID}`);
      console.log(`✓ Bound to: 0.0.0.0:${PORT}`);
      console.log(`✓ Process ID: ${process.pid}`);
      console.log(`✓ Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      serverStarted = true;
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error(`❌ Server error [${STARTUP_ID}]:`, error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another process`);
      }
      process.exit(1);
    });

    // Wait for server to be listening before continuing
    await new Promise<void>((resolve) => {
      if (serverStarted) {
        resolve();
      } else {
        server.on('listening', () => {
          console.log(`✓ Server 'listening' event fired [${STARTUP_ID}]`);
          resolve();
        });
      }
    });

    console.log(`✓ Server is now accepting connections [${STARTUP_ID}]`);
    
    // Connect to database AFTER server is confirmed listening
    // If DB fails, log error but keep server running
    console.log('Connecting to database...');
    try {
      await Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database connection timeout after 10s')), 10000)
        )
      ]);
      console.log(`✓ Database connected successfully [${STARTUP_ID}]`);
    } catch (dbError) {
      console.error(`⚠️ WARNING: Database connection failed [${STARTUP_ID}]`);
      console.error('Error:', dbError);
      console.error('Server will continue running but database operations will fail');
      // DO NOT EXIT - let server stay running for health checks
    }
    
    console.log(`\n✅ SERVER READY [${STARTUP_ID}]\n`);
    
    // Keep process alive and log heartbeat
    let heartbeatCount = 0;
    setInterval(() => {
      heartbeatCount++;
      if (heartbeatCount % 10 === 0) {
        console.log(`💓 Heartbeat #${heartbeatCount} [${STARTUP_ID}] - Server is alive`);
      }
    }, 60000);
    
  } catch (error) {
    console.error(`\n❌ FATAL: Server failed to start [${STARTUP_ID}]`);
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    
    // Only exit if server didn't start
    if (!serverStarted) {
      await prisma.$disconnect();
      process.exit(1);
    }
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

startServer();
