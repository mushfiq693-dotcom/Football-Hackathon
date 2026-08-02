export type TournamentStatus = 
  | 'Draft' 
  | 'Registration Open' 
  | 'Registration Closed' 
  | 'Auction Scheduled' 
  | 'Auction Live' 
  | 'Completed' 
  | 'Cancelled';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  season: string | null;
  venue: string | null;
  registration_start: string | null;
  registration_end: string | null;
  auction_date: string | null;
  max_teams: number;
  budget_per_team: number;
  minimum_bid: number;
  bid_increment: number;
  status: TournamentStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}
