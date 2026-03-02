-- SHIFT Hub — Supabase Table Setup
-- Run this in the Supabase SQL editor at: https://supabase.com/dashboard/project/mumohnifkvolizqrisrw/sql

-- ── AI Assessment ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_assessments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answers    jsonb NOT NULL DEFAULT '{}',
  scores     jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their ai assessments"
  ON ai_assessments FOR ALL
  USING (auth.uid() = user_id);

-- Unique constraint so upsert on user_id works
ALTER TABLE ai_assessments ADD CONSTRAINT ai_assessments_user_id_key UNIQUE (user_id);

-- ── Change Readiness ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS change_assessments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answers    jsonb NOT NULL DEFAULT '{}',
  scores     jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE change_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their change assessments"
  ON change_assessments FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE change_assessments ADD CONSTRAINT change_assessments_user_id_key UNIQUE (user_id);

-- ── Equity (hub version — separate from standalone equityanalysis) ──────────
CREATE TABLE IF NOT EXISTS equity_assessments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  answers    jsonb NOT NULL DEFAULT '{}',
  scores     jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE equity_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their equity assessments"
  ON equity_assessments FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE equity_assessments ADD CONSTRAINT equity_assessments_user_id_key UNIQUE (user_id);
