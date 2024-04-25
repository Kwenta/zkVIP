CREATE DATABASE IF NOT EXISTS kwenta_gateway;
CREATE USER IF NOT EXISTS kwenta_gateway;
GRANT ALL ON DATABASE kwenta_gateway TO kwenta_gateway;
SET DATABASE TO kwenta_gateway;

-- monitored on-chain events
CREATE TABLE IF NOT EXISTS monitor (
    event TEXT PRIMARY KEY NOT NULL,
    blocknum INT NOT NULL,
    blockidx INT NOT NULL,
    restart BOOL NOT NULL
);

-- user claim 
CREATE TABLE IF NOT EXISTS user_trade_volume_fee (
    id TEXT PRIMARY KEY NOT NULL,
    chain_id INT NOT NULL,
    account TEXT NOT NULL,
    trade_year_month INT NOT NULL,
    volume TEXT NOT NULL,
    fee TEXT NOT NULL,
    receipts TEXT NOT NULL,
    storages TEXT NOT NULL,
    proof TEXT NOT NULL,
    brevis_query_hash TEXT NOT NULL,
    brevis_query_fee NOT NULL,
    status INT NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    update_time TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_trade_volume_fee_create_time ON user_trade_volume_fee (create_time);
CREATE INDEX IF NOT EXISTS user_trade_volume_fee_update_time ON user_trade_volume_fee (update_time);

CREATE TABLE IF NOT EXISTS receipt (
    tx_hash TEXT PRIMARY KEY NOT NULL,
    status INT NOT NULL,
    data TEXT NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    update_time TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS receipt_update_time ON receipt (update_time);

CREATE TABLE IF NOT EXISTS storage (
    id TEXT PRIMARY KEY NOT NULL,
    account TEXT NOT NULL,
    key TEXT NOT NULL,
    blk_number INT NOT NULL,
    status INT NOT NULL,
    data TEXT NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    update_time TIMESTAMPTZ NOT NULL DEFAULT now(),
);
CREATE INDEX IF NOT EXISTS storage_update_time ON storage (update_time);