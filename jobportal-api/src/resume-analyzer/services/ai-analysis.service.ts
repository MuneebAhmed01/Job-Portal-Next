import { Injectable, Logger } from '@nestjs/common';
import { AtsAnalysisResult, AtsPenalty } from './ats-scorer.service';

// ─── Response Interfaces ───────────────────────────────────────────────

export interface AiAnalysisResponse {
  summary: string;
  strengths: string[];
  improvements: string[];
  improvementPriority: {
    action: string;
    impact: string;
    estimatedScoreGain: number;
  }[];
  scoreBreakdown: {
    category: string;
    score: number;
    weight: string;
    details: string;
  }[];
  penalties: AtsPenalty[];
}

// ─── Service ───────────────────────────────────────────────────────────

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);

  generateAnalysis(atsResult: AtsAnalysisResult): AiAnalysisResponse {
    this.logger.log(`Generating analysis for ATS score: ${atsResult.score}`);

    const strengths = this.identifyStrengths(atsResult);
    const improvements = this.identifyImprovements(atsResult);
    const improvementPriority = this.prioritizeImprovements(atsResult);
    const summary = this.generateSummary(atsResult);
    const scoreBreakdown = this.buildScoreBreakdown(atsResult);

    return {
      summary,
      strengths,
      improvements,
      improvementPriority,
      scoreBreakdown,
      penalties: atsResult.penalties,
    };
  }

  // ─── Strengths ────────────────────────────────────────────────────────

  private identifyStrengths(result: AtsAnalysisResult): string[] {
    const strengths: string[] = [];
    const { analysis, breakdown } = result;

    if (analysis.hasContactInfo) {
      strengths.push('Contact information is present and accessible');
    }
    if (breakdown.structure >= 80) {
      strengths.push('Well-organized with clear section headers');
    } else if (breakdown.structure >= 60) {
      strengths.push('Decent structure with most key sections present');
    }
    if (analysis.actionVerbCount >= 10) {
      strengths.push(`Strong use of action verbs (${analysis.actionVerbCount} found) — shows measurable impact`);
    } else if (analysis.actionVerbCount >= 5) {
      strengths.push(`Good use of action verbs (${analysis.actionVerbCount} found)`);
    }
    if (analysis.hasMeasurableAchievements) {
      strengths.push('Includes quantified achievements — demonstrates real impact');
    }
    if (breakdown.keywords >= 60) {
      strengths.push(`Good keyword coverage (${analysis.keywordMatches.length} tech keywords matched)`);
    }
    if (analysis.wordCount >= 300 && analysis.wordCount <= 800) {
      strengths.push('Resume length is appropriate for a single-page resume');
    }
    if (breakdown.formatting >= 80) {
      strengths.push('Clean formatting — ATS-friendly structure');
    }
    if (analysis.jobMatchAnalysis && analysis.jobMatchAnalysis.matchPercentage >= 70) {
      strengths.push(`Strong job match (${analysis.jobMatchAnalysis.matchPercentage}%) — resume aligns well with the job description`);
    }

    return strengths.length > 0
      ? strengths
      : ['Resume has been submitted for review — consider enhancing with specific skills and achievements'];
  }

  // ─── Improvements ────────────────────────────────────────────────────

  private identifyImprovements(result: AtsAnalysisResult): string[] {
    const improvements: string[] = [];
    const { analysis, breakdown } = result;

    // Structure improvements
    if (!analysis.hasExperience) {
      improvements.push('Add a clear "Experience" or "Work Experience" section header');
    }
    if (!analysis.hasSkills) {
      improvements.push('Add a "Skills" or "Technical Skills" section listing your key technologies');
    }
    if (!analysis.hasSummary) {
      improvements.push('Add a brief professional summary at the top of your resume');
    }
    if (!analysis.hasEducation) {
      improvements.push('Include an Education section with your degree and institution');
    }

    // Content improvements
    if (!analysis.hasMeasurableAchievements) {
      improvements.push('Add measurable achievements (e.g., "Improved page load time by 40%", "Led a team of 8")');
    }
    if (analysis.actionVerbCount < 5) {
      improvements.push('Start experience descriptions with strong action verbs (developed, implemented, optimized)');
    }
    if (analysis.wordCount < 200) {
      improvements.push('Resume is too short — expand experience descriptions with specific accomplishments');
    }
    if (analysis.wordCount > 900) {
      improvements.push('Resume may be too long — focus on most relevant and recent experience');
    }

    // Keywords
    if (breakdown.keywords < 40) {
      improvements.push('Include more industry-relevant technical keywords in your skills and experience sections');
    }

    // Formatting
    if (breakdown.formatting < 60) {
      improvements.push(`Fix formatting issues: ${analysis.formattingIssues.join('; ')}`);
    }

    // Job match
    if (analysis.jobMatchAnalysis) {
      const { missingKeywords, matchPercentage } = analysis.jobMatchAnalysis;
      if (matchPercentage < 50 && missingKeywords.length > 0) {
        const top5 = missingKeywords.slice(0, 5).join(', ');
        improvements.push(`Your resume is missing key terms from the job description: ${top5}`);
      }
    }

    return improvements;
  }

  // ─── Improvement Priority ─────────────────────────────────────────────

  private prioritizeImprovements(result: AtsAnalysisResult): AiAnalysisResponse['improvementPriority'] {
    const priorities: AiAnalysisResponse['improvementPriority'] = [];
    const { analysis, breakdown, penalties } = result;

    // Map penalties to actionable improvements with estimated score gains
    for (const penalty of penalties) {
      let action = '';
      let impact = '';

      switch (penalty.reason) {
        case 'Missing Skills section':
          action = 'Add a "Skills" section listing your technical competencies';
          impact = 'ATS systems scan for a dedicated skills section — this is critical';
          break;
        case 'Missing Experience section':
          action = 'Add a clear "Work Experience" section with your roles';
          impact = 'Most weight in ATS scoring comes from professional experience';
          break;
        case 'Missing contact information':
          action = 'Add email, phone number, or LinkedIn URL';
          impact = 'Recruiters need contact information to reach you';
          break;
        case 'No measurable achievements (numbers, percentages, metrics)':
          action = 'Quantify at least 3-5 achievements with numbers or percentages';
          impact = 'Quantified results make your experience more credible and impactful';
          break;
        case 'Resume content too short (< 150 words)':
          action = 'Expand your resume to at least 300+ words with detailed experience';
          impact = 'Short resumes lack the detail ATS systems need to evaluate';
          break;
        case 'Too few action verbs':
          action = 'Rewrite experience bullets starting with verbs like "Developed", "Optimized", "Led"';
          impact = 'Action verbs signal initiative and direct contribution';
          break;
        default:
          action = `Address: ${penalty.reason}`;
          impact = 'Will improve overall score';
      }

      priorities.push({
        action,
        impact,
        estimatedScoreGain: penalty.points,
      });
    }

    // Add non-penalty improvements
    if (breakdown.keywords < 40 && !penalties.some(p => p.reason.includes('Skills'))) {
      priorities.push({
        action: 'Add more relevant technical keywords to your skills section',
        impact: 'Keywords account for 35% of your ATS score',
        estimatedScoreGain: 10,
      });
    }

    // Sort by estimated score gain (highest first)
    priorities.sort((a, b) => b.estimatedScoreGain - a.estimatedScoreGain);

    return priorities.slice(0, 5);
  }

  // ─── Summary ──────────────────────────────────────────────────────────

  private generateSummary(result: AtsAnalysisResult): string {
    const { score, analysis, penalties } = result;

    if (score >= 80) {
      return `Excellent ATS compatibility (${score}/100). Your resume is well-structured with strong keyword coverage and clear formatting. It should pass most ATS filters and reach human reviewers successfully.`;
    }
    if (score >= 60) {
      const topIssue = penalties.length > 0
        ? ` The main area to address: ${penalties[0].reason.toLowerCase()}.`
        : '';
      return `Good ATS compatibility (${score}/100). Your resume covers the basics but has room for improvement.${topIssue} With targeted adjustments, you can significantly improve your chances of passing ATS filters.`;
    }
    if (score >= 40) {
      return `Moderate ATS compatibility (${score}/100). Your resume has ${penalties.length} issues that are reducing your score. Focus on the improvement priorities below to strengthen your resume's performance with automated screening systems.`;
    }

    return `Low ATS compatibility (${score}/100). Your resume needs significant improvements to pass most ATS filters. Focus on adding required sections (Experience, Skills), including measurable achievements, and matching keywords from your target job descriptions. Review the improvement priorities below for specific actions.`;
  }

  // ─── Score Breakdown ──────────────────────────────────────────────────

  private buildScoreBreakdown(result: AtsAnalysisResult): AiAnalysisResponse['scoreBreakdown'] {
    const { breakdown } = result;

    return [
      {
        category: 'Skills Match',
        score: breakdown.keywords,
        weight: '35%',
        details: breakdown.keywords >= 60
          ? 'Good technical keyword coverage'
          : 'Need more relevant technical keywords',
      },
      {
        category: 'Experience Relevance',
        score: breakdown.readability,
        weight: '25%',
        details: breakdown.readability >= 60
          ? 'Strong experience descriptions with action verbs'
          : 'Add action verbs and quantified achievements',
      },
      {
        category: 'Structure',
        score: breakdown.structure,
        weight: '20%',
        details: breakdown.structure >= 80
          ? 'Well-organized with clear sections'
          : 'Missing key sections — add Experience, Skills, Education',
      },
      {
        category: 'Formatting',
        score: breakdown.formatting,
        weight: '10%',
        details: breakdown.formatting >= 80
          ? 'Clean, ATS-friendly formatting'
          : 'Fix formatting issues for better ATS parsing',
      },
      {
        category: 'Job Match',
        score: breakdown.jobMatch,
        weight: '10%',
        details: breakdown.jobMatch >= 60
          ? 'Good alignment with target job'
          : 'Tailor resume keywords to match the job description',
      },
    ];
  }
}
