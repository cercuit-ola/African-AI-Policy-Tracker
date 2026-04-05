-- Run this once to set up your database
-- On Vercel: use the SQL editor in your Postgres dashboard
-- Locally: psql -d yourdb -f lib/schema.sql

CREATE TABLE IF NOT EXISTS policies (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  country     TEXT NOT NULL,
  flag        TEXT,
  region      TEXT,                          -- e.g. West Africa, East Africa
  type        TEXT CHECK (type IN ('legislation','regulation','framework','policy','treaty')),
  status      TEXT CHECK (status IN ('enacted','review','draft','proposed','withdrawn')),
  summary     TEXT,
  source_url  TEXT,
  published_at DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast filtering
CREATE INDEX IF NOT EXISTS idx_policies_type    ON policies(type);
CREATE INDEX IF NOT EXISTS idx_policies_status  ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_country ON policies(country);
CREATE INDEX IF NOT EXISTS idx_policies_date    ON policies(published_at DESC);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON policies;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
