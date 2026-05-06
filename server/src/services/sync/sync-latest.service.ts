import { upsertLatest } from '@/repositories/latest.repository';

import { fetchLatest, fetchVolumes } from '@/services/wiki.service';

import { logger } from '@/utils/logger';

import type { TSyncLatestResult } from '@/types/sync';

export async function syncLatest(): Promise<TSyncLatestResult> {
  const [latest, volumes] = await Promise.all([fetchLatest(), fetchVolumes()]);

  const processedCount = Object.keys(latest.data).length;
  const updatedIds = await upsertLatest(latest.data, volumes.data);
  const updatedCount = updatedIds.length;

  logger.debug('Latest sync complete', { processedCount, updatedCount });

  return { processedCount, updatedCount };
}
