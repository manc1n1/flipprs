import { syncMapping } from '@/services/sync/sync-mapping.service';

let isSyncingMapping = false;

export class SyncMappingAlreadyRunningError extends Error {
  constructor() {
    super('Mapping sync already in progress');
    this.name = 'SyncMappingAlreadyRunningError';
  }
}

export async function runSyncMapping(): Promise<void> {
  if (isSyncingMapping) {
    throw new SyncMappingAlreadyRunningError();
  }

  isSyncingMapping = true;

  try {
    await syncMapping();
  } finally {
    isSyncingMapping = false;
  }
}
