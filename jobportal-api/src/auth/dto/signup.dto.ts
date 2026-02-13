import { z } from 'zod';

// Employee signup schema - for job seekers
export const employeeSignupSchema = z.object({
  userType: z.literal('employee'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().optional(),
});

// Employer signup schema - for recruiters/companies
export const employerSignupSchema = z.object({
  userType: z.literal('employer'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^\d+$/, 'Phone number must contain only digits').min(10, 'Phone number must be at least 10 digits'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  bio: z.string().optional(),
});

// Combined signup schema
export const signupSchema = z.discriminatedUnion('userType', [
  employeeSignupSchema,
  employerSignupSchema,
]);

export type EmployeeSignupDto = z.infer<typeof employeeSignupSchema>;
export type EmployerSignupDto = z.infer<typeof employerSignupSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
