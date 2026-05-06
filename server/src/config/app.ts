import pkg from '../../package.json';

export const appConfig = {
  name: pkg.name,
  version: pkg.version,
};

export const ROOT = '/';

export const INTERNAL_PREFIX = '/internal';
export const SYNC_PREFIX = '/sync';
export const MAPPING_PREFIX = '/mapping';
export const LATEST_PREFIX = '/latest';
export const VALID_IDS_PREFIX = '/valid-ids';

export const API_PREFIX = '/api';
export const API_VERSION = '/v1';
export const GAME_PREFIX = '/osrs';
