import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Location is required'),
  salaryRange: z.string().min(1, 'Salary range is required'),
  salary: z.number().int().min(0).optional(),
  type: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).optional().default('ONSITE'),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
