import { openDB } from 'idb';

const DB_NAME = 'favourites-db';
const STORE_NAME = 'favourites';

export const db = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export async function getFavourite(itemId: number) {
  return (await db).get(STORE_NAME, itemId);
}

export async function getAllFavourites(): Promise<number[]> {
  const store = await db;
  const allKeys = await store.getAllKeys(STORE_NAME);
  return allKeys as number[];
}

export async function setFavourite(itemId: number) {
  return (await db).put(STORE_NAME, true, itemId);
}

export async function deleteFavourite(itemId: number) {
  return (await db).delete(STORE_NAME, itemId);
}

export async function deleteAllFavourites() {
  const store = await db;
  const allKeys = await store.getAllKeys(STORE_NAME);
  await Promise.all(
    allKeys.map((key) => store.delete(STORE_NAME, key as number)),
  );
}
