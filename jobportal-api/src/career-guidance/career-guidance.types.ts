export interface SkillMapping {
  canonical: string;
  aliases: string[];
  weight: number;
}

export interface CareerCategory {
  name: string;
  skills: SkillMapping[];
  weightMultiplier: number;
}

export interface CareerPath {
  title: string;
  description: string;
  keyResponsibilities: string[];
  whyItFits: string;
  relevantJobTitles: string[];
  matchScore: number;
  category: string;
}

export interface CareerAnalysis {
  careerSummary: string;
  primaryCareerTitle: string;
  careerCategory: string;
  skillBreakdown: {
    category: string;
    matchedSkills: string[];
    weight: number;
    percentage: number;
  }[];
  recommendedCareerPaths: CareerPath[];
  skillsToEnhance: {
    category: string;
    skills: {
      name: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }[];
  }[];
  learningApproach: {
    title: string;
    steps: {
      action: string;
      description: string;
    }[];
  }[];
}
