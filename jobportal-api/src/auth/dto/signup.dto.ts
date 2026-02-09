import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email format').refine(email => email.endsWith('@gmail.com'), {
    message: 'Only Gmail addresses are allowed'
  }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['FIND_JOB', 'HIRE_TALENT']),
  resume: z.any().refine(file => file, {
    message: 'Resume is required'
  }),
  bio: z.string().optional()
});

export type SignupDto = z.infer<typeof signupSchema>;
