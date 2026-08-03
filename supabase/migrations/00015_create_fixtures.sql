-- Fixtures table

CREATE TABLE fixtures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  home_team_id    UUID NOT NULL REFERENCES teams(id),
  away_team_id    UUID NOT NULL REFERENCES teams(id),
  venue           TEXT,
  kickoff_time    TIMESTAMPTZ,
  status          TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fixtures_tournament ON fixtures(tournament_id);
CREATE INDEX idx_fixtures_teams ON fixtures(home_team_id, away_team_id);

CREATE TRIGGER set_fixtures_updated_at
  BEFORE UPDATE ON fixtures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
