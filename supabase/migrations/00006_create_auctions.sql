-- Auctions table

CREATE TABLE auctions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id       UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  description         TEXT,
  status              auction_status NOT NULL DEFAULT 'draft',
  auctioneer_id       UUID NOT NULL REFERENCES profiles(id),
  bid_timer_seconds   INT NOT NULL DEFAULT 15,
  min_bid_increment   BIGINT NOT NULL DEFAULT 50000,
  current_player_id   UUID REFERENCES players(id),
  started_at          TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,
  round_number        INT NOT NULL DEFAULT 1,
  sort_order          INT NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auctions_tournament ON auctions(tournament_id);
CREATE INDEX idx_auctions_status ON auctions(status);
CREATE INDEX idx_auctions_auctioneer ON auctions(auctioneer_id);

-- Auction players queue
CREATE TABLE auction_players (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id      UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  sort_order      INT NOT NULL DEFAULT 0,
  status          player_auction_status NOT NULL DEFAULT 'available',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(auction_id, player_id)
);

CREATE INDEX idx_auction_players_auction ON auction_players(auction_id);
CREATE INDEX idx_auction_players_sort ON auction_players(auction_id, sort_order);

CREATE TRIGGER set_auctions_updated_at
  BEFORE UPDATE ON auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
