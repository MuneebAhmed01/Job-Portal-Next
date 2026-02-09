import { Injectable } from '@nestjs/common';
import { 
  CareerAnalysis, 
  CareerCategory,
  CareerPath 
} from './career-guidance.types';
import {
  careerCategories,
  careerPaths,
  combinationRoles,
  skillReasons,
  learningApproaches,
  careerTitleMap,
  defaultLearningApproach,
} from './career-guidance.data';

interface WeightedScore {
  category: string;
  totalWeight: number;
  skillCount: number;
  matchedSkills: string[];
  categoryMultiplier: number;
}

@Injectable()
export class CareerGuidanceService {
  analyzeSkills(skills: string[]): CareerAnalysis {
    const normalizedSkills = skills.map(s => s.toLowerCase().trim());
    
    const categoryMatches = this.matchSkillsToCategories(normalizedSkills);
    const weightedScores = this.calculateWeightedScores(categoryMatches);
    
    const primaryCategory = weightedScores.length > 0 ? weightedScores[0].category : 'General';
    
    const careerPaths = this.getCareerPaths(weightedScores);
    const skillsToEnhance = this.getSkillsToEnhance(weightedScores, normalizedSkills);
    const learningApproach = this.getLearningApproach(primaryCategory);
    
    return {
      careerSummary: this.generateCareerSummary(primaryCategory, weightedScores),
      primaryCareerTitle: this.getPrimaryCareerTitle(primaryCategory),
      careerCategory: primaryCategory,
      skillBreakdown: this.buildSkillBreakdown(weightedScores),
      recommendedCareerPaths: careerPaths,
      skillsToEnhance,
      learningApproach
    };
  }

  private matchSkillsToCategories(
    skills: string[]
  ): Map<string, Array<{ canonical: string; weight: number; matched: string }>> {
    const matches = new Map<string, Array<{ canonical: string; weight: number; matched: string }>>();
    
    for (const category of careerCategories) {
      const categoryMatches: Array<{ canonical: string; weight: number; matched: string }> = [];
      
      for (const skillMapping of category.skills) {
        for (const inputSkill of skills) {
          if (this.isFuzzyMatch(inputSkill, skillMapping.aliases)) {
            categoryMatches.push({
              canonical: skillMapping.canonical,
              weight: skillMapping.weight,
              matched: inputSkill
            });
            break;
          }
        }
      }
      
      if (categoryMatches.length > 0) {
        matches.set(category.name, categoryMatches);
      }
    }
    
    return matches;
  }

  private isFuzzyMatch(input: string, aliases: string[]): boolean {
    if (aliases.includes(input)) return true;
    
    for (const alias of aliases) {
      if (input === alias || alias.includes(input) || input.includes(alias)) {
        return true;
      }
      
      if (alias.length > 5 && this.levenshteinDistance(input, alias) <= 2) {
        return true;
      }
      
      const inputNoSpace = input.replace(/[\s\-\.]/g, '');
      const aliasNoSpace = alias.replace(/[\s\-\.]/g, '');
      if (inputNoSpace === aliasNoSpace) return true;
    }
    
    return false;
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }

  private calculateWeightedScores(
    matches: Map<string, Array<{ canonical: string; weight: number; matched: string }>>
  ): WeightedScore[] {
    const scores: WeightedScore[] = [];
    
    for (const [categoryName, matchedSkills] of matches.entries()) {
      const category = careerCategories.find(c => c.name === categoryName);
      if (!category) continue;
      
      const uniqueSkills = new Set<string>();
      let totalWeight = 0;
      
      for (const match of matchedSkills) {
        if (!uniqueSkills.has(match.canonical)) {
          uniqueSkills.add(match.canonical);
          totalWeight += match.weight;
        }
      }
      
      const weightedScore = totalWeight * category.weightMultiplier;
      
      scores.push({
        category: categoryName,
        totalWeight: weightedScore,
        skillCount: uniqueSkills.size,
        matchedSkills: Array.from(uniqueSkills),
        categoryMultiplier: category.weightMultiplier
      });
    }
    
    return scores.sort((a, b) => b.totalWeight - a.totalWeight);
  }

