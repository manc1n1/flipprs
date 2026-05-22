import { upsertMapping } from '@/repositories/mapping.repository';

import { fetchMapping } from '@/services/wiki.service';

export async function syncMapping(): Promise<void> {
  const mapping = await fetchMapping();
  await upsertMapping(mapping);
}
