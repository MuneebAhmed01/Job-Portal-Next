import { Injectable } from '@nestjs/common';

export interface AtsScoreBreakdown {
  formatting: number;
  keywords: number;
  structure: number;
  readability: number;
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

  analyzeResume(text: string): AtsAnalysisResult {
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
      actionVerbCount: this.countActionVerbs(lowerText)
    };

    const breakdown = this.calculateScores(analysis);
    const score = Math.round(
      (breakdown.formatting + breakdown.keywords + breakdown.structure + breakdown.readability) / 4
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

    return {
      formatting: Math.round(formattingScore),
      keywords: Math.round(keywordScore),
      structure: Math.round(structureScore),
      readability: Math.round(readabilityScore)
    };
  }
}
