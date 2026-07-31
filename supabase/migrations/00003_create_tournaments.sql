-- Tournaments table

CREATE TABLE tournaments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  season          TEXT,
  logo_url        TEXT,
  max_teams       INT NOT NULL DEFAULT 8,
  budget_per_team BIGINT NOT NULL DEFAULT 10000000,
  max_players_per_team INT NOT NULL DEFAULT 15,
  min_players_per_team INT NOT NULL DEFAULT 11,
  status          tournament_status NOT NULL DEFAULT 'draft',
  created_by      UUID NOT NULL REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_slug ON tournaments(slug);

CREATE TRIGGER set_tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
