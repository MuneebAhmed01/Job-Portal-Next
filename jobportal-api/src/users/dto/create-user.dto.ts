import { z } from 'zod';

export const createEmployeeSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  bio: z.string().optional(),
});

export const createEmployerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  bio: z.string().optional(),
});

export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;
export type CreateEmployerDto = z.infer<typeof createEmployerSchema>;
