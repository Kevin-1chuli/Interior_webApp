import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error handler caught:', err);

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    // Prisma-specific errors
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
          error: 'Duplicate entry'
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
          error: 'Not found'
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Invalid reference',
          error: 'Foreign key constraint failed'
        });
      default:
        console.error('Prisma error code:', err.code);
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
    }
  }

  // Handle Prisma connection errors (including "kind: Closed")
  if (err.name === 'PrismaClientInitializationError' || 
      err.name === 'PrismaClientRustPanicError' ||
      err.message?.includes('connection') ||
      err.message?.includes('kind: Closed') ||
      err.message?.includes('Connection') ||
      err.code === 'P1001' || // Can't reach database server
      err.code === 'P1002' || // Database server timeout
      err.code === 'P1008' || // Operations timeout
      err.code === 'P1017') {  // Server has closed the connection
    console.error('💥 Database connection error:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again.',
      error: 'Service temporarily unavailable'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'Authentication failed'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
      error: 'Authentication expired'
    });
  }

  // Generic error
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
