export type TournamentStatus = 'draft' | 'registration' | 'active' | 'completed' | 'archived';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  season: string | null;
  logo_url: string | null;
  max_teams: number;
  budget_per_team: number;
  max_players_per_team: number;
  min_players_per_team: number;
  status: TournamentStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}
