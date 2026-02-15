import { Injectable, Logger } from '@nestjs/common';

// ─── Scoring Config ────────────────────────────────────────────────────

export interface AtsScoringConfig {
  weights: {
    skillsMatch: number;      // 35%
    experienceRelevance: number; // 25%
    structure: number;         // 20%
    formatting: number;        // 10%
    keywordDensity: number;    // 10%
  };
  penalties: {
    missingSkillsSection: number;
    missingExperienceSection: number;
    missingContactInfo: number;
    noMeasurableAchievements: number;
    tooShortContent: number;
    noActionVerbs: number;
  };
  scoreFloor: number;
  scoreCeiling: number;
  defaultJobMatchWhenNoJD: number;
}

const DEFAULT_CONFIG: AtsScoringConfig = {
  weights: {
    skillsMatch: 35,
    experienceRelevance: 25,
    structure: 20,
    formatting: 10,
    keywordDensity: 10,
  },
  penalties: {
    missingSkillsSection: 15,
    missingExperienceSection: 15,
    missingContactInfo: 10,
    noMeasurableAchievements: 10,
    tooShortContent: 10,
    noActionVerbs: 2,
  },
  scoreFloor: 10,
  scoreCeiling: 95,
  defaultJobMatchWhenNoJD: 30,
};

// ─── Result Interfaces ─────────────────────────────────────────────────

export interface AtsScoreBreakdown {
  formatting: number;
  keywords: number;
  structure: number;
  readability: number;
  jobMatch: number;
}

export interface AtsPenalty {
  reason: string;
  points: number;
}

export interface AtsAnalysisResult {
  score: number;
  breakdown: AtsScoreBreakdown;
  penalties: AtsPenalty[];
  analysis: {
    hasContactInfo: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    sectionCount: number;
    wordCount: number;
    keywordMatches: string[];
    formattingIssues: string[];
    actionVerbCount: number;
    hasMeasurableAchievements: boolean;
    jobMatchAnalysis?: {
      skillMatches: string[];
      experienceMatches: string[];
      qualificationMatches: string[];
      missingKeywords: string[];
      matchPercentage: number;
    };
  };
}

// ─── Service ───────────────────────────────────────────────────────────

@Injectable()
export class AtsScorerService {
  private readonly logger = new Logger(AtsScorerService.name);
  private readonly config: AtsScoringConfig = DEFAULT_CONFIG;

