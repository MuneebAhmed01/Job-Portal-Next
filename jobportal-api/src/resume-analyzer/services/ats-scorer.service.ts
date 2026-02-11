import { Injectable } from '@nestjs/common';

export interface AtsScoreBreakdown {
  formatting: number;
  keywords: number;
  structure: number;
  readability: number;
  jobMatch: number;
}

export interface AtsAnalysisResult {
  score: number;
  breakdown: AtsScoreBreakdown;
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
    jobMatchAnalysis?: {
      skillMatches: string[];
      experienceMatches: string[];
      qualificationMatches: string[];
      missingKeywords: string[];
      matchPercentage: number;
    };
  };
}

@Injectable()
export class AtsScorerService {
  private readonly techKeywords = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'express', 'nest.js',
    'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
    'html', 'css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'babel'
  ];

  private readonly actionVerbs = [
    'developed', 'implemented', 'created', 'designed', 'built', 'led', 'managed',
    'optimized', 'improved', 'launched', 'deployed', 'tested', 'debugged',
    'maintained', 'updated', 'enhanced', 'reduced', 'increased', 'achieved',
    'coordinated', 'collaborated', 'mentored', 'trained', 'documented'
  ];

  private readonly requiredSections = [
    'contact', 'summary', 'objective', 'experience', 'work', 'education', 'skills'
  ];

  analyzeResume(text: string, jobDescription?: string): AtsAnalysisResult {
    const lowerText = text.toLowerCase();
    
    const analysis = {
      hasContactInfo: this.hasContactInfo(text),
      hasSummary: this.hasSection(lowerText, ['summary', 'objective', 'profile']),
      hasExperience: this.hasSection(lowerText, ['experience', 'work', 'employment']),
      hasEducation: this.hasSection(lowerText, ['education', 'academic', 'university']),
      hasSkills: this.hasSection(lowerText, ['skills', 'technical', 'technologies']),
      sectionCount: this.countSections(lowerText),
      wordCount: text.split(/\s+/).filter(word => word.length > 0).length,
      keywordMatches: this.findKeywords(lowerText),
      formattingIssues: this.checkFormattingIssues(text),
      actionVerbCount: this.countActionVerbs(lowerText),
      jobMatchAnalysis: jobDescription ? this.analyzeJobMatch(lowerText, jobDescription.toLowerCase()) : undefined
    };

    const breakdown = this.calculateScores(analysis);
    const score = Math.round(
      (breakdown.formatting + breakdown.keywords + breakdown.structure + breakdown.readability + breakdown.jobMatch) / 5
    );

    return { score, breakdown, analysis };
  }

  private hasContactInfo(text: string): boolean {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    return emailRegex.test(text) || phoneRegex.test(text);
  }

  private hasSection(text: string, keywords: string[]): boolean {
    return keywords.some(keyword => text.includes(keyword));
  }

  private countSections(text: string): number {
    return this.requiredSections.filter(section => text.includes(section)).length;
  }

  private findKeywords(text: string): string[] {
    return this.techKeywords.filter(keyword => text.includes(keyword));
  }

  private checkFormattingIssues(text: string): string[] {
    const issues: string[] = [];
    
    if (text.includes('\t')) {
      issues.push('Contains tabs (use spaces instead)');
    }
    
    const lines = text.split('\n');
    const consecutiveEmptyLines = lines.filter((line, index) => 
      line.trim() === '' && lines[index - 1]?.trim() === ''
    ).length;
    
    if (consecutiveEmptyLines > 2) {
      issues.push('Too many consecutive empty lines');
    }
    
    if (text.match(/[|]/)) {
      issues.push('Contains table formatting (avoid tables)');
    }
    
    return issues;
  }

  private countActionVerbs(text: string): number {
    return this.actionVerbs.filter(verb => text.includes(verb)).length;
  }

  private analyzeJobMatch(resumeText: string, jobDescription: string) {
    // Extract keywords from job description
    const jobKeywords = this.extractJobKeywords(jobDescription);
    const jobRequirements = this.extractJobRequirements(jobDescription);
    const jobSkills = this.extractJobSkills(jobDescription);

    // Find matches
    const skillMatches = jobSkills.filter(skill => resumeText.includes(skill));
    const experienceMatches = jobRequirements.filter(req => resumeText.includes(req));
    const qualificationMatches = jobKeywords.filter(keyword => resumeText.includes(keyword));

    // Find missing keywords
    const allJobKeywords = [...jobSkills, ...jobRequirements, ...jobKeywords];
    const missingKeywords = allJobKeywords.filter(keyword => !resumeText.includes(keyword));

    // Calculate match percentage
    const matchPercentage = allJobKeywords.length > 0 
      ? (skillMatches.length + experienceMatches.length + qualificationMatches.length) / allJobKeywords.length * 100
      : 0;

    return {
      skillMatches,
      experienceMatches,
      qualificationMatches,
      missingKeywords,
      matchPercentage: Math.round(matchPercentage)
    };
  }

  private extractJobKeywords(jobDescription: string): string[] {
    const keywords: string[] = [];
    
    // Education keywords
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'certification', 'diploma'];
    keywords.push(...educationKeywords.filter(keyword => jobDescription.includes(keyword)));
    
    // Experience level keywords
    const experienceKeywords = ['entry level', 'junior', 'mid-level', 'senior', 'lead', 'manager', 'director'];
    keywords.push(...experienceKeywords.filter(keyword => jobDescription.includes(keyword)));
    
    // Industry keywords
    const industryKeywords = ['healthcare', 'finance', 'technology', 'retail', 'manufacturing', 'consulting'];
    keywords.push(...industryKeywords.filter(keyword => jobDescription.includes(keyword)));
    
    return keywords;
  }

  private extractJobRequirements(jobDescription: string): string[] {
    const requirements: string[] = [];
    
    // Years of experience
    const yearMatches = jobDescription.match(/\d+\+?\s*years?/gi) || [];
    requirements.push(...yearMatches);
    
    // Common requirements
    const commonRequirements = [
      'team player', 'communication skills', 'problem solving', 'analytical skills',
      'leadership', 'project management', 'time management', 'attention to detail',
      'customer service', 'sales experience', 'budget management', 'strategic planning'
    ];
    requirements.push(...commonRequirements.filter(req => jobDescription.includes(req)));
    
    return requirements;
  }

  private extractJobSkills(jobDescription: string): string[] {
    const skills: string[] = [];
    
    // Extract technical keywords from job description
    const jobWords = jobDescription.split(/\s+/).filter(word => word.length > 2);
    
    // Find technical skills from our predefined list
    skills.push(...this.techKeywords.filter(skill => jobDescription.includes(skill)));
    
    // Extract potential skills from job description (capitalized words, technical terms)
    const potentialSkills = jobWords.filter(word => 
      /^[A-Z][a-z]+/.test(word) && 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'you', 'will', 'your', 'that', 'this', 'are', 'have'].includes(word.toLowerCase())
    );
    
    skills.push(...potentialSkills.slice(0, 10)); // Limit to avoid too many false positives
    
    return [...new Set(skills)]; // Remove duplicates
  }

  private calculateScores(analysis: AtsAnalysisResult['analysis']): AtsScoreBreakdown {
    // Formatting Score (0-100)
    const formattingDeductions = analysis.formattingIssues.length * 10;
    const formattingScore = Math.max(0, 100 - formattingDeductions);

    // Keywords Score (0-100)
    const keywordScore = Math.min(100, (analysis.keywordMatches.length / this.techKeywords.length) * 200);

    // Structure Score (0-100)
    const sectionScore = (analysis.sectionCount / this.requiredSections.length) * 100;
    const structureScore = analysis.hasContactInfo ? sectionScore : sectionScore * 0.8;

    // Readability Score (0-100)
    const wordScore = Math.min(100, (analysis.wordCount / 300) * 100);
    const actionVerbScore = Math.min(100, (analysis.actionVerbCount / 10) * 100);
    const readabilityScore = (wordScore + actionVerbScore) / 2;

    // Job Match Score (0-100)
    const jobMatchScore = analysis.jobMatchAnalysis ? analysis.jobMatchAnalysis.matchPercentage : 50;

    return {
      formatting: Math.round(formattingScore),
      keywords: Math.round(keywordScore),
      structure: Math.round(structureScore),
      readability: Math.round(readabilityScore),
      jobMatch: Math.round(jobMatchScore)
    };
  }
}
