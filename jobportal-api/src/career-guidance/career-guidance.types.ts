// ─── Skill & Category Definitions ──────────────────────────────────────

export type SkillImportance = 'core' | 'supporting' | 'adjacent';

export interface SkillDefinition {
  canonical: string;
  aliases: string[];
  importance: SkillImportance;
}

export interface CategoryDefinition {
  name: string;
  skills: SkillDefinition[];
}

// ─── Scoring Config ────────────────────────────────────────────────────

export interface ScoringConfig {
  /** Weight given to core skill matches (out of 100) */
  coreWeight: number;
  /** Weight given to supporting skill matches (out of 100) */
  supportingWeight: number;
  /** Weight given to adjacent skill matches (out of 100) */
  adjacentWeight: number;
  /** Minimum normalized score for top category to be considered a valid match */
  minimumPrimaryThreshold: number;
  /** Minimum normalized score for 2nd category to qualify for combination role */
  minimumSecondaryThreshold: number;
  /** Minimum ratio (secondary/primary) to trigger combination role */
  combinationRatioThreshold: number;
}

// ─── Scoring Results ───────────────────────────────────────────────────

export interface CategoryScore {
  category: string;
  matchedSkills: string[];
  coreMatched: number;
  coreTotal: number;
  supportingMatched: number;
  supportingTotal: number;
  adjacentMatched: number;
  adjacentTotal: number;
  normalizedScore: number; // 0–100
}

export interface DebugTrace {
  inputSkills: string[];
  normalizedInputSkills: string[];
  categoryScores: CategoryScore[];
  decisionReason: string;
  combinationRatio: number | null;
}

// ─── Career Path ───────────────────────────────────────────────────────

export interface CareerPath {
  title: string;
  description: string;
  keyResponsibilities: string[];
  whyItFits: string;
  relevantJobTitles: string[];
  matchScore: number;
  category: string;
}

// ─── Final Analysis Response ───────────────────────────────────────────

export interface CareerAnalysis {
  careerSummary: string;
  primaryCareerTitle: string;
  careerCategory: string;
  skillBreakdown: {
    category: string;
    matchedSkills: string[];
    normalizedScore: number;
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
  debugTrace?: DebugTrace;
}
