import type { Player } from './player';

export interface Team {
  id: string;
  tournament_id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
  color_primary: string | null;
  color_secondary: string | null;
  owner_id: string;
  budget_remaining: number;
  players_count: number;
  created_at: string;
  updated_at: string;
  // Relations (optional, populated by joins)
  players?: Player[];
}
