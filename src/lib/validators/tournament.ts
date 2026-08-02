import { z } from 'zod';

export const tournamentStatusSchema = z.enum([
  'Draft',
  'Registration Open',
  'Registration Closed',
  'Auction Scheduled',
  'Auction Live',
  'Completed',
  'Cancelled',
]);

export const createTournamentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().max(500).optional().nullable(),
  season: z.string().max(20).optional().nullable(),
  venue: z.string().max(100).optional().nullable(),
  registration_start: z.string().datetime().optional().nullable(),
  registration_end: z.string().datetime().optional().nullable(),
  auction_date: z.string().datetime().optional().nullable(),
  max_teams: z.number().int().min(2).max(64).default(8),
  budget_per_team: z.number().int().min(0).default(10000000),
  minimum_bid: z.number().int().min(0).default(0),
  bid_increment: z.number().int().min(1000).default(50000),
  status: tournamentStatusSchema.default('Draft'),
});

export const updateTournamentSchema = createTournamentSchema.partial();

export type CreateTournamentInput = z.infer<typeof createTournamentSchema>;
export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;
