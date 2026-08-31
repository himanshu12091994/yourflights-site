// ─────────────────────────────────────────────────────────────
// Universal permissive headers & crawler accessibility middleware
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export function permissiveCorsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Strict CORS: Allow only same-origin or localhost during development
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:4000', 'http://localhost:3000', 'http://127.0.0.1:4000'];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, PATCH, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, User-Agent, X-Requested-With'
  );
  res.setHeader('X-Robots-Tag', 'all, index, follow');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}

// ─────────────────────────────────────────────────────────────
// Security: Rate Limiting for Auth Endpoints
// ─────────────────────────────────────────────────────────────
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  }
});
