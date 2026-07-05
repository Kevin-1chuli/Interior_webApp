console.log('=== BOOT_START ===');
console.log('Node version:', process.version);
console.log('CWD:', process.cwd());

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
console.log('PORT type:', typeof process.env.PORT);
console.log('PORT parsed:', parseInt(process.env.PORT || '0', 10));

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

// Check FRONTEND_URL - CRITICAL for CORS in production
console.log('=== FRONTEND_URL Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
if (process.env.FRONTEND_URL) {
  console.log('✓ FRONTEND_URL configured:', process.env.FRONTEND_URL);
  console.log('✓ CORS will allow:', process.env.FRONTEND_URL);
} else {
  console.error('❌ CRITICAL: FRONTEND_URL not set!');
  console.error('Production CORS will BLOCK frontend requests!');
  console.error('Set FRONTEND_URL in Railway to your Vercel URL');
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️ Running in PRODUCTION without FRONTEND_URL - CORS will fail!');
  }
}
console.log('==================================');

console.log('=== IMPORTING APP ===');
import app from './app';
console.log('=== APP IMPORTED ===');

import prisma from './prisma';
console.log('=== PRISMA IMPORTED ===');

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
    // CRITICAL: Server MUST start listening before ANY database connection
    console.log('=== ATTEMPTING app.listen() ===');
    console.log('Binding to PORT:', PORT, 'Host: 0.0.0.0');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('=== LISTENING_CONFIRMED ===');
      console.log(`✓ Server listening on 0.0.0.0:${PORT}`);
      console.log(`✓ Process PID: ${process.pid}`);
      console.log(`✓ Health endpoint: /health`);
      serverStarted = true;
      
      // Connect to database AFTER server is listening (background, non-blocking)
      connectDatabase();
    });

    // Log ALL incoming connections at TCP level
    server.on('connection', (socket) => {
      console.log(`[SERVER] New connection from ${socket.remoteAddress}:${socket.remotePort}`);
    });

    // Log when Express receives a request
    server.on('request', (req) => {
      console.log(`[SERVER] Request received: ${req.method} ${req.url}`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error(`❌ Server error [${STARTUP_ID}]:`, error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another process`);
      }
      process.exit(1);
    });

    // Database connection function - runs in background, non-blocking
    async function connectDatabase() {
      console.log('\n=== Background Database Connection ===');
      console.log('Connecting to database (non-blocking)...');
      let dbConnected = false;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Database connection attempt ${attempt}/${maxRetries}...`);
          
          await Promise.race([
            prisma.$connect(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Database connection timeout after 15s')), 15000)
            )
          ]);
          
          // Test the connection with a simple query
          await prisma.$queryRaw`SELECT 1 as result`;
          
          console.log(`✓ Database connected successfully [${STARTUP_ID}]`);
          dbConnected = true;
          break;
        } catch (dbError) {
          console.error(`⚠️ Database connection attempt ${attempt} failed:`, dbError);
          
          if (attempt < maxRetries) {
            const waitTime = attempt * 2000; // 2s, 4s backoff
            console.log(`Retrying in ${waitTime/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      }
      
      if (!dbConnected) {
        console.error(`⚠️ WARNING: Database connection failed after ${maxRetries} attempts [${STARTUP_ID}]`);
        console.error('Server continues running - API will return 503 for DB operations');
      }
    }
    
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
