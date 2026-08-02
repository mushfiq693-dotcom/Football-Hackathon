import { z } from 'zod';

export const createEventSchema = z.object({
  event_name: z.string().min(3, 'Event name must be at least 3 characters').max(100),
  academic_session: z.string().min(1, 'Academic session is required').max(50),
  department: z.string().min(1, 'Department is required').max(100),
  tournament_name: z.string().min(3, 'Tournament name must be at least 3 characters').max(100),
  logo_url: z.string().url('Invalid logo URL').optional().nullable().or(z.literal('')),
  description: z.string().max(500).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
