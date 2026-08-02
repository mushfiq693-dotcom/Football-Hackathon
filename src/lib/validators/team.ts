import { z } from 'zod';

export const createTeamSchema = z.object({
  tournament_id: z.string().uuid(),
  name: z.string().min(2).max(50),
  short_name: z.string().min(2).max(5).toUpperCase(),
  color_primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').optional(),
  color_secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').optional(),
  logo_url: z.string().url().optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  short_name: z.string().min(2).max(5).toUpperCase().optional(),
  color_primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').optional(),
  color_secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').optional(),
  logo_url: z.string().url().optional(),
  owner_id: z.string().uuid().optional(),
  budget_remaining: z.number().int().optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
