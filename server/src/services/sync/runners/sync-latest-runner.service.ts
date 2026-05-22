import { syncLatest } from '@/services/sync/sync-latest.service';

import type { TSyncLatestResult } from '@/types/sync';

let isSyncingLatest = false;

export class SyncLatestAlreadyRunningError extends Error {
  constructor() {
    super('Latest sync already in progress');
    this.name = 'SyncLatestAlreadyRunningError';
  }
}

export async function runSyncLatest(): Promise<TSyncLatestResult> {
  if (isSyncingLatest) {
    throw new SyncLatestAlreadyRunningError();
  }

  isSyncingLatest = true;

  try {
    return await syncLatest();
  } finally {
    isSyncingLatest = false;
  }
}
