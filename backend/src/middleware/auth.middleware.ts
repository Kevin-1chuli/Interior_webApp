import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; username: string; role: string };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[Auth] Authorization header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'missing');
    
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('[Auth] No token provided');
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('[Auth] Token valid for user:', decoded.username, 'role:', decoded.role);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log('[Auth] Token verification failed:', error.message);
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to check if user is MANAGER
export const requireManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'MANAGER') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Manager role required.' 
    });
  }

  next();
};
