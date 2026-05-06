import { appConfig } from '@/config/app';

import { env } from '@/config/env';

import { pool } from '@/db/pool';

import { logger } from '@/utils/logger';

import type {
  IHealthCheckResponse,
  ILiveResponse,
  IReadyResponse,
  IRootResponse,
} from '@/types/health';

export async function getRootStatus(): Promise<IRootResponse> {
  logger.info('Fetching root status');

  const response: IRootResponse = {
    status: 'ok',
    service: appConfig.name,
    version: appConfig.version,
    environment: env.RAILWAY_ENVIRONMENT_NAME,
    uptime: process.uptime(),
  };

  return response;
}

export async function getLiveStatus(): Promise<ILiveResponse> {
  logger.info('Fetching live status');

  const response: ILiveResponse = {
    status: 'alive',
  };

  return response;
}

export async function getReadyStatus(): Promise<IReadyResponse> {
  logger.info('Fetching ready status');

  const response: IReadyResponse = {
    status: 'ready',
  };

  try {
    await pool.query('SELECT 1');
  } catch {
    response.status = 'not_ready';
  }

  return response;
}

export async function getHealthStatus(): Promise<IHealthCheckResponse> {
  logger.info('Fetching health status');

  const response: IHealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'unknown',
    },
  };

  try {
    await pool.query('SELECT 1');
    response.services.database = 'connected';
  } catch {
    response.status = 'degraded';
    response.services.database = 'disconnected';
  }

  return response;
}
