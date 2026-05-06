import type { NextFunction, Request, Response } from 'express';
import crypto from 'node:crypto';

import { runWithRequestContext } from '@/lib/request-context';

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incomingId = req.header('X-Request-Id');
  const requestId = incomingId?.trim() || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  runWithRequestContext({ requestId }, () => {
    next();
  });
}
