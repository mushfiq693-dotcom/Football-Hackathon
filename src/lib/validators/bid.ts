import { z } from 'zod';

export const placeBidSchema = z.object({
  auction_id: z.string().uuid(),
  player_id: z.string().uuid(),
  team_id: z.string().uuid(),
  amount: z.number().int().positive('Bid amount must be positive'),
});

export type PlaceBidInput = z.infer<typeof placeBidSchema>;
