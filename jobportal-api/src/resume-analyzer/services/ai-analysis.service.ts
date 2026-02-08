import { Injectable } from '@nestjs/common';
import { AtsAnalysisResult } from './ats-scorer.service';

export interface AiAnalysisResponse {
  atsScore: number;
  summary: string;
  scoreBreakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
  };
  strengths: string[];
  improvements: {
    structure: string[];
    content: string[];
    keywords: string[];
  };
}

@Injectable()
export class AiAnalysisService {
  async generateAnalysis(atsResult: AtsAnalysisResult): Promise<AiAnalysisResponse> {
    const prompt = this.buildPrompt(atsResult);
    
    // This is where you'd integrate with your AI provider (OpenAI, Claude, etc.)
    // For now, returning deterministic analysis based on ATS results
    return this.generateDeterministicAnalysis(atsResult);
  }

  private buildPrompt(atsResult: AtsAnalysisResult): string {
    return `
You are an expert resume analyst. Analyze this ATS evaluation and provide detailed feedback.

ATS Analysis Results:
- Overall Score: ${atsResult.score}/100
- Formatting: ${atsResult.breakdown.formatting}/100
- Keywords: ${atsResult.breakdown.keywords}/100  
- Structure: ${atsResult.breakdown.structure}/100
- Readability: ${atsResult.breakdown.readability}/100

Resume Details:
- Contact Info: ${atsResult.analysis.hasContactInfo ? 'Yes' : 'No'}
- Summary Section: ${atsResult.analysis.hasSummary ? 'Yes' : 'No'}
- Experience Section: ${atsResult.analysis.hasExperience ? 'Yes' : 'No'}
- Education Section: ${atsResult.analysis.hasEducation ? 'Yes' : 'No'}
- Skills Section: ${atsResult.analysis.hasSkills ? 'Yes' : 'No'}
- Word Count: ${atsResult.analysis.wordCount}
- Action Verbs: ${atsResult.analysis.actionVerbCount}
- Keywords Found: ${atsResult.analysis.keywordMatches.join(', ')}
- Formatting Issues: ${atsResult.analysis.formattingIssues.join(', ')}

Provide a JSON response with this exact structure:
{
  "atsScore": number,
  "summary": "string",
  "scoreBreakdown": {
    "formatting": number,
    "keywords": number,
    "structure": number,
    "readability": number
  },
  "strengths": ["string"],
  "improvements": {
    "structure": ["string"],
    "content": ["string"],
    "keywords": ["string"]
  }
}

Be specific, actionable, and encouraging. Focus on practical improvements.
    `.trim();
  }

  private generateDeterministicAnalysis(atsResult: AtsAnalysisResult): AiAnalysisResponse {
    const strengths: string[] = [];
    const improvements = {
      structure: [] as string[],
      content: [] as string[],
      keywords: [] as string[]
    };

    // Generate strengths
    if (atsResult.analysis.hasContactInfo) {
      strengths.push('Clear contact information is easily accessible to recruiters');
    }
    if (atsResult.analysis.hasSummary) {
      strengths.push('Professional summary provides quick overview of qualifications');
    }
    if (atsResult.analysis.actionVerbCount > 5) {
      strengths.push('Strong use of action verbs demonstrates impact and achievements');
    }
    if (atsResult.analysis.keywordMatches.length > 5) {
      strengths.push(`Good keyword optimization with ${atsResult.analysis.keywordMatches.length} relevant technical terms`);
    }
    if (atsResult.breakdown.formatting > 80) {
      strengths.push('Clean formatting ensures ATS compatibility');
    }

    // Generate improvements
    if (!atsResult.analysis.hasSummary) {
      improvements.structure.push('Add a professional summary section at the top');
    }
    if (!atsResult.analysis.hasExperience) {
      improvements.structure.push('Include detailed work experience section');
    }
    if (!atsResult.analysis.hasEducation) {
      improvements.structure.push('Add education section with degrees and certifications');
    }
    if (!atsResult.analysis.hasSkills) {
      improvements.structure.push('Create a dedicated technical skills section');
    }

    if (atsResult.analysis.wordCount < 200) {
      improvements.content.push('Expand content to provide more detail about experience and achievements');
    }
    if (atsResult.analysis.actionVerbCount < 5) {
      improvements.content.push('Use more action verbs to describe achievements and responsibilities');
    }

    const missingKeywords = this.techKeywords.filter(keyword => 
      !atsResult.analysis.keywordMatches.includes(keyword)
    ).slice(0, 5);
    
    if (missingKeywords.length > 0) {
      improvements.keywords.push(`Consider adding relevant keywords: ${missingKeywords.join(', ')}`);
    }

    if (atsResult.analysis.formattingIssues.length > 0) {
      improvements.content.push(...atsResult.analysis.formattingIssues);
    }

    // Generate summary
    const summary = this.generateSummary(atsResult, strengths.length);

    return {
      atsScore: atsResult.score,
      summary,
      scoreBreakdown: atsResult.breakdown,
      strengths,
      improvements
    };
  }

  private generateSummary(atsResult: AtsAnalysisResult, strengthCount: number): string {
    if (atsResult.score >= 80) {
      return `Your resume demonstrates strong ATS compatibility with a score of ${atsResult.score}/100. The document is well-structured and optimized for automated screening systems, with clear sections and relevant technical keywords. You have ${strengthCount} key strengths that make your profile stand out to recruiters.`;
    } else if (atsResult.score >= 60) {
      return `Your resume shows moderate ATS compatibility at ${atsResult.score}/100. While you have some solid elements like ${strengthCount} identified strengths, there are specific improvements needed to enhance automated screening performance. Focus on structure and keyword optimization to increase visibility.`;
    } else {
      return `Your resume needs significant improvements for ATS compatibility with a score of ${atsResult.score}/100. The current format may struggle with automated screening systems. However, you have ${strengthCount} positive elements to build upon. Address the structural and content recommendations to dramatically improve your resume's effectiveness.`;
    }
  }

  private readonly techKeywords = [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'node.js', 'express', 'nest.js',
    'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
    'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'aws', 'azure', 'gcp', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
    'html', 'css', 'tailwind', 'bootstrap', 'sass', 'webpack', 'babel'
  ];
}
