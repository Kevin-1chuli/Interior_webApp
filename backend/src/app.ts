import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import projectsRoutes from './routes/projects.routes';
import contactRoutes from './routes/contact.routes';
import categoriesRoutes from './routes/categories.routes';
import testRoutes from './routes/test.routes';
import { errorHandler } from './middleware/error.middleware';

console.log('=== EXPRESS_INIT ===');

const app = express();

// Log every incoming request at the very top
app.use((req, res, next) => {
  console.log(`=== REQUEST_HIT: ${req.method} ${req.url} from ${req.ip} ===`);
  next();
});

// Health check FIRST - before any middleware
// This ensures Railway health checks always work
app.get('/health', (req, res) => {
  console.log('=== HEALTH_HIT ===');
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

// CORS configuration - Multiple origins support
// CRITICAL: Must support BOTH localhost (dev) AND Vercel (production)
const isDevelopment = process.env.NODE_ENV !== 'production';

// Production Vercel URL - hardcoded fallback if env var missing
const PRODUCTION_FRONTEND = 'https://interior-web-app-three.vercel.app';

const allowedOrigins = [
  // Always include production Vercel URL
  PRODUCTION_FRONTEND,
  // Also use FRONTEND_URL from environment if set
  process.env.FRONTEND_URL,
  // Localhost origins for development
  ...(isDevelopment ? [
    'http://localhost:3000',
    'http://localhost:3001',
  ] : []),
].filter((origin, index, self) => 
  origin && self.indexOf(origin) === index // Remove falsy and duplicates
) as string[];

console.log('=== CORS Configuration ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Is Development:', isDevelopment);
console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL || 'NOT SET');
console.log('Production Vercel URL:', PRODUCTION_FRONTEND);
console.log('Allowed origins:', allowedOrigins);
console.log('========================');

// Create CORS options object with standard configuration
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  preflightContinue: false
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
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoriesRoutes);
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
