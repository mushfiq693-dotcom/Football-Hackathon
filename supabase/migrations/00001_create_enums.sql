-- Enums for the Football Auction Platform

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'auctioneer', 'team_owner', 'captain', 'viewer');
CREATE TYPE player_category AS ENUM ('goalkeeper', 'defender', 'midfielder', 'striker');
CREATE TYPE auction_status AS ENUM ('draft', 'scheduled', 'live', 'paused', 'completed', 'cancelled');
CREATE TYPE player_auction_status AS ENUM ('available', 'in_bidding', 'sold', 'unsold');
CREATE TYPE bid_status AS ENUM ('active', 'outbid', 'won', 'cancelled');
CREATE TYPE tournament_status AS ENUM ('draft', 'registration', 'active', 'completed', 'archived');
