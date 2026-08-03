-- Match events table

CREATE TABLE match_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id      UUID NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL, -- goal, yellow_card, red_card, sub
  player_id       UUID REFERENCES players(id),
  team_id         UUID REFERENCES teams(id),
  minute          INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Update fixtures to track scores and MoM
ALTER TABLE fixtures ADD COLUMN home_score INT NOT NULL DEFAULT 0;
ALTER TABLE fixtures ADD COLUMN away_score INT NOT NULL DEFAULT 0;
ALTER TABLE fixtures ADD COLUMN man_of_the_match_id UUID REFERENCES players(id);

CREATE INDEX idx_match_events_fixture ON match_events(fixture_id);
