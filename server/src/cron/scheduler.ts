import { runSyncMapping } from '@/services/sync/runners/sync-mapping-runner.service';
import { runSyncLatest } from '@/services/sync/runners/sync-latest-runner.service';
import { refreshValidIdsCache } from '@/services/cache/valid-ids-cache';

import { logger } from '@/utils/logger';

let mappingTimer: NodeJS.Timeout | null = null;
let latestTimer: NodeJS.Timeout | null = null;
let refreshValidIdsCacheTimer: NodeJS.Timeout | null = null;

const ms = {
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
};

export function startScheduler(): void {
  logger.info('Starting scheduler');

  mappingTimer = setInterval(async () => {
    try {
      logger.info('Running mapping sync');
      await runSyncMapping();
      logger.info('Mapping sync complete');
    } catch (error) {
      logger.error('Mapping sync failed', { error });
    }
  }, 6 * ms.hour);

  latestTimer = setInterval(async () => {
    try {
      logger.info('Running latest sync');
      await runSyncLatest();
      logger.info('Latest sync complete');
    } catch (error) {
      logger.error('Latest sync failed', { error });
    }
  }, 55 * 1000);
}

refreshValidIdsCacheTimer = setInterval(
  async () => {
    try {
      logger.info('Running refresh valid ids cache');
      await refreshValidIdsCache();
      logger.info('Refresh valid ids cache complete');
    } catch (error) {
      logger.error('Refresh valid ids cache failed', { error });
    }
  },
  6 * ms.hour + 5 * ms.minute,
);

export function stopDScheduler(): void {
  if (mappingTimer) {
    clearInterval(mappingTimer);
    mappingTimer = null;
  }

  if (latestTimer) {
    clearInterval(latestTimer);
    latestTimer = null;
  }
}
