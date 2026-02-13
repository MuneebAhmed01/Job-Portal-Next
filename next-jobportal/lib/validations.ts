import { z } from 'zod';

// ── Auth ──

export const signinSchema = z.object({
  email: z.string().min(1, 'Please enter your email').email('Invalid email format'),
  password: z.string().min(1, 'Please enter your password'),
});

export const employeeSignupSchema = z.object({
  name: z.string().min(1, 'Please enter your name').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Please enter your email').email('Invalid email format'),
  password: z.string().min(1, 'Please enter a password').min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(1, 'Please enter your phone number').regex(/^\d+$/, 'Phone number must contain only digits').min(10, 'Phone number must be at least 10 digits'),
  bio: z.string().optional(),
});

export const employerSignupSchema = employeeSignupSchema.extend({
  companyName: z.string().min(1, 'Please enter company name').min(2, 'Company name must be at least 2 characters'),
});

// ── Jobs ──

export const createJobSchema = z.object({
  title: z.string().min(1, 'Please enter a job title'),
  description: z.string().min(1, 'Please enter a description').min(10, 'Description must be at least 10 characters'),
  location: z.string().min(1, 'Please enter a location'),
  salaryRange: z.string().min(1, 'Please enter a salary range'),
  type: z.enum(['ONSITE', 'REMOTE', 'HYBRID']).optional().default('ONSITE'),
});

// Employer page job form (different shape: skills/budget instead of location/salaryRange)
export const employerJobPostSchema = z.object({
  title: z.string().min(1, 'Please enter a job title'),
  description: z.string().min(1, 'Please enter a description').min(10, 'Description must be at least 10 characters'),
  skills: z.string().min(1, 'Please enter required skills'),
  budget: z.string().optional(),
});

// ── Profile Update ──

export const updateEmployeeProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(1, 'Phone is required').regex(/^\d+$/, 'Phone must contain only digits').min(10, 'Phone must be at least 10 digits'),
  bio: z.string().optional(),
});

export const updateEmployerProfileSchema = updateEmployeeProfileSchema.extend({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
});

// ── Career Guidance ──

export const analyzeSkillsSchema = z.object({
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'Add at least one skill'),
});

// ── Types ──

export type SigninInput = z.infer<typeof signinSchema>;
export type EmployeeSignupInput = z.infer<typeof employeeSignupSchema>;
export type EmployerSignupInput = z.infer<typeof employerSignupSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type EmployerJobPostInput = z.infer<typeof employerJobPostSchema>;
export type UpdateEmployeeProfileInput = z.infer<typeof updateEmployeeProfileSchema>;
export type UpdateEmployerProfileInput = z.infer<typeof updateEmployerProfileSchema>;
export type AnalyzeSkillsInput = z.infer<typeof analyzeSkillsSchema>;

// ── Helper ──

export function getZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
