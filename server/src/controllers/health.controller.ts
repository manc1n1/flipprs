import type { NextFunction, Request, Response } from 'express';

import {
  getHealthStatus,
  getLiveStatus,
  getReadyStatus,
  getRootStatus,
} from '@/services/health.service';

import { sendJson, setNoCache } from '@/utils/http';
import { logger } from '@/utils/logger';

export async function getRoot(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info('Checking root status');

    const rootStatus = await getRootStatus();

    setNoCache(res);
    sendJson(res, rootStatus);
  } catch (error) {
    logger.error('Root check failed', { error });
    next(error);
  }
}

export async function getLive(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info('Checking live status');

    const liveStatus = await getLiveStatus();

    setNoCache(res);
    sendJson(res, liveStatus);
  } catch (error) {
    logger.error('Live check failed', { error });
    next(error);
  }
}

export async function getReady(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info('Checking ready status');

    const readyStatus = await getReadyStatus();
    const statusCode = readyStatus.status === 'ready' ? 200 : 503;

    setNoCache(res);
    sendJson(res, readyStatus, statusCode);
  } catch (error) {
    logger.error('Ready check failed', { error });
    next(error);
  }
}

export async function getHealth(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    logger.info('Checking health status');

    const healthStatus = await getHealthStatus();
    const statusCode = healthStatus.status === 'ok' ? 200 : 503;

    setNoCache(res);
    sendJson(res, healthStatus, statusCode);
  } catch (error) {
    logger.error('Health check failed', { error });
    next(error);
  }
}
