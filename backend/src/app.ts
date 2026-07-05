import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import projectsRoutes from './routes/projects.routes';
import testRoutes from './routes/test.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Log every incoming request at the very top
app.use((req, res, next) => {
  console.log(`[EXPRESS] Incoming ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Health check FIRST - before any middleware
// This ensures Railway health checks always work
app.get('/health', (req, res) => {
  const now = new Date().toISOString();
  console.log(`[HEALTH] ${now} Health check received from ${req.ip || 'unknown'}`);
  res.status(200).json({ 
    status: 'ok',
    timestamp: now,
    uptime: process.uptime()
  });
});

// Root endpoint - also before middleware
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'NGB Interior Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// CORS configuration - Environment-aware origins
// Production: Use ONLY FRONTEND_URL from Railway environment
// Development: Allow localhost origins
const isDevelopment = process.env.NODE_ENV !== 'production';

const allowedOrigins = [
  // Localhost origins ONLY in development
  ...(isDevelopment ? [
    'http://localhost:3000',
    'http://localhost:3001',
  ] : []),
  // Production frontend URL from Railway environment variable
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

console.log('=== CORS Configuration ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Is Development:', isDevelopment);
console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL || 'NOT SET');
console.log('Allowed origins:', allowedOrigins);
console.log('========================');

// Create CORS options object with standard configuration
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins, // Simple array - no callback
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

// Log all incoming requests with origin
app.use((req, res, next) => {
  const origin = req.get('origin');
  const method = req.method;
  
  if (method === 'OPTIONS') {
    console.log(`[${method}] Preflight from: ${origin || 'no-origin'} → ${req.path}`);
    console.log(`  Access-Control-Request-Method: ${req.get('access-control-request-method') || 'none'}`);
    console.log(`  Access-Control-Request-Headers: ${req.get('access-control-request-headers') || 'none'}`);
  } else {
    console.log(`[${method}] Request from: ${origin || 'no-origin'} → ${req.path}`);
  }
  
  next();
});

// Apply CORS middleware BEFORE routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', testRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
