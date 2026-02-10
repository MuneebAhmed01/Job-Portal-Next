import { z } from 'zod';
import { UserRole } from '../../lib/prisma/client';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['USER', 'EMPLOYER', 'ADMIN', 'FIND_JOB', 'HIRE_TALENT']).optional(),
  resume: z.any().refine(file => file, {
    message: 'Resume is required'
  }),
  bio: z.string().optional(),
});

export type SignupDto = z.infer<typeof signupSchema>;
