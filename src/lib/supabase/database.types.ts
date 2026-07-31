/**
 * Auto-generated types from Supabase.
 * Run `npx supabase gen types typescript --local > src/lib/supabase/database.types.ts`
 * to regenerate after schema changes.
 *
 * Placeholder until database is set up.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'super_admin' | 'auctioneer' | 'team_owner' | 'viewer';
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'super_admin' | 'auctioneer' | 'team_owner' | 'viewer';
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'super_admin' | 'auctioneer' | 'team_owner' | 'viewer';
          phone?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
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
          status: 'draft' | 'registration' | 'active' | 'completed' | 'archived';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          season?: string | null;
          logo_url?: string | null;
          max_teams?: number;
          budget_per_team?: number;
          max_players_per_team?: number;
          min_players_per_team?: number;
          status?: 'draft' | 'registration' | 'active' | 'completed' | 'archived';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          season?: string | null;
          logo_url?: string | null;
          max_teams?: number;
          budget_per_team?: number;
          max_players_per_team?: number;
          min_players_per_team?: number;
          status?: 'draft' | 'registration' | 'active' | 'completed' | 'archived';
          updated_at?: string;
        };
      };
      // Additional tables will be fully typed after supabase gen types
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'super_admin' | 'auctioneer' | 'team_owner' | 'viewer';
      player_category: 'goalkeeper' | 'defender' | 'midfielder' | 'striker';
      auction_status: 'draft' | 'scheduled' | 'live' | 'paused' | 'completed' | 'cancelled';
      player_auction_status: 'available' | 'in_bidding' | 'sold' | 'unsold';
      bid_status: 'active' | 'outbid' | 'won' | 'cancelled';
      tournament_status: 'draft' | 'registration' | 'active' | 'completed' | 'archived';
    };
  };
}
