import { z } from 'zod';

export const registrationSchema = z.object({
  tournament_id: z.string().uuid(),
  photo_url: z.string().url().optional().nullable(),
  department: z.string().min(1),
  session: z.string().min(1),
  position: z.enum(['goalkeeper', 'defender', 'midfielder', 'striker']),
  jersey_number: z.number().int().min(1).max(99),
  preferred_foot: z.enum(['left', 'right', 'both']),
  phone: z.string().min(10),
});

export const updateRegistrationSchema = registrationSchema.partial().extend({
  status: z.enum(['pending', 'approved', 'rejected', 'withdrawn']).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>;
