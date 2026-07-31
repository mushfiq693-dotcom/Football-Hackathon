export type PlayerCategory = 'goalkeeper' | 'defender' | 'midfielder' | 'striker';
export type PlayerAuctionStatus = 'available' | 'in_bidding' | 'sold' | 'unsold';

export interface PlayerStats {
  goals?: number;
  assists?: number;
  clean_sheets?: number;
  matches_played?: number;
  rating?: number;
  [key: string]: number | undefined;
}

export interface Player {
  id: string;
  tournament_id: string;
  name: string;
  photo_url: string | null;
  category: PlayerCategory;
  base_price: number;
  age: number | null;
  nationality: string | null;
  stats: PlayerStats;
  bio: string | null;
  auction_status: PlayerAuctionStatus;
  sold_to_team_id: string | null;
  sold_price: number | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}
