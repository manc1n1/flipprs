import type { Request, Response } from 'express';

import {
  runSyncMapping,
  SyncMappingAlreadyRunningError,
} from '@/services/sync/runners/sync-mapping-runner.service';
import {
  runSyncLatest,
  SyncLatestAlreadyRunningError,
} from '@/services/sync/runners/sync-latest-runner.service';
import { refreshValidIdsCache } from '@/services/cache/valid-ids-cache';

import { logger } from '@/utils/logger';

export async function syncMappingHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    logger.info('Syncing mapping');

    await runSyncMapping();

    return void res.status(200).json({
      status: 'ok',
      message: 'Mapping sync complete',
    });
  } catch (error) {
    if (error instanceof SyncMappingAlreadyRunningError) {
      return void res.status(409).json({
        status: 'error',
        message: error.message,
      });
    }

    logger.error('Mapping sync failed', { error });

    return void res.status(500).json({
      status: 'error',
      message: 'Mapping sync failed',
    });
  }
}

export async function syncLatestHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    logger.info('Syncing latest');

    const result = await runSyncLatest();

    return void res.status(200).json({
      status: 'ok',
      message: 'Latest sync complete',
      ...result,
    });
  } catch (error) {
    if (error instanceof SyncLatestAlreadyRunningError) {
      return void res.status(409).json({
        status: 'error',
        message: error.message,
      });
    }

    logger.error('Latest sync failed', { error });

    return void res.status(500).json({
      status: 'error',
      message: 'Latest sync failed',
    });
  }
}

export async function refreshValidIdsCacheHandler(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    logger.info('Refreshing valid ids cache');

    await refreshValidIdsCache();

    return void res.status(200).json({
      status: 'ok',
      message: 'Refreshed valid ids cache',
    });
  } catch (error) {
    logger.error('Refresh valid ids cache failed', { error });

    return void res.status(500).json({
      status: 'error',
      message: 'Refresh valid ids cache failed',
    });
  }
}
