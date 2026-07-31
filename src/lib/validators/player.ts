import { z } from 'zod';

const playerCategories = ['goalkeeper', 'defender', 'midfielder', 'striker'] as const;

export const createPlayerSchema = z.object({
  tournament_id: z.string().uuid(),
  name: z.string().min(2).max(100),
  category: z.enum(playerCategories),
  base_price: z.number().int().min(0),
  age: z.number().int().min(15).max(50).optional(),
  nationality: z.string().max(50).optional(),
  bio: z.string().max(1000).optional(),
  stats: z.record(z.number()).optional(),
});

export const updatePlayerSchema = createPlayerSchema.partial().omit({ tournament_id: true });

export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;
