import { CareerGuidanceService } from './career-guidance.service';
import {
    normalizeSkill,
    matchesAlias,
    levenshteinDistance,
    computeNormalizedScore,
} from './career-guidance.service';
import { scoringConfig } from './career-guidance.data';

describe('Career Guidance — Pure Functions', () => {
    describe('normalizeSkill', () => {
        it('should lowercase and trim', () => {
            expect(normalizeSkill('  React  ')).toBe('react');
            expect(normalizeSkill('Node.JS')).toBe('node.js');
        });

        it('should collapse whitespace', () => {
            expect(normalizeSkill('React  Native')).toBe('react native');
        });
    });

    describe('matchesAlias', () => {
        it('should match exact aliases', () => {
            expect(matchesAlias('react', ['react', 'reactjs'])).toBe(true);
            expect(matchesAlias('React', ['react', 'reactjs'])).toBe(true);
        });

        it('should NOT match partial substrings (Bug #3 fix)', () => {
            // "css" must NOT match "scss"
            expect(matchesAlias('css', ['scss'])).toBe(false);
            // "c" must NOT match "c#" or "c++"
            expect(matchesAlias('c', ['c#', 'c++'])).toBe(false);
            // "react" must NOT match "react native" (different alias)
            expect(matchesAlias('react', ['react native'])).toBe(false);
        });

        it('should match normalized variants (dots/hyphens)', () => {
            expect(matchesAlias('nodejs', ['node.js'])).toBe(true);
            expect(matchesAlias('nextjs', ['next.js'])).toBe(true);
        });

        it('should tolerate Levenshtein distance 1 for long aliases only', () => {
            // "angulr" → "angular" (6 chars, distance 1) — should match
            expect(matchesAlias('angulr', ['angular'])).toBe(true);
            // "rect" → "react" (5 chars, distance 1) — should NOT match (alias ≤ 5 chars)
            expect(matchesAlias('rect', ['react'])).toBe(false);
        });
    });

    describe('levenshteinDistance', () => {
        it('should return 0 for identical strings', () => {
            expect(levenshteinDistance('react', 'react')).toBe(0);
        });

        it('should calculate correct distances', () => {
            expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
            expect(levenshteinDistance('css', 'scss')).toBe(1);
        });
    });

    describe('computeNormalizedScore', () => {
        it('should weight core at 60%, supporting at 30%, adjacent at 10%', () => {
            // All cores matched, nothing else
            const score = computeNormalizedScore(5, 5, 0, 3, 0, 2, scoringConfig);
            expect(score).toBe(60); // 100% of coreWeight (60)
        });

        it('should return 0 when nothing matches', () => {
            const score = computeNormalizedScore(0, 5, 0, 3, 0, 2, scoringConfig);
            expect(score).toBe(0);
        });

        it('should return 100 when everything matches', () => {
            const score = computeNormalizedScore(5, 5, 3, 3, 2, 2, scoringConfig);
            expect(score).toBe(100);
        });

        it('should handle empty categories (0 total)', () => {
            const score = computeNormalizedScore(0, 0, 0, 0, 0, 0, scoringConfig);
            expect(score).toBe(0);
        });
    });
});

describe('Career Guidance — Service Integration', () => {
    let service: CareerGuidanceService;

    beforeEach(() => {
        service = new CareerGuidanceService();
    });

    describe('User-reported bug: Frontend skills should NOT be Full-Stack', () => {
        it('JS, React, HTML, CSS → Frontend Developer', () => {
            const result = service.analyzeSkills(['JavaScript', 'React', 'HTML', 'CSS']);

            expect(result.primaryCareerTitle).toBe('Frontend Developer');
            expect(result.careerCategory).toBe('Frontend Development');
        });
    });

    describe('MERN stack should be Full-Stack', () => {
        it('MongoDB, Express, React, Node → Full-Stack Developer', () => {
            const result = service.analyzeSkills(['MongoDB', 'Express', 'React', 'Node']);

            expect(result.primaryCareerTitle).toBe('Full-Stack Developer');
            expect(result.careerCategory).toBe('Full-Stack Development');
        });
    });

    describe('Pure backend skills → Backend Developer', () => {
        it('Node, Express, PostgreSQL, Docker → Backend Developer', () => {
            const result = service.analyzeSkills(['Node', 'Express', 'PostgreSQL', 'Docker']);

            expect(result.primaryCareerTitle).toContain('Backend');
        });
    });

    describe('AI/ML focused skills → AI/ML Engineer', () => {
        it('Python, TensorFlow, PyTorch → AI/ML Engineer', () => {
            const result = service.analyzeSkills(['Python', 'TensorFlow', 'PyTorch']);

            expect(result.primaryCareerTitle).toBe('AI/ML Engineer');
            expect(result.careerCategory).toBe('AI/ML Engineering');
        });
    });

    describe('Single skill should not crash', () => {
        it('React → Frontend Development (no error)', () => {
            const result = service.analyzeSkills(['React']);

            expect(result.careerCategory).toBe('Frontend Development');
            expect(result.primaryCareerTitle).toBeTruthy();
        });
    });

    describe('Skill breakdown is populated', () => {
        it('should provide skill breakdown with percentages', () => {
            const result = service.analyzeSkills(['React', 'Node', 'Express']);

            expect(result.skillBreakdown).toBeDefined();
            expect(result.skillBreakdown.length).toBeGreaterThan(0);
            expect(result.skillBreakdown[0].percentage).toBeGreaterThan(0);
        });
    });

    describe('Debug trace is populated', () => {
        it('should include decision reason', () => {
            const result = service.analyzeSkills(['React', 'Vue', 'TypeScript']);

            expect(result.debugTrace).toBeDefined();
            expect(result.debugTrace!.decisionReason).toBeTruthy();
            expect(result.debugTrace!.categoryScores.length).toBeGreaterThan(0);
        });
    });

    describe('Skills to enhance is populated with priorities', () => {
        it('should suggest missing skills with priority levels', () => {
            const result = service.analyzeSkills(['React', 'HTML', 'CSS']);

            const frontendEnhance = result.skillsToEnhance.find(
                e => e.category === 'Frontend Development',
            );
            expect(frontendEnhance).toBeDefined();

            // Should suggest core skills as high priority
            const highPriority = frontendEnhance!.skills.filter(s => s.priority === 'high');
            expect(highPriority.length).toBeGreaterThan(0);
        });
    });

    describe('Cross-category leakage prevention (Bug #1)', () => {
        it('Python should only score in AI/ML, not Backend', () => {
            const result = service.analyzeSkills(['Python']);

            const breakdown = result.skillBreakdown;
            const aiml = breakdown.find(b => b.category === 'AI/ML Engineering');
            const backend = breakdown.find(b => b.category === 'Backend Development');

            expect(aiml).toBeDefined();
            expect(aiml!.matchedSkills).toContain('Python');

            // Python should NOT appear in Backend category
            if (backend) {
                expect(backend.matchedSkills).not.toContain('Python');
            }
        });
    });
});
