import type { NextFunction, Request, Response } from 'express';

import { env } from '@/config/env';

import { logger } from '@/utils/logger';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const isProd = env.RAILWAY_ENVIRONMENT_NAME === 'production';
  const isError = err instanceof Error;

  const message = isError ? err.message : 'Internal server error';
  const stack = isError ? err.stack : undefined;

  logger.error('Unhandled error', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    errorMessage: isError ? err.message : String(err),
    errorStack: stack,
  });

  res.status(500).json({
    error: message,
    code: 'INTERNAL_SERVER_ERROR',
    ...(isProd ? {} : { stack }),
  });
}
