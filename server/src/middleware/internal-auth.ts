import type { NextFunction, Request, Response } from 'express';

import { env } from '@/config/env';

export function requireInternalApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== env.INTERNAL_API_KEY) {
    res.status(401).json({
      error: 'Unauthorized',
      code: 'UNAUTHORIZED',
    });
    return;
  }

  next();
}
