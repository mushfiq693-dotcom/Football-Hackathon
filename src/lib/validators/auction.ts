import { z } from 'zod';

export const createAuctionSchema = z.object({
  tournament_id: z.string().uuid(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  bid_timer_seconds: z.number().int().min(5).max(120).default(15),
  min_bid_increment: z.number().int().min(1000).default(50000),
  round_number: z.number().int().min(1).default(1),
});

export const updateAuctionSchema = createAuctionSchema.partial().omit({ tournament_id: true });

export type CreateAuctionInput = z.infer<typeof createAuctionSchema>;
export type UpdateAuctionInput = z.infer<typeof updateAuctionSchema>;
