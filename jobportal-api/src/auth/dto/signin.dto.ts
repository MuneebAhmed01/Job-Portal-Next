import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export type SigninDto = z.infer<typeof signinSchema>;
