import { z } from 'zod';

export const updateTailorStatusSchema = z.object({
  target_id: z.string().uuid('Invalid tailor ID'),
  action: z.enum(['suspend', 'reactivate']),
});

export type UpdateTailorStatusInput = z.infer<typeof updateTailorStatusSchema>;
