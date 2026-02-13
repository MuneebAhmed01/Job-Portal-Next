import { z } from 'zod';

export const searchJobsSchema = z.object({
  keyword: z.string().optional(),
  type: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).optional(),
  location: z.string().optional(),
  minSalary: z.coerce.number().int().min(0).optional(),
  maxSalary: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(['createdAt', 'salary', 'relevance']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type SearchJobsDto = z.infer<typeof searchJobsSchema>;
