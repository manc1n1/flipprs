import type { Response } from 'express';

export function setNoCache(res: Response): void {
  res.set({
    'Cache-Control': 'no-store',
    'Surrogate-Control': 'no-store',
  });
}

export function sendJson<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({
    requestId: res.req?.requestId,
    data,
  });
}
