export type TNodeEnv = 'development' | 'test' | 'production';

export interface IRootResponse {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  environment: TNodeEnv;
  uptime: number;
}

export interface ILiveResponse {
  status: 'alive';
}

export interface IReadyResponse {
  status: 'ready' | 'not_ready';
}

export interface IHealthCheckResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  services: {
    database: 'connected' | 'unknown' | 'disconnected';
  };
}
