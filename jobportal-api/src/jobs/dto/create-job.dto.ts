import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  skills: z.string().min(1, 'Skills are required'),
  budget: z.string().optional()
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
