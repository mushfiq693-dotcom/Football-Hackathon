import type { Player } from './player';

export type AuctionStatus = 'draft' | 'scheduled' | 'live' | 'paused' | 'completed' | 'cancelled';
export type BidStatus = 'active' | 'outbid' | 'won' | 'cancelled';

export interface Auction {
  id: string;
  tournament_id: string;
  name: string;
  description: string | null;
  status: AuctionStatus;
  auctioneer_id: string;
  bid_timer_seconds: number;
  min_bid_increment: number;
  current_player_id: string | null;
  started_at: string | null;
  ended_at: string | null;
  round_number: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  current_player?: Player;
}

export interface AuctionPlayer {
  id: string;
  auction_id: string;
  player_id: string;
  sort_order: number;
  status: 'available' | 'in_bidding' | 'sold' | 'unsold';
  created_at: string;
  // Relations
  player?: Player;
}

export interface Bid {
  id: string;
  auction_id: string;
  player_id: string;
  team_id: string;
  bidder_id: string;
  amount: number;
  status: BidStatus;
  bid_number: number;
  created_at: string;
}

export interface AuctionLog {
  id: string;
  auction_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  performed_by: string | null;
  created_at: string;
}
