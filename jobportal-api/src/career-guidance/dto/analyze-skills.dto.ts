import { z } from 'zod';

export const analyzeSkillsSchema = z.object({
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .min(1, 'At least one skill is required'),
});

export type AnalyzeSkillsDto = z.infer<typeof analyzeSkillsSchema>;
