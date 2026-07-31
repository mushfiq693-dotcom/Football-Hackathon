-- Bids table

CREATE TABLE bids (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id      UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  player_id       UUID NOT NULL REFERENCES players(id),
  team_id         UUID NOT NULL REFERENCES teams(id),
  bidder_id       UUID NOT NULL REFERENCES profiles(id),
  amount          BIGINT NOT NULL,
  status          bid_status NOT NULL DEFAULT 'active',
  bid_number      INT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(auction_id, player_id, bid_number)
);

CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_player ON bids(player_id);
CREATE INDEX idx_bids_team ON bids(team_id);
CREATE INDEX idx_bids_amount ON bids(auction_id, player_id, amount DESC);

-- Audit log
CREATE TABLE auction_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id      UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL,
  payload         JSONB NOT NULL DEFAULT '{}',
  performed_by    UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auction_logs_auction ON auction_logs(auction_id);
CREATE INDEX idx_auction_logs_type ON auction_logs(event_type);
CREATE INDEX idx_auction_logs_time ON auction_logs(created_at DESC);
