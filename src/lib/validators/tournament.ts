import { z } from 'zod';

export const createTournamentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  season: z.string().max(20).optional(),
  max_teams: z.number().int().min(2).max(32).default(8),
  budget_per_team: z.number().int().min(100000).default(10000000),
  max_players_per_team: z.number().int().min(5).max(30).default(15),
  min_players_per_team: z.number().int().min(1).max(30).default(11),
});

export const updateTournamentSchema = createTournamentSchema.partial();

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