  private getCareerPaths(weightedScores: WeightedScore[]): CareerPath[] {
    const paths: CareerPath[] = [];
    const addedTitles = new Set<string>();
    
    for (const score of weightedScores.slice(0, 3)) {
      const categoryPaths = careerPaths[score.category];
      if (categoryPaths) {
        for (const path of categoryPaths.slice(0, 2)) {
          if (!addedTitles.has(path.title)) {
            paths.push({
              ...path,
              matchScore: Math.min(98, Math.round(path.matchScore * (score.totalWeight / 50)))
            });
            addedTitles.add(path.title);
          }
        }
      }
    }
    
    return paths.slice(0, 3);
  }

  private getSkillsToEnhance(
    weightedScores: WeightedScore[],
    userSkills: string[]
  ): CareerAnalysis['skillsToEnhance'] {
    const skillsToEnhance: CareerAnalysis['skillsToEnhance'] = [];
    const userSkillSet = new Set(userSkills);
    
    for (const score of weightedScores.slice(0, 2)) {
      const category = careerCategories.find(c => c.name === score.category);
      if (!category) continue;
      
      const missingSkills: CareerAnalysis['skillsToEnhance'][0]['skills'] = [];
      
      for (const skill of category.skills) {
        const hasSkill = skill.aliases.some(alias => 
          userSkillSet.has(alias) || 
          Array.from(userSkillSet).some(us => this.isFuzzyMatch(us, [alias]))
        );
        
        if (!hasSkill) {
          const priority: 'high' | 'medium' | 'low' = 
            skill.weight >= 11 ? 'high' : skill.weight >= 8 ? 'medium' : 'low';
          
          missingSkills.push({
            name: skill.canonical,
            priority,
            reason: this.getSkillReason(skill.canonical, score.category)
          });
        }
      }
      
      if (missingSkills.length > 0) {
        skillsToEnhance.push({
          category: score.category,
          skills: missingSkills.slice(0, 6)
        });
      }
    }
    
    return skillsToEnhance;
  }

  private getSkillReason(skillName: string, category: string): string {
    const reasons = skillReasons[category];
    return reasons?.[skillName] || `Important for ${category} roles`;
  }

  private getLearningApproach(primaryCategory: string): CareerAnalysis['learningApproach'] {
    return learningApproaches[primaryCategory] || defaultLearningApproach;
  }

  private buildSkillBreakdown(scores: WeightedScore[]): CareerAnalysis['skillBreakdown'] {
    const totalWeight = scores.reduce((sum, s) => sum + s.totalWeight, 0);
    
    return scores.map(s => ({
      category: s.category,
      matchedSkills: s.matchedSkills,
      weight: Math.round(s.totalWeight * 10) / 10,
      percentage: totalWeight > 0 ? Math.round((s.totalWeight / totalWeight) * 100) : 0
    }));
  }

  private generateCareerSummary(primaryCategory: string, scores: WeightedScore[]): string {
    if (scores.length === 0) {
      return "You're at the beginning of your tech journey. Consider exploring foundational skills in areas like web development, design, or data science to find your passion.";
    }
    
    const topCategory = scores[0];
    const skillCount = topCategory.skillCount;
    const totalMatched = scores.reduce((sum, s) => sum + s.skillCount, 0);
    
    const isCombination = combinationRoles.some(c => c.result === primaryCategory);
    
    if (isCombination) {
      const categories = scores.slice(0, 2).map(s => s.category).join(' and ');
      return `You have a unique hybrid skill set combining ${categories}. With ${totalMatched} relevant skills, you're well-positioned for interdisciplinary roles like ${primaryCategory} that bridge multiple domains.`;
    }
    
    if (scores.length > 1 && scores[1].totalWeight > topCategory.totalWeight * 0.6) {
      return `Your primary strength is in ${primaryCategory} with ${skillCount} key skills, but you also show strong capabilities in ${scores[1].category}. This versatility gives you an edge for collaborative, cross-functional roles.`;
    }
    
    return `Your profile shows strong specialization in ${primaryCategory} with ${skillCount} matched skills. Your expertise in ${topCategory.matchedSkills.slice(0, 3).join(', ')} positions you well for senior-level roles in this domain.`;
  }

  private getPrimaryCareerTitle(primaryCategory: string): string {
    return careerTitleMap[primaryCategory] || 'Software Developer';
  }
}
