CREATE TABLE IF NOT EXISTS mapping (
  examine TEXT,
  id INTEGER PRIMARY KEY,
  members BOOLEAN NOT NULL DEFAULT FALSE,
  lowalch INTEGER,
  item_limit INTEGER,
  value INTEGER,
  highalch INTEGER,
  icon TEXT,
  name TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
);

CREATE INDEX IF NOT EXISTS idx_mapping_name ON mapping (name);

CREATE TABLE IF NOT EXISTS latest (
  id INTEGER PRIMARY KEY REFERENCES mapping (id) ON DELETE CASCADE,
  high INTEGER,
  high_time BIGINT,
  low INTEGER,
  low_time BIGINT,
  volume INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
);

CREATE TABLE IF NOT EXISTS timeseries (
  id INTEGER NOT NULL REFERENCES mapping (id) ON DELETE CASCADE,
  timestep TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  avg_high_price INTEGER,
  avg_low_price INTEGER,
  high_price_volume INTEGER,
  low_price_volume INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
  PRIMARY KEY (id, timestep, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_timeseries_id_timestep_timestamp_desc ON timeseries (id, timestep, timestamp DESC);

ALTER TABLE timeseries ADD CONSTRAINT timeseries_timestep_check CHECK (timestep IN ('5m', '1h', '6h', '24h'));

CREATE TABLE IF NOT EXISTS history (
  id INTEGER NOT NULL REFERENCES mapping (id) ON DELETE CASCADE,
  price INTEGER NOT NULL,
  volume BIGINT,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
  PRIMARY KEY (id, timestamp)
);
