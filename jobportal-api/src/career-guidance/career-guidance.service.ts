import { Injectable, Logger } from '@nestjs/common';
import {
  CareerAnalysis,
  CareerPath,
  CategoryScore,
  DebugTrace,
  SkillDefinition,
  SkillImportance,
  ScoringConfig,
} from './career-guidance.types';
import {
  careerCategories,
  careerPaths,
  combinationRoles,
  skillReasons,
  learningApproaches,
  careerTitleMap,
  defaultLearningApproach,
  scoringConfig,
} from './career-guidance.data';

// ─── Pure Functions (no side effects, easily testable) ─────────────────

/**
 * Normalize an input skill string for matching.
 * Lowercase, trim, collapse whitespace.
 */
export function normalizeSkill(raw: string): string {
  return raw.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Strict alias matching — NO partial substring matching.
 * Only exact alias match or Levenshtein distance ≤ 1 for aliases > 5 chars.
 */
export function matchesAlias(input: string, aliases: string[]): boolean {
  const normalized = normalizeSkill(input);

  for (const alias of aliases) {
    // Exact match
    if (normalized === alias) return true;

    // Normalized variant (strip dots, hyphens, spaces)
    const inputClean = normalized.replace(/[\s\-\.]/g, '');
    const aliasClean = alias.replace(/[\s\-\.]/g, '');
    if (inputClean === aliasClean) return true;

    // Levenshtein distance ≤ 1 only for aliases longer than 5 chars
    // (prevents "css" matching "scss", "c" matching "c#", etc.)
    if (alias.length > 5 && levenshteinDistance(normalized, alias) <= 1) {
      return true;
    }
  }

  return false;
}

/**
 * Standard Levenshtein distance.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Compute normalized score (0–100) for a category given matched importance tiers.
 */
export function computeNormalizedScore(
  coreMatched: number,
  coreTotal: number,
  supportingMatched: number,
  supportingTotal: number,
  adjacentMatched: number,
  adjacentTotal: number,
  config: ScoringConfig,
): number {
  const coreScore = coreTotal > 0
    ? (coreMatched / Math.min(coreTotal, 4)) * config.coreWeight
    : 0;
  const supportingScore = supportingTotal > 0
    ? (supportingMatched / Math.min(supportingTotal, 3)) * config.supportingWeight
    : 0;
  const adjacentScore = adjacentTotal > 0
    ? (adjacentMatched / adjacentTotal) * config.adjacentWeight
    : 0;

  // Cap at max weight (in case matched > cap)
  const finalCore = Math.min(coreScore, config.coreWeight);
  const finalSupporting = Math.min(supportingScore, config.supportingWeight);

  return Math.round((finalCore + finalSupporting + adjacentScore) * 10) / 10;
}

// ─── Service ───────────────────────────────────────────────────────────

@Injectable()
export class CareerGuidanceService {
  private readonly logger = new Logger(CareerGuidanceService.name);

  analyzeSkills(skills: string[]): CareerAnalysis {
    const normalizedSkills = skills.map(normalizeSkill);

    this.logger.log(`Analyzing skills: [${normalizedSkills.join(', ')}]`);

    // Expand implied skills (e.g. React implies JavaScript)
    const expandedSkills = this.expandImpliedSkills(normalizedSkills);
    if (expandedSkills.length > normalizedSkills.length) {
      this.logger.log(`Expanded implied skills: [${expandedSkills.join(', ')}]`);
    }

    // Step 1: Score each category
    const categoryScores = this.scoreAllCategories(expandedSkills);

    // Step 2: Sort by normalized score descending
    const sorted = [...categoryScores]
      .filter(s => s.normalizedScore > 0)
      .sort((a, b) => b.normalizedScore - a.normalizedScore);

    // Step 3: Detect combination role or primary category
    const { primaryCategory, decisionReason, combinationRatio } =
      this.decidePrimaryCategory(sorted);

    this.logger.log(`Decision: ${primaryCategory} — ${decisionReason}`);

    // Step 4: Build response
    const recommendedPaths = this.getCareerPaths(primaryCategory, sorted);
    const skillsToEnhance = this.getSkillsToEnhance(sorted, normalizedSkills);
    const learningApproach = this.getLearningApproach(primaryCategory);

    const debugTrace: DebugTrace = {
      inputSkills: skills,
      normalizedInputSkills: normalizedSkills,
      categoryScores: sorted,
      decisionReason,
      combinationRatio,
    };

    return {
      careerSummary: this.generateCareerSummary(primaryCategory, sorted),
      primaryCareerTitle: this.getPrimaryCareerTitle(primaryCategory),
      careerCategory: primaryCategory,
      skillBreakdown: this.buildSkillBreakdown(sorted),
      recommendedCareerPaths: recommendedPaths,
      skillsToEnhance,
      learningApproach,
      debugTrace,
    };
  }

  // ─── Implied Skills Logic ─────────────────────────────────────────────

  private expandImpliedSkills(skills: string[]): string[] {
    const implied = new Set<string>(skills);
    const skillSet = new Set(skills); // For O(1) lookups

    const rules = [
      {
        triggers: ['react', 'reactjs', 'react.js', 'vue', 'vuejs', 'vue.js', 'angular', 'angularjs', 'svelte', 'next.js', 'nextjs'],
        targets: ['javascript', 'html', 'css']
      },
      {
        triggers: ['typescript', 'ts'],
        targets: ['javascript']
      },
      {
        triggers: ['node', 'nodejs', 'node.js', 'express', 'expressjs', 'express.js', 'nest', 'nestjs', 'nest.js'],
        targets: ['javascript']
      },
      {
        triggers: ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'pytorch', 'tensorflow'],
        targets: ['python']
      },
      {
        triggers: ['spring', 'spring boot', 'springboot', 'hibernate', 'android'],
        targets: ['java']
      },
      {
        triggers: ['dotnet', '.net', 'unity'],
        targets: ['c#', 'csharp']
      },
      {
        triggers: ['laravel', 'symfony'],
        targets: ['php']
      },
      {
        triggers: ['flutter'],
        targets: ['dart']
      },
      {
        triggers: ['go', 'golang'],
        targets: ['go'] // redundant but consistency
      }
    ];

    for (const rule of rules) {
      // Check if any trigger exists in the input skills
      const match = rule.triggers.some(t => skillSet.has(t));
      if (match) {
        rule.targets.forEach(t => implied.add(t));
      }
    }

    return Array.from(implied);
  }

  // ─── Scoring ──────────────────────────────────────────────────────────

  private scoreAllCategories(normalizedSkills: string[]): CategoryScore[] {
    return careerCategories.map(category => {
      const matched: string[] = [];
      let coreMatched = 0;
      let coreTotal = 0;
      let supportingMatched = 0;
      let supportingTotal = 0;
      let adjacentMatched = 0;
      let adjacentTotal = 0;

      for (const skill of category.skills) {
        // Count totals by importance
        switch (skill.importance) {
          case 'core': coreTotal++; break;
          case 'supporting': supportingTotal++; break;
          case 'adjacent': adjacentTotal++; break;
        }

        // Check if user has this skill
        const hasMatch = normalizedSkills.some(input => matchesAlias(input, skill.aliases));
        if (hasMatch) {
          matched.push(skill.canonical);
          switch (skill.importance) {
            case 'core': coreMatched++; break;
            case 'supporting': supportingMatched++; break;
            case 'adjacent': adjacentMatched++; break;
          }
        }
      }

      const normalizedScore = computeNormalizedScore(
        coreMatched, coreTotal,
        supportingMatched, supportingTotal,
        adjacentMatched, adjacentTotal,
        scoringConfig,
      );

      return {
        category: category.name,
        matchedSkills: matched,
        coreMatched,
        coreTotal,
        supportingMatched,
        supportingTotal,
        adjacentMatched,
        adjacentTotal,
        normalizedScore,
      };
    });
  }

  // ─── Decision Engine ──────────────────────────────────────────────────

  private decidePrimaryCategory(sorted: CategoryScore[]): {
    primaryCategory: string;
    decisionReason: string;
    combinationRatio: number | null;
  } {
    if (sorted.length === 0) {
      return {
        primaryCategory: 'General',
        decisionReason: 'No matching categories found.',
        combinationRatio: null,
      };
    }

    const top = sorted[0];

    if (top.normalizedScore < scoringConfig.minimumPrimaryThreshold) {
      return {
        primaryCategory: top.category,
        decisionReason: `Top category "${top.category}" scored ${top.normalizedScore}, below primary threshold (${scoringConfig.minimumPrimaryThreshold}). Treating as exploratory.`,
        combinationRatio: null,
      };
    }



    // Check combination roles if we have at least 2 categories
    if (sorted.length >= 2) {
      const second = sorted[1];
      const ratio = second.normalizedScore / top.normalizedScore;

      if (
        second.normalizedScore >= scoringConfig.minimumSecondaryThreshold &&
        ratio >= scoringConfig.combinationRatioThreshold
      ) {
        // Look for a matching combination role
        const topTwo = [top.category, second.category];
        for (const combo of combinationRoles) {
          const hasAll = combo.categories.every(cat => topTwo.includes(cat));
          if (hasAll) {
            return {
              primaryCategory: combo.result,
              decisionReason: `Combination role detected: "${top.category}" (${top.normalizedScore}) + "${second.category}" (${second.normalizedScore}), ratio=${ratio.toFixed(2)} ≥ ${scoringConfig.combinationRatioThreshold}.`,
              combinationRatio: Math.round(ratio * 100) / 100,
            };
          }
        }

        // No predefined combination — still note the strong secondary
        return {
          primaryCategory: top.category,
          decisionReason: `Primary: "${top.category}" (${top.normalizedScore}). Secondary "${second.category}" (${second.normalizedScore}) is strong (ratio=${ratio.toFixed(2)}) but no predefined combination role exists.`,
          combinationRatio: Math.round(ratio * 100) / 100,
        };
      }

      return {
        primaryCategory: top.category,
        decisionReason: `Primary: "${top.category}" (${top.normalizedScore}). Second "${second.category}" (${second.normalizedScore}) too weak for combination (ratio=${ratio.toFixed(2)} < ${scoringConfig.combinationRatioThreshold}).`,
        combinationRatio: Math.round(ratio * 100) / 100,
      };
    }

    return {
      primaryCategory: top.category,
      decisionReason: `Only one matching category: "${top.category}" (${top.normalizedScore}).`,
      combinationRatio: null,
    };
  }

  // ─── Career Paths ─────────────────────────────────────────────────────

  private getCareerPaths(primaryCategory: string, sorted: CategoryScore[]): CareerPath[] {
    const paths: CareerPath[] = [];
    const addedTitles = new Set<string>();

    // First: paths from primary category
    const primaryPaths = careerPaths[primaryCategory];
    if (primaryPaths) {
      for (const path of primaryPaths.slice(0, 3)) {
        if (!addedTitles.has(path.title)) {
          const topScore = sorted[0]?.normalizedScore ?? 0;
          const adjustedMatch = Math.min(98, Math.round(path.baseMatchScore * (topScore / 60)));
          paths.push({
            title: path.title,
            description: path.description,
            keyResponsibilities: path.keyResponsibilities,
            whyItFits: path.whyItFits,
            relevantJobTitles: path.relevantJobTitles,
            matchScore: adjustedMatch,
            category: path.category,
          });
          addedTitles.add(path.title);
        }
      }
    }

    // Then: paths from top scored categories
    for (const score of sorted.slice(0, 2)) {
      const categoryPaths = careerPaths[score.category];
      if (!categoryPaths) continue;

      for (const path of categoryPaths.slice(0, 2)) {
        if (!addedTitles.has(path.title)) {
          const adjustedMatch = Math.min(98, Math.round(path.baseMatchScore * (score.normalizedScore / 60)));
          paths.push({
            title: path.title,
            description: path.description,
            keyResponsibilities: path.keyResponsibilities,
            whyItFits: path.whyItFits,
            relevantJobTitles: path.relevantJobTitles,
            matchScore: adjustedMatch,
            category: path.category,
          });
          addedTitles.add(path.title);
        }
      }
    }

    return paths.slice(0, 3);
  }

  // ─── Skills to Enhance ────────────────────────────────────────────────

  private getSkillsToEnhance(
    sorted: CategoryScore[],
    userSkills: string[],
  ): CareerAnalysis['skillsToEnhance'] {
    const result: CareerAnalysis['skillsToEnhance'] = [];
    const userSkillSet = new Set(userSkills);

    for (const score of sorted.slice(0, 2)) {
      const category = careerCategories.find(c => c.name === score.category);
      if (!category) continue;

      const missingSkills: CareerAnalysis['skillsToEnhance'][0]['skills'] = [];

      for (const skill of category.skills) {
        const hasSkill = Array.from(userSkillSet).some(us =>
          matchesAlias(us, skill.aliases),
        );

        if (!hasSkill) {
          const priority: 'high' | 'medium' | 'low' =
            skill.importance === 'core' ? 'high' :
              skill.importance === 'supporting' ? 'medium' : 'low';

          missingSkills.push({
            name: skill.canonical,
            priority,
            reason: this.getSkillReason(skill.canonical, score.category),
          });
        }
      }

      if (missingSkills.length > 0) {
        result.push({
          category: score.category,
          skills: missingSkills.slice(0, 6),
        });
      }
    }

    return result;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────

  private getSkillReason(skillName: string, category: string): string {
    const reasons = skillReasons[category];
    return reasons?.[skillName] || `Important for ${category} roles`;
  }

  private getLearningApproach(primaryCategory: string): CareerAnalysis['learningApproach'] {
    return learningApproaches[primaryCategory] || defaultLearningApproach;
  }

  private buildSkillBreakdown(sorted: CategoryScore[]): CareerAnalysis['skillBreakdown'] {
    const totalScore = sorted.reduce((sum, s) => sum + s.normalizedScore, 0);

    return sorted.map(s => ({
      category: s.category,
      matchedSkills: s.matchedSkills,
      normalizedScore: s.normalizedScore,
      percentage: totalScore > 0
        ? Math.round((s.normalizedScore / totalScore) * 100)
        : 0,
    }));
  }

  private generateCareerSummary(primaryCategory: string, sorted: CategoryScore[]): string {
    if (sorted.length === 0) {
      return "You're at the beginning of your tech journey. Consider exploring foundational skills in areas like web development, design, or data science to find your passion.";
    }

    const top = sorted[0];
    const totalMatched = sorted.reduce((sum, s) => sum + s.matchedSkills.length, 0);
    const isCombination = combinationRoles.some(c => c.result === primaryCategory);

    if (isCombination) {
      const categories = sorted.slice(0, 2).map(s => s.category).join(' and ');
      return `You have a unique hybrid skill set combining ${categories}. With ${totalMatched} relevant skills, you're well-positioned for interdisciplinary roles like ${primaryCategory} that bridge multiple domains.`;
    }

    if (sorted.length > 1 && sorted[1].normalizedScore > top.normalizedScore * 0.5) {
      return `Your primary strength is in ${primaryCategory} with ${top.matchedSkills.length} key skills, but you also show strong capabilities in ${sorted[1].category}. This versatility gives you an edge for collaborative, cross-functional roles.`;
    }

    return `Your profile shows strong specialization in ${primaryCategory} with ${top.matchedSkills.length} matched skills. Your expertise in ${top.matchedSkills.slice(0, 3).join(', ')} provides a solid foundation for growth in this domain.`;
  }

  private getPrimaryCareerTitle(primaryCategory: string): string {
    return careerTitleMap[primaryCategory] || 'Software Developer';
  }
}