  private readonly techKeywords = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'express', 'nest.js',
    'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
    'html', 'css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'babel',
    'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'data science',
    'devops', 'ci/cd', 'terraform', 'kafka', 'spark', 'hadoop',
    'figma', 'photoshop', 'illustrator',
  ];

  private readonly actionVerbs = [
    'developed', 'implemented', 'created', 'designed', 'built', 'led', 'managed',
    'optimized', 'improved', 'launched', 'deployed', 'tested', 'debugged',
    'maintained', 'updated', 'enhanced', 'reduced', 'increased', 'achieved',
    'coordinated', 'collaborated', 'mentored', 'trained', 'documented',
    'architected', 'spearheaded', 'streamlined', 'automated', 'migrated',
    'delivered', 'refactored', 'scaled', 'integrated', 'established',
  ];

  private readonly sectionHeaders = [
    'contact', 'summary', 'objective', 'profile', 'about',
    'experience', 'work experience', 'professional experience', 'employment',
    'education', 'academic', 'qualifications',
    'skills', 'technical skills', 'core competencies', 'technologies',
    'projects', 'certifications', 'awards', 'publications',
  ];

  // ─── Main Entry Point ─────────────────────────────────────────────────

  analyzeResume(text: string, jobDescription?: string): AtsAnalysisResult {
    const lowerText = text.toLowerCase();
    const penalties: AtsPenalty[] = [];

    // ── Gather analysis data ──
    const analysis = {
      hasContactInfo: this.hasContactInfo(text),
      hasSummary: this.hasSectionHeader(lowerText, ['summary', 'objective', 'profile', 'about me']),
      hasExperience: this.hasSectionHeader(lowerText, ['experience', 'work experience', 'professional experience', 'employment history']),
      hasEducation: this.hasSectionHeader(lowerText, ['education', 'academic', 'qualifications', 'university']),
      hasSkills: this.hasSectionHeader(lowerText, ['skills', 'technical skills', 'core competencies', 'technologies']),
      sectionCount: this.countSectionHeaders(lowerText),
      wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
      keywordMatches: this.findKeywords(lowerText),
      formattingIssues: this.checkFormattingIssues(text),
      actionVerbCount: this.countActionVerbs(lowerText),
      hasMeasurableAchievements: this.hasMeasurableAchievements(text),
      jobMatchAnalysis: jobDescription
        ? this.analyzeJobMatch(lowerText, jobDescription.toLowerCase())
        : undefined,
    };

    // ── Compute dimension scores (each 0–100) ──
    const formattingScore = this.computeFormattingScore(analysis);
    const keywordScore = this.computeKeywordScore(analysis);
    const structureScore = this.computeStructureScore(analysis);
    const readabilityScore = this.computeReadabilityScore(analysis);
    const jobMatchScore = analysis.jobMatchAnalysis
      ? analysis.jobMatchAnalysis.matchPercentage
      : this.config.defaultJobMatchWhenNoJD;

    // ── Weighted combination ──
    const { weights } = this.config;
    const weightedScore =
      (keywordScore * weights.skillsMatch / 100) +
      (readabilityScore * weights.experienceRelevance / 100) +
      (structureScore * weights.structure / 100) +
      (formattingScore * weights.formatting / 100) +
      (jobMatchScore * weights.keywordDensity / 100);

    // ── Apply hard penalties ──
    if (!analysis.hasSkills) {
      penalties.push({ reason: 'Missing Skills section', points: this.config.penalties.missingSkillsSection });
    }
    if (!analysis.hasExperience) {
      penalties.push({ reason: 'Missing Experience section', points: this.config.penalties.missingExperienceSection });
    }
    if (!analysis.hasContactInfo) {
      penalties.push({ reason: 'Missing contact information', points: this.config.penalties.missingContactInfo });
    }
    if (!analysis.hasMeasurableAchievements) {
      penalties.push({ reason: 'No measurable achievements (numbers, percentages, metrics)', points: this.config.penalties.noMeasurableAchievements });
    }
    if (analysis.wordCount < 50) {
      penalties.push({ reason: 'Resume content too short (< 50 words)', points: this.config.penalties.tooShortContent });
    }
    if (analysis.actionVerbCount < 3) {
      penalties.push({ reason: 'Too few action verbs', points: this.config.penalties.noActionVerbs });
    }

    const totalPenalty = penalties.reduce((sum, p) => sum + p.points, 0);
    const finalScore = Math.round(
      Math.max(
        this.config.scoreFloor,
        Math.min(this.config.scoreCeiling, weightedScore - totalPenalty),
      ),
    );

    this.logger.log(
      `ATS Score: ${finalScore} (base=${Math.round(weightedScore)}, penalties=${totalPenalty}) ` +
      `[fmt=${Math.round(formattingScore)} kw=${Math.round(keywordScore)} str=${Math.round(structureScore)} ` +
      `rd=${Math.round(readabilityScore)} jm=${Math.round(jobMatchScore)}]`,
    );

    return {
      score: finalScore,
      breakdown: {
        formatting: Math.round(formattingScore),
        keywords: Math.round(keywordScore),
        structure: Math.round(structureScore),
        readability: Math.round(readabilityScore),
        jobMatch: Math.round(jobMatchScore),
      },
      penalties,
      analysis,
    };
  }

  // ─── Dimension Scorers (each returns 0–100) ──────────────────────────

  private computeFormattingScore(analysis: AtsAnalysisResult['analysis']): number {
    let score = 100;

    // Each formatting issue costs 15 points (steeper than before)
    score -= analysis.formattingIssues.length * 15;

    return Math.max(0, score);
  }

  private computeKeywordScore(analysis: AtsAnalysisResult['analysis']): number {
    // Matching half the keywords should give ~60, not 100
    // Formula: (matched / 15) * 100, capped at 100
    // We expect a solid resume to have at least 15 relevant keywords, not ALL of them.
    const ratio = analysis.keywordMatches.length / 15;
    return Math.min(100, Math.round(ratio * 100));
  }

  private computeStructureScore(analysis: AtsAnalysisResult['analysis']): number {
    let score = 0;

    // Critical sections worth more
    if (analysis.hasContactInfo) score += 20;
    if (analysis.hasExperience) score += 25;
    if (analysis.hasSkills) score += 25;
    if (analysis.hasEducation) score += 15;
    if (analysis.hasSummary) score += 15;

    return Math.min(100, score);
  }

  private computeReadabilityScore(analysis: AtsAnalysisResult['analysis']): number {
    let score = 0;

    // Word count: 300+ words = full credit, proportional below
    const wordScore = Math.min(40, (analysis.wordCount / 300) * 40);
    score += wordScore;

    // Action verbs: 10+ = full credit
    const verbScore = Math.min(30, (analysis.actionVerbCount / 10) * 30);
    score += verbScore;

    // Measurable achievements
    if (analysis.hasMeasurableAchievements) {
      score += 30;
    }

    return Math.min(100, Math.round(score));
  }

  // ─── Section Detection (header-based, not word occurrence) ────────────

  /**
   * Checks for section HEADERS — looks for keywords near line starts
   * or on their own lines, not just anywhere in the text.
   */
  private hasSectionHeader(text: string, keywords: string[]): boolean {
    const lines = text.split('\n').map(l => l.trim().toLowerCase());

    for (const line of lines) {
      // A section header is typically a short line (< 60 chars) that
      // starts with or equals a keyword
      if (line.length > 0 && line.length < 60) {
        for (const keyword of keywords) {
          if (line === keyword ||
            line.startsWith(keyword + ':') ||
            line.startsWith(keyword + ' ') ||
            line.endsWith(keyword)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private countSectionHeaders(text: string): number {
    let count = 0;
    const lines = text.split('\n').map(l => l.trim().toLowerCase());

    for (const header of this.sectionHeaders) {
      for (const line of lines) {
        if (line.length > 0 && line.length < 60) {
          if (line === header ||
            line.startsWith(header + ':') ||
            line.startsWith(header + ' ')) {
            count++;
            break; // count each header type once
          }
        }
      }
    }

    return count;
  }

  // ─── Contact Info Detection ───────────────────────────────────────────

  private hasContactInfo(text: string): boolean {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const linkedinRegex = /linkedin\.com\/in\//i;
    return emailRegex.test(text) || phoneRegex.test(text) || linkedinRegex.test(text);
  }

  // ─── Keyword Matching ────────────────────────────────────────────────

  private findKeywords(text: string): string[] {
    return this.techKeywords.filter(keyword => {
      // Use word boundary matching to prevent false positives
      // e.g., "css" shouldn't match "accessing"
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(text);
    });
  }

  // ─── Formatting Checks ───────────────────────────────────────────────

  private checkFormattingIssues(text: string): string[] {
    const issues: string[] = [];

    if (text.includes('\t')) {
      issues.push('Contains tabs (use spaces instead for ATS compatibility)');
    }

    const lines = text.split('\n');
    const consecutiveEmptyLines = lines.filter((line, index) =>
      line.trim() === '' && lines[index - 1]?.trim() === '',
    ).length;
    if (consecutiveEmptyLines > 3) {
      issues.push('Excessive empty lines reduce readability');
    }

    // Check for table formatting
    const tableLines = lines.filter(l => (l.match(/\|/g) || []).length >= 2);
    if (tableLines.length > 2) {
      issues.push('Contains table formatting (may not parse in ATS)');
    }

    // Check for special characters that ATS might not parse
    if (/[■●◆►▸▪]/.test(text)) {
      issues.push('Contains special bullet characters (use standard bullets)');
    }

    return issues;
  }

  // ─── Action Verbs ─────────────────────────────────────────────────────

  private countActionVerbs(text: string): number {
    return this.actionVerbs.filter(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      return regex.test(text);
    }).length;
  }

  // ─── Measurable Achievements ──────────────────────────────────────────

  private hasMeasurableAchievements(text: string): boolean {
    // Look for patterns like "increased X by 30%", "managed $2M budget",
    // "reduced latency by 50ms", "led team of 12", etc.
    const patterns = [
      /\d+%/,                          // percentages
      /\$[\d,]+/,                      // dollar amounts
      /\d+\s*(users|customers|clients|team|members|engineers|developers)/i,
      /(increased|decreased|reduced|improved|grew|saved|generated)\s.*?\d+/i,
      /\d+x\s/i,                       // multipliers like "3x improvement"
    ];

    return patterns.some(p => p.test(text));
  }

  // ─── Job Match Analysis ───────────────────────────────────────────────

  private analyzeJobMatch(resumeText: string, jobDescription: string) {
    // Extract unique keywords from job description
    const jobSkills = this.extractJobSkills(jobDescription);
    const jobRequirements = this.extractJobRequirements(jobDescription);

    // Deduplicate — use a Set to avoid double-counting
    const allJobKeywords = [...new Set([...jobSkills, ...jobRequirements])];

    if (allJobKeywords.length === 0) {
      return {
        skillMatches: [],
        experienceMatches: [],
        qualificationMatches: [],
        missingKeywords: [],
        matchPercentage: this.config.defaultJobMatchWhenNoJD,
      };
    }

    // Find matches using word-boundary regex
    const skillMatches = jobSkills.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(resumeText);
    });

    const experienceMatches = jobRequirements.filter(req => {
      const escaped = req.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(resumeText);
    });

    // Missing keywords (from deduplicated set)
    const foundKeywords = new Set([...skillMatches, ...experienceMatches]);
    const missingKeywords = allJobKeywords.filter(k => !foundKeywords.has(k));

    // Match percentage from deduplicated set
    const matchPercentage = Math.round((foundKeywords.size / allJobKeywords.length) * 100);

    return {
      skillMatches,
      experienceMatches,
      qualificationMatches: [], // simplified — avoid duplicates
      missingKeywords,
      matchPercentage,
    };
  }

  private extractJobSkills(jobDescription: string): string[] {
    // Find tech keywords that appear in the job description
    return this.techKeywords.filter(skill => {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(jobDescription);
    });
  }

  private extractJobRequirements(jobDescription: string): string[] {
    const requirements: string[] = [];

    // Common soft skills and requirements
    const commonRequirements = [
      'team player', 'communication skills', 'problem solving', 'analytical skills',
      'leadership', 'project management', 'time management', 'attention to detail',
    ];
    requirements.push(...commonRequirements.filter(req => jobDescription.includes(req)));

    // Education keywords
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'certification'];
    requirements.push(...educationKeywords.filter(k => jobDescription.includes(k)));

    return [...new Set(requirements)]; // deduplicate
  }
}
