import { z } from 'zod';

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']),
});

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;
