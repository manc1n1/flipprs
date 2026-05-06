import rateLimit from 'express-rate-limit';

import type { Request, Response } from 'express';

export function createRateLimiter(max: number = 50) {
  return rateLimit({
    windowMs: 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests, please try again later',
        code: 'RATE_LIMITED',
      });
    },
  });
}
