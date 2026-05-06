import { pool } from '@/db/pool';

import { syncMapping } from '@/services/sync/sync-mapping.service';
import { syncLatest } from '@/services/sync/sync-latest.service';
import { refreshValidIdsCache } from '@/services/cache/valid-ids-cache';

import { logger } from '@/utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Syncing mapping');
    await syncMapping();
    logger.info('Mapping sync complete');

    logger.info('Syncing latest');
    await syncLatest();
    logger.info('Latest sync complete');

    logger.info('Syncing valid ids cache');
    await refreshValidIdsCache();
    logger.info('Valid ids cache sync complete');
  } catch (error) {
    logger.error('Sync failed', { error });
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
