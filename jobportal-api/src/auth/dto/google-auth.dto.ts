import { z } from 'zod';

export const googleAuthSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
});

export const googleRoleSchema = z.object({
  role: z.enum(['employee', 'employer']).optional(),
});

export type GoogleAuthDto = z.infer<typeof googleAuthSchema>;
export type GoogleRoleDto = z.infer<typeof googleRoleSchema>;
