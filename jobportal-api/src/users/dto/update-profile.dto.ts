import { z } from 'zod';

export const updateEmployeeProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  bio: z.string().optional(),
});

export const updateEmployerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  bio: z.string().optional(),
});

export type UpdateEmployeeProfileDto = z.infer<typeof updateEmployeeProfileSchema>;
export type UpdateEmployerProfileDto = z.infer<typeof updateEmployerProfileSchema>;
