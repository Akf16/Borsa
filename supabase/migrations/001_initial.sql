-- Borsa Dashboard - Supabase Schema
-- Bu SQL'i Supabase Dashboard > SQL Editor'de calistirin

-- Piyasa anlık görüntüleri (15sn'de bir kaydedilir)
CREATE TABLE IF NOT EXISTS market_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pair_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  price NUMERIC NOT NULL,
  change_24h NUMERIC NOT NULL,
  high_24h NUMERIC NOT NULL,
  low_24h NUMERIC NOT NULL,
  volume NUMERIC,
  signal_direction TEXT NOT NULL CHECK (signal_direction IN ('long', 'short', 'neutral')),
  signal_confidence INTEGER NOT NULL,
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC NOT NULL,
  take_profit_1 NUMERIC NOT NULL,
  take_profit_2 NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_market_snapshots_pair_created
  ON market_snapshots (pair_id, created_at DESC);

-- YZ sinyal geçmişi
CREATE TABLE IF NOT EXISTS ai_signals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pair_id TEXT NOT NULL,
  symbol TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('long', 'short', 'neutral')),
  confidence INTEGER NOT NULL,
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC NOT NULL,
  take_profit_1 NUMERIC NOT NULL,
  take_profit_2 NUMERIC NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '4 Saat',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_signals_pair_created
  ON ai_signals (pair_id, created_at DESC);

-- Row Level Security
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_signals ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public dashboard)
CREATE POLICY "Public read market_snapshots"
  ON market_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Public read ai_signals"
  ON ai_signals FOR SELECT
  USING (true);

-- Anon key ile yazma (dashboard veri kaydı)
CREATE POLICY "Anon insert market_snapshots"
  ON market_snapshots FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anon insert ai_signals"
  ON ai_signals FOR INSERT
  WITH CHECK (true);
