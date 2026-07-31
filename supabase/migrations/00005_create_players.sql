-- Players table

CREATE TABLE players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id   UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  photo_url       TEXT,
  category        player_category NOT NULL,
  base_price      BIGINT NOT NULL,
  age             INT,
  nationality     TEXT,
  stats           JSONB DEFAULT '{}',
  bio             TEXT,
  auction_status  player_auction_status NOT NULL DEFAULT 'available',
  sold_to_team_id UUID REFERENCES teams(id),
  sold_price      BIGINT,
  sold_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_players_tournament ON players(tournament_id);
CREATE INDEX idx_players_auction_status ON players(auction_status);
CREATE INDEX idx_players_category ON players(category);
CREATE INDEX idx_players_sold_team ON players(sold_to_team_id);

CREATE TRIGGER set_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
