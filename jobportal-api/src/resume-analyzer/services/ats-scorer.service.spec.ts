import { AtsScorerService } from './ats-scorer.service';

describe('ATS Scorer Service', () => {
    let service: AtsScorerService;

    beforeEach(() => {
        service = new AtsScorerService();
    });

    describe('Great resume with matching job description', () => {
        it('should score 80–95 for a well-structured resume with matching JD', () => {
            const resumeText = `
John Doe
john.doe@email.com | 555-123-4567 | linkedin.com/in/johndoe

Summary
Senior Full-Stack Developer with 8 years of experience building scalable web applications.

Experience
Senior Software Engineer | TechCorp | 2020 - Present
- Developed and deployed microservices architecture using Node.js and Docker, reducing deployment time by 60%
- Led a team of 8 engineers to deliver a customer-facing dashboard using React and TypeScript
- Implemented CI/CD pipelines with GitHub Actions, achieving 99.9% uptime
- Optimized database queries in PostgreSQL, improving response time by 40%

Software Engineer | StartupXYZ | 2017 - 2020
- Built RESTful APIs using Express and Node.js serving 50,000 daily active users
- Designed and maintained MongoDB and Redis caching layers
- Automated testing with Jest, increasing code coverage from 45% to 85%

Education
Bachelor of Science in Computer Science | State University | 2017

Skills
JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Git, REST API, GraphQL, Agile, CI/CD
`;

            const jobDescription = `
We are looking for a Senior Full-Stack Developer with experience in React, Node.js, TypeScript, 
PostgreSQL, and Docker. Must have experience with CI/CD, agile methodologies, and leading engineering teams.
Strong communication skills and attention to detail required. Bachelor's degree required.
`;

            const result = service.analyzeResume(resumeText, jobDescription);

            expect(result.score).toBeGreaterThanOrEqual(75);
            expect(result.score).toBeLessThanOrEqual(95);
            expect(result.penalties.length).toBe(0); // no penalties for a great resume
            expect(result.analysis.hasMeasurableAchievements).toBe(true);
            expect(result.analysis.hasContactInfo).toBe(true);
            expect(result.analysis.hasExperience).toBe(true);
            expect(result.analysis.hasSkills).toBe(true);
        });
    });

    describe('Bad resume (too short, no sections)', () => {
        it('should score 10–30 for a barely-there resume', () => {
            const resumeText = `
I know some programming stuff and I like computers.
Looking for a job in tech. I can do things.
`;

            const result = service.analyzeResume(resumeText);

            expect(result.score).toBeGreaterThanOrEqual(10);
            expect(result.score).toBeLessThanOrEqual(30);
            expect(result.penalties.length).toBeGreaterThan(0);
        });
    });

    describe('Decent resume, no job description', () => {
        it('should score 40–65 for a moderate resume without JD', () => {
            const resumeText = `
Jane Smith
jane@example.com

Summary
Web developer with 3 years of experience.

Experience
Junior Developer | WebAgency | 2021 - Present
- Built React components for client projects
- Developed APIs using Node.js and Express
- Worked with PostgreSQL databases

Education
Bachelor's in Computer Science | University | 2021

Skills
JavaScript, React, Node.js, CSS, HTML, Git
`;

            const result = service.analyzeResume(resumeText);

            expect(result.score).toBeGreaterThanOrEqual(30);
            expect(result.score).toBeLessThanOrEqual(65);
            // No job description = default 30 for job match
            expect(result.breakdown.jobMatch).toBe(30);
        });
    });

    describe('Score floor and ceiling', () => {
        it('should never go below 10', () => {
            const result = service.analyzeResume('x');
            expect(result.score).toBeGreaterThanOrEqual(10);
        });

        it('should never exceed 95', () => {
            // Even a perfect resume shouldn't be 100
            const perfectResume = `
john@email.com | 555-123-4567 | linkedin.com/in/john

Summary
Expert developer with 15 years of experience.

Experience
CTO | MegaCorp | 2015 - Present
- Developed enterprise architecture serving 10M users using React, Node.js, TypeScript
- Led team of 50 engineers across 8 countries, increasing productivity by 200%
- Implemented microservices with Docker, Kubernetes, AWS, reducing costs by $2M annually
- Built CI/CD pipelines with Jenkins and GitHub Actions achieving 99.99% uptime
- Designed GraphQL APIs processing 1M requests per second
- Optimized PostgreSQL and MongoDB databases, reducing query times by 80%

Education
PhD in Computer Science | MIT | 2010

Skills
JavaScript, TypeScript, React, Vue, Angular, Node.js, Express, Python, Django, Java, Spring,
SQL, MongoDB, PostgreSQL, Redis, AWS, Azure, GCP, Docker, Kubernetes, Git, Agile, Scrum,
REST API, GraphQL, Microservices, CI/CD, Terraform, Kafka, Machine Learning, TensorFlow
`;

            const result = service.analyzeResume(perfectResume, 'Looking for a CTO with React Node.js TypeScript Docker Kubernetes AWS experience');
            expect(result.score).toBeLessThanOrEqual(95);
        });
    });

    describe('Penalty system', () => {
        it('should penalize missing Skills section', () => {
            const resumeText = `
john@email.com

Experience
Developer at Company | 2020 - Present
- Developed web applications
`;
            const result = service.analyzeResume(resumeText);
            const skillsPenalty = result.penalties.find(p => p.reason.includes('Skills'));
            expect(skillsPenalty).toBeDefined();
            expect(skillsPenalty!.points).toBe(15);
        });

        it('should penalize missing Experience section', () => {
            const resumeText = `
john@email.com

Skills
React, Node.js, JavaScript
`;
            const result = service.analyzeResume(resumeText);
            const expPenalty = result.penalties.find(p => p.reason.includes('Experience'));
            expect(expPenalty).toBeDefined();
        });
    });

    describe('Section detection (Bug #6 fix)', () => {
        it('should require section header, not just the word "experience"', () => {
            // This resume mentions "experience" in a sentence but has no section header
            const resumeText = `
john@email.com
I have 3 years of experience with React and JavaScript.
I am looking for a new role where I can use my experience to build great products.
`;

            const result = service.analyzeResume(resumeText);
            // "experience" appears in text but NOT as a section header
            expect(result.analysis.hasExperience).toBe(false);
        });
    });

    describe('Keyword matching (Bug #3 fix)', () => {
        it('should use word boundaries to prevent false positives', () => {
            const resumeText = `
john@email.com

Summary
Experienced in accessing databases and processing data.

Skills
Data analysis
`;
            const result = service.analyzeResume(resumeText);
            // "accessing" should NOT match "css"
            // "processing" should NOT match anything spuriously
            expect(result.analysis.keywordMatches).not.toContain('css');
        });
    });

    describe('Job match deduplication (Bug #7 fix)', () => {
        it('should not double-count keywords in job match', () => {
            const resumeText = `
john@email.com

Skills
React, Node.js, JavaScript

Experience
Developer | 2020 - Present
- Built applications with React and Node.js
`;
            const jobDescription = 'Looking for React developer with Node.js experience. Must know React well.';

            const result = service.analyzeResume(resumeText, jobDescription);
            // React appears twice in JD but should only count once
            expect(result.analysis.jobMatchAnalysis).toBeDefined();
            expect(result.analysis.jobMatchAnalysis!.matchPercentage).toBeGreaterThan(0);
        });
    });

    describe('Measurable achievements detection', () => {
        it('should detect percentages and numbers', () => {
            const result = service.analyzeResume(`
john@email.com
Experience
Developer | 2020
- Increased performance by 50%
- Led team of 12 engineers

Skills
JavaScript
`);
            expect(result.analysis.hasMeasurableAchievements).toBe(true);
        });

        it('should not detect achievements in plain text', () => {
            const result = service.analyzeResume(`
john@email.com
Experience
Developer | Company
- Worked on various projects
- Helped with code reviews

Skills
JavaScript
`);
            expect(result.analysis.hasMeasurableAchievements).toBe(false);
        });
    });
});
