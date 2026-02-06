import { Injectable } from '@nestjs/common';

export interface CareerAnalysis {
  careerSummary: string;
  primaryCareerTitle: string;
  careerCategory: string;
  recommendedCareerPaths: {
    title: string;
    description: string;
    keyResponsibilities: string[];
    whyItFits: string;
    relevantJobTitles: string[];
  }[];
}

@Injectable()
export class CareerGuidanceService {
  private readonly skillCategories = {
    frontend: ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'next.js', 'gatsby'],
    backend: ['node.js', 'express', 'nest.js', 'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel'],
    database: ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'firebase'],
    devops: ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'ci/cd', 'terraform', 'ansible'],
    data: ['python', 'r', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'machine learning', 'deep learning', 'data science'],
    mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin'],
    testing: ['jest', 'cypress', 'selenium', 'testing', 'unit testing', 'integration testing'],
    general: ['git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices', 'system design']
  };

  analyzeSkills(skills: string[]): CareerAnalysis {
    const normalizedSkills = skills.map(skill => skill.toLowerCase().trim());
    const categorizedSkills = this.categorizeSkills(normalizedSkills);
    
    const primaryCategory = this.determinePrimaryCategory(categorizedSkills);
    const careerPaths = this.generateCareerPaths(primaryCategory, categorizedSkills);
    
    return {
      careerSummary: this.generateCareerSummary(categorizedSkills, primaryCategory),
      primaryCareerTitle: this.getPrimaryCareerTitle(primaryCategory, categorizedSkills),
      careerCategory: primaryCategory,
      recommendedCareerPaths: careerPaths
    };
  }

  private categorizeSkills(skills: string[]): Record<string, string[]> {
    const categorized: Record<string, string[]> = {};
    
    Object.entries(this.skillCategories).forEach(([category, categorySkills]) => {
      const matched = skills.filter(skill => 
        categorySkills.some(catSkill => skill.includes(catSkill) || catSkill.includes(skill))
      );
      if (matched.length > 0) {
        categorized[category] = matched;
      }
    });
    
    return categorized;
  }

  private determinePrimaryCategory(categorizedSkills: Record<string, string[]>): string {
    const scores = Object.entries(categorizedSkills).map(([category, skills]) => ({
      category,
      score: skills.length
    }));
    
    if (scores.length === 0) return 'General';
    
    const topCategory = scores.sort((a, b) => b.score - a.score)[0];
    
    // Special cases for combinations
    if (categorizedSkills.frontend && categorizedSkills.backend) {
      return 'Full-Stack';
    }
    if (categorizedSkills.data && categorizedSkills.backend) {
      return 'Data Engineering';
    }
    if (categorizedSkills.devops && categorizedSkills.backend) {
      return 'DevOps Engineering';
    }
    
    return topCategory.category;
  }

  private generateCareerPaths(primaryCategory: string, categorizedSkills: Record<string, string[]>): CareerAnalysis['recommendedCareerPaths'] {
    const careerPathsMap: Record<string, CareerAnalysis['recommendedCareerPaths']> = {
      'Full-Stack': [
        {
          title: 'Full-Stack Developer',
          description: 'Build end-to-end web applications with both frontend and backend expertise',
          keyResponsibilities: [
            'Design and implement responsive user interfaces',
            'Develop robust backend APIs and services',
            'Manage database systems and data flow',
            'Integrate third-party services and APIs'
          ],
          whyItFits: 'Your combination of frontend and backend skills makes you ideal for full-stack development',
          relevantJobTitles: ['Full-Stack Developer', 'Full-Stack Engineer', 'Software Developer', 'Web Developer']
        },
        {
          title: 'Technical Lead',
          description: 'Lead development teams and make architectural decisions',
          keyResponsibilities: [
            'Guide technical architecture decisions',
            'Mentor junior developers',
            'Review code and ensure best practices',
            'Coordinate with product teams'
          ],
          whyItFits: 'Your broad skill set positions you well for technical leadership roles',
          relevantJobTitles: ['Technical Lead', 'Engineering Lead', 'Senior Full-Stack Developer', 'Team Lead']
        }
      ],
      'Frontend': [
        {
          title: 'Frontend Developer',
          description: 'Create engaging user interfaces and web applications',
          keyResponsibilities: [
            'Build responsive and interactive UI components',
            'Optimize application performance',
            'Collaborate with UX/UI designers',
            'Implement state management and data flow'
          ],
          whyItFits: 'Your frontend skills align perfectly with creating modern web experiences',
          relevantJobTitles: ['Frontend Developer', 'UI Developer', 'React Developer', 'Web Developer']
        }
      ],
      'Backend': [
        {
          title: 'Backend Developer',
          description: 'Build robust server-side applications and APIs',
          keyResponsibilities: [
            'Design and implement RESTful APIs',
            'Manage database operations and optimization',
            'Handle authentication and security',
            'Scale applications for high performance'
          ],
          whyItFits: 'Your backend expertise is ideal for building scalable server solutions',
          relevantJobTitles: ['Backend Developer', 'API Developer', 'Server Developer', 'Software Engineer']
        }
      ],
      'Data Engineering': [
        {
          title: 'Data Engineer',
          description: 'Build data pipelines and infrastructure for analytics',
          keyResponsibilities: [
            'Design and implement data pipelines',
            'Build ETL processes and data workflows',
            'Optimize data storage and retrieval',
            'Collaborate with data scientists and analysts'
          ],
          whyItFits: 'Your combination of data and backend skills is perfect for data engineering',
          relevantJobTitles: ['Data Engineer', 'ETL Developer', 'Data Pipeline Engineer', 'Analytics Engineer']
        }
      ],
      'DevOps Engineering': [
        {
          title: 'DevOps Engineer',
          description: 'Streamline development and deployment processes',
          keyResponsibilities: [
            'Implement CI/CD pipelines',
            'Manage cloud infrastructure and deployments',
            'Monitor system performance and reliability',
            'Automate development workflows'
          ],
          whyItFits: 'Your DevOps and backend skills make you ideal for infrastructure and deployment roles',
          relevantJobTitles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Infrastructure Engineer']
        }
      ]
    };

    return careerPathsMap[primaryCategory] || careerPathsMap['Frontend'];
  }

  private generateCareerSummary(categorizedSkills: Record<string, string[]>, primaryCategory: string): string {
    const totalSkills = Object.values(categorizedSkills).reduce((sum, skills) => sum + skills.length, 0);
    const categories = Object.keys(categorizedSkills).join(', ');
    
    if (totalSkills === 0) {
      return "You're at the beginning of your tech journey. Focus on building foundational skills in one area first, then expand to related technologies.";
    }
    
    if (primaryCategory === 'Full-Stack') {
      return `You have a strong foundation in both frontend and backend technologies with ${totalSkills} technical skills. Your versatility makes you valuable for teams looking for developers who can handle end-to-end development.`;
    }
    
    return `You've developed solid expertise in ${categories} with ${totalSkills} technical skills. Your focused skill set in ${primaryCategory} positions you well for specialized roles in this domain.`;
  }

  private getPrimaryCareerTitle(primaryCategory: string, categorizedSkills: Record<string, string[]>): string {
    const titleMap: Record<string, string> = {
      'Full-Stack': 'Full-Stack Developer',
      'Frontend': 'Frontend Developer',
      'Backend': 'Backend Developer',
      'Data Engineering': 'Data Engineer',
      'DevOps Engineering': 'DevOps Engineer',
      'Data': 'Data Scientist',
      'Mobile': 'Mobile Developer',
      'Testing': 'QA Engineer',
      'General': 'Software Developer'
    };
    
    return titleMap[primaryCategory] || 'Software Developer';
  }
}
