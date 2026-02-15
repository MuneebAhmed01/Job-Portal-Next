import { CategoryDefinition, ScoringConfig } from './career-guidance.types';

// ─── Scoring Configuration ────────────────────────────────────────────
// All thresholds in one place — no magic numbers scattered in code.

export const scoringConfig: ScoringConfig = {
  coreWeight: 60,
  supportingWeight: 30,
  adjacentWeight: 10,
  minimumPrimaryThreshold: 20,
  minimumSecondaryThreshold: 15,
  combinationRatioThreshold: 0.55, // Raised back up; denominator cap handles scoring boost
};

// ─── Skill Categories ─────────────────────────────────────────────────
// RULE: Each skill appears in EXACTLY ONE category.
//       If a skill is relevant to multiple domains (e.g. Python),
//       it goes in the PRIMARY domain and is NOT duplicated.
//       The combination-role detection handles cross-domain inference.

export const careerCategories: CategoryDefinition[] = [
  {
    name: 'Frontend Development',
    skills: [
      { canonical: 'React', aliases: ['react', 'reactjs', 'react.js'], importance: 'core' },
      { canonical: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js'], importance: 'core' },
      { canonical: 'Angular', aliases: ['angular', 'angularjs'], importance: 'core' },
      { canonical: 'JavaScript', aliases: ['javascript', 'js', 'ecmascript', 'es6'], importance: 'core' },
      { canonical: 'TypeScript', aliases: ['typescript', 'ts'], importance: 'core' },
      { canonical: 'HTML5', aliases: ['html', 'html5'], importance: 'supporting' },
      { canonical: 'CSS3', aliases: ['css', 'css3'], importance: 'supporting' },
      { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], importance: 'supporting' },
      { canonical: 'Next.js', aliases: ['nextjs', 'next.js'], importance: 'supporting' },
      { canonical: 'Svelte', aliases: ['svelte'], importance: 'supporting' },
      { canonical: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'], importance: 'supporting' },
      { canonical: 'SASS/SCSS', aliases: ['sass', 'scss', 'less'], importance: 'adjacent' },
      { canonical: 'Webpack', aliases: ['webpack', 'vite', 'rollup', 'parcel'], importance: 'adjacent' },
      { canonical: 'Jest', aliases: ['jest', 'testing library', 'react testing library', 'vitest'], importance: 'adjacent' },
      { canonical: 'Responsive Design', aliases: ['responsive', 'mobile first', 'adaptive design'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Backend Development',
    skills: [
      { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js'], importance: 'core' },
      { canonical: 'Express.js', aliases: ['express', 'expressjs', 'express.js'], importance: 'core' },
      { canonical: 'NestJS', aliases: ['nestjs', 'nest.js', 'nest'], importance: 'core' },
      { canonical: 'Django', aliases: ['django'], importance: 'core' },
      { canonical: 'Spring Boot', aliases: ['spring', 'springboot', 'spring boot', 'spring framework'], importance: 'core' },
      { canonical: 'REST APIs', aliases: ['rest', 'rest api', 'restful', 'api design'], importance: 'core' },
      { canonical: 'Flask', aliases: ['flask'], importance: 'supporting' },
      { canonical: 'FastAPI', aliases: ['fastapi', 'fast api'], importance: 'supporting' },
      { canonical: 'GraphQL', aliases: ['graphql', 'apollo'], importance: 'supporting' },
      { canonical: 'gRPC', aliases: ['grpc'], importance: 'supporting' },
      { canonical: 'Authentication', aliases: ['authentication', 'auth', 'jwt', 'oauth'], importance: 'supporting' },
      { canonical: 'Ruby on Rails', aliases: ['ruby', 'rails', 'ruby on rails', 'ror'], importance: 'adjacent' },
      { canonical: 'PHP', aliases: ['php', 'laravel', 'symfony'], importance: 'adjacent' },
      { canonical: 'C#/.NET', aliases: ['c#', 'csharp', 'c sharp', '.net', 'dotnet'], importance: 'adjacent' },
      { canonical: 'Go', aliases: ['go', 'golang'], importance: 'adjacent' },
      { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'], importance: 'supporting' },
      { canonical: 'MongoDB', aliases: ['mongodb', 'mongo'], importance: 'supporting' },
      { canonical: 'Docker', aliases: ['docker', 'containerization'], importance: 'adjacent' },
      { canonical: 'AWS', aliases: ['aws', 'amazon web services'], importance: 'adjacent' },
    ]
  },
  {
    name: 'AI/ML Engineering',
    skills: [
      { canonical: 'Python', aliases: ['python', 'py', 'python3'], importance: 'core' },
      { canonical: 'TensorFlow', aliases: ['tensorflow', 'tf'], importance: 'core' },
      { canonical: 'PyTorch', aliases: ['pytorch', 'torch'], importance: 'core' },
      { canonical: 'Machine Learning', aliases: ['machine learning', 'ml'], importance: 'core' },
      { canonical: 'Deep Learning', aliases: ['deep learning', 'dl', 'neural networks', 'neural network'], importance: 'core' },
      { canonical: 'Computer Vision', aliases: ['computer vision', 'opencv', 'image processing'], importance: 'supporting' },
      { canonical: 'NLP', aliases: ['nlp', 'natural language processing', 'llm', 'large language model'], importance: 'supporting' },
      { canonical: 'Scikit-learn', aliases: ['scikit-learn', 'sklearn', 'scikit learn'], importance: 'supporting' },
      { canonical: 'Keras', aliases: ['keras'], importance: 'supporting' },
      { canonical: 'Data Science', aliases: ['data science', 'datascience'], importance: 'supporting' },
      { canonical: 'Pandas', aliases: ['pandas'], importance: 'adjacent' },
      { canonical: 'NumPy', aliases: ['numpy'], importance: 'adjacent' },
      { canonical: 'MLOps', aliases: ['mlops', 'ml ops', 'model deployment'], importance: 'adjacent' },
      { canonical: 'Hugging Face', aliases: ['huggingface', 'hugging face', 'transformers'], importance: 'adjacent' },
    ]
  },
  {
    name: 'UI/UX Design',
    skills: [
      { canonical: 'Figma', aliases: ['figma'], importance: 'core' },
      { canonical: 'UI Design', aliases: ['ui design', 'user interface', 'interface design'], importance: 'core' },
      { canonical: 'UX Design', aliases: ['ux design', 'user experience', 'ux'], importance: 'core' },
      { canonical: 'Prototyping', aliases: ['prototyping', 'prototype', 'wireframing', 'wireframe'], importance: 'core' },
      { canonical: 'User Research', aliases: ['user research', 'usability testing', 'ux research'], importance: 'core' },
      { canonical: 'Adobe XD', aliases: ['adobe xd', 'xd'], importance: 'supporting' },
      { canonical: 'Sketch', aliases: ['sketch'], importance: 'supporting' },
      { canonical: 'Design Systems', aliases: ['design systems', 'component library', 'style guide'], importance: 'supporting' },
      { canonical: 'Interaction Design', aliases: ['interaction design', 'motion design', 'microinteractions'], importance: 'supporting' },
      { canonical: 'InVision', aliases: ['invision'], importance: 'adjacent' },
      { canonical: 'Framer', aliases: ['framer'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Graphic Design',
    skills: [
      { canonical: 'Adobe Photoshop', aliases: ['photoshop', 'ps', 'adobe photoshop'], importance: 'core' },
      { canonical: 'Adobe Illustrator', aliases: ['illustrator', 'adobe illustrator'], importance: 'core' },
      { canonical: 'Branding', aliases: ['branding', 'brand design', 'brand identity', 'logo design'], importance: 'core' },
      { canonical: 'Adobe InDesign', aliases: ['indesign', 'adobe indesign'], importance: 'core' },
      { canonical: 'Typography', aliases: ['typography', 'fonts', 'type design'], importance: 'supporting' },
      { canonical: 'Color Theory', aliases: ['color theory', 'color psychology'], importance: 'supporting' },
      { canonical: 'Digital Illustration', aliases: ['illustration', 'digital art', 'vector art'], importance: 'supporting' },
      { canonical: 'Print Design', aliases: ['print design', 'publishing', 'layout design'], importance: 'supporting' },
      { canonical: 'Canva', aliases: ['canva'], importance: 'adjacent' },
      { canonical: 'CorelDRAW', aliases: ['coreldraw', 'corel draw'], importance: 'adjacent' },
      { canonical: 'Affinity Designer', aliases: ['affinity designer', 'affinity'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Database Engineering',
    skills: [
      { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql'], importance: 'core' },
      { canonical: 'MongoDB', aliases: ['mongodb', 'mongo'], importance: 'core' },
      { canonical: 'MySQL', aliases: ['mysql'], importance: 'core' },
      { canonical: 'SQL', aliases: ['sql'], importance: 'core' },
      { canonical: 'Database Design', aliases: ['database design', 'schema design', 'db design', 'normalization'], importance: 'core' },
      { canonical: 'Redis', aliases: ['redis', 'caching'], importance: 'supporting' },
      { canonical: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search'], importance: 'supporting' },
      { canonical: 'Prisma', aliases: ['prisma'], importance: 'supporting' },
      { canonical: 'TypeORM', aliases: ['typeorm'], importance: 'adjacent' },
      { canonical: 'Sequelize', aliases: ['sequelize'], importance: 'adjacent' },
      { canonical: 'Cassandra', aliases: ['cassandra'], importance: 'adjacent' },
      { canonical: 'DynamoDB', aliases: ['dynamodb'], importance: 'adjacent' },
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { canonical: 'Docker', aliases: ['docker', 'containerization', 'containers'], importance: 'core' },
      { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'kubectl'], importance: 'core' },
      { canonical: 'AWS', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'], importance: 'core' },
      { canonical: 'CI/CD', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'jenkins', 'github actions', 'gitlab ci'], importance: 'core' },
      { canonical: 'Terraform', aliases: ['terraform', 'infrastructure as code', 'iac'], importance: 'core' },
      { canonical: 'Azure', aliases: ['azure', 'microsoft azure'], importance: 'supporting' },
      { canonical: 'GCP', aliases: ['gcp', 'google cloud', 'google cloud platform'], importance: 'supporting' },
      { canonical: 'Linux', aliases: ['linux', 'unix', 'bash', 'shell scripting', 'ubuntu'], importance: 'supporting' },
      { canonical: 'Ansible', aliases: ['ansible', 'configuration management'], importance: 'supporting' },
      { canonical: 'Monitoring', aliases: ['prometheus', 'grafana', 'datadog', 'monitoring'], importance: 'adjacent' },
      { canonical: 'Git', aliases: ['git', 'github', 'gitlab', 'version control'], importance: 'adjacent' },
      { canonical: 'Nginx', aliases: ['nginx', 'apache', 'reverse proxy'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Mobile Development',
    skills: [
      { canonical: 'React Native', aliases: ['react native', 'reactnative'], importance: 'core' },
      { canonical: 'Flutter', aliases: ['flutter', 'dart'], importance: 'core' },
      { canonical: 'Swift', aliases: ['swift', 'ios development'], importance: 'core' },
      { canonical: 'Kotlin', aliases: ['kotlin', 'android development'], importance: 'core' },
      { canonical: 'iOS', aliases: ['ios'], importance: 'supporting' },
      { canonical: 'Android', aliases: ['android'], importance: 'supporting' },
      { canonical: 'Mobile UI', aliases: ['mobile ui', 'mobile design', 'app design'], importance: 'supporting' },
      { canonical: 'Expo', aliases: ['expo'], importance: 'adjacent' },
      { canonical: 'Ionic', aliases: ['ionic', 'cordova'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Cybersecurity',
    skills: [
      { canonical: 'Penetration Testing', aliases: ['penetration testing', 'pen testing', 'pentest', 'ethical hacking'], importance: 'core' },
      { canonical: 'Network Security', aliases: ['network security', 'firewall'], importance: 'core' },
      { canonical: 'Security Auditing', aliases: ['security audit', 'vulnerability assessment', 'security assessment'], importance: 'core' },
      { canonical: 'OWASP', aliases: ['owasp', 'web security', 'application security', 'appsec'], importance: 'core' },
      { canonical: 'Cryptography', aliases: ['cryptography', 'encryption', 'ssl/tls'], importance: 'supporting' },
      { canonical: 'SIEM', aliases: ['siem', 'splunk', 'security monitoring'], importance: 'supporting' },
      { canonical: 'Identity Management', aliases: ['iam', 'identity access management', 'sso'], importance: 'supporting' },
      { canonical: 'Cloud Security', aliases: ['cloud security', 'aws security', 'azure security'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Blockchain/Web3',
    skills: [
      { canonical: 'Solidity', aliases: ['solidity'], importance: 'core' },
      { canonical: 'Ethereum', aliases: ['ethereum', 'eth', 'evm'], importance: 'core' },
      { canonical: 'Smart Contracts', aliases: ['smart contracts', 'smartcontract', 'contract development'], importance: 'core' },
      { canonical: 'Web3.js', aliases: ['web3', 'web3.js', 'ethers.js', 'ethers'], importance: 'core' },
      { canonical: 'DeFi', aliases: ['defi', 'decentralized finance'], importance: 'supporting' },
      { canonical: 'NFT', aliases: ['nft', 'nft development'], importance: 'supporting' },
      { canonical: 'Hyperledger', aliases: ['hyperledger', 'fabric', 'enterprise blockchain'], importance: 'supporting' },
      { canonical: 'Rust', aliases: ['rust', 'solana'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Game Development',
    skills: [
      { canonical: 'Unity', aliases: ['unity', 'unity3d'], importance: 'core' },
      { canonical: 'Unreal Engine', aliases: ['unreal', 'unreal engine', 'ue4', 'ue5'], importance: 'core' },
      { canonical: 'C++', aliases: ['c++', 'cpp'], importance: 'core' },
      { canonical: 'Game Design', aliases: ['game design', 'level design', 'game mechanics'], importance: 'core' },
      { canonical: 'C# (Game)', aliases: ['unity scripting'], importance: 'supporting' },
      { canonical: 'Blender', aliases: ['blender', '3d modeling', '3d art'], importance: 'supporting' },
      { canonical: 'Godot', aliases: ['godot'], importance: 'supporting' },
      { canonical: 'Game Physics', aliases: ['game physics', 'collision detection'], importance: 'adjacent' },
    ]
  },
  {
    name: 'QA & Testing',
    skills: [
      { canonical: 'Test Automation', aliases: ['test automation', 'automated testing', 'automation framework'], importance: 'core' },
      { canonical: 'Selenium', aliases: ['selenium', 'webdriver'], importance: 'core' },
      { canonical: 'Cypress', aliases: ['cypress', 'e2e testing', 'end to end testing'], importance: 'core' },
      { canonical: 'API Testing', aliases: ['api testing', 'postman', 'rest assured'], importance: 'core' },
      { canonical: 'Performance Testing', aliases: ['performance testing', 'load testing', 'jmeter', 'k6'], importance: 'supporting' },
      { canonical: 'Manual Testing', aliases: ['manual testing', 'test cases', 'test plans'], importance: 'supporting' },
      { canonical: 'JUnit', aliases: ['junit', 'testng'], importance: 'supporting' },
      { canonical: 'BDD/TDD', aliases: ['bdd', 'tdd', 'behavior driven', 'test driven'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Data Engineering',
    skills: [
      { canonical: 'Apache Spark', aliases: ['spark', 'apache spark', 'pyspark'], importance: 'core' },
      { canonical: 'Kafka', aliases: ['kafka', 'apache kafka', 'event streaming'], importance: 'core' },
      { canonical: 'ETL', aliases: ['etl', 'extract transform load', 'data pipeline'], importance: 'core' },
      { canonical: 'Data Warehouse', aliases: ['data warehouse', 'snowflake', 'redshift', 'bigquery'], importance: 'core' },
      { canonical: 'Hadoop', aliases: ['hadoop', 'hdfs', 'mapreduce'], importance: 'supporting' },
      { canonical: 'Airflow', aliases: ['airflow', 'apache airflow', 'workflow orchestration'], importance: 'supporting' },
      { canonical: 'dbt', aliases: ['dbt', 'data build tool'], importance: 'supporting' },
      { canonical: 'Dagster', aliases: ['dagster', 'prefect'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Embedded Systems',
    skills: [
      { canonical: 'C', aliases: ['c language', 'embedded c'], importance: 'core' },
      { canonical: 'Microcontrollers', aliases: ['microcontroller', 'mcu', 'arduino', 'raspberry pi'], importance: 'core' },
      { canonical: 'RTOS', aliases: ['rtos', 'real time os', 'freertos'], importance: 'core' },
      { canonical: 'Embedded Linux', aliases: ['embedded linux', 'yocto', 'buildroot'], importance: 'core' },
      { canonical: 'IoT', aliases: ['iot', 'internet of things'], importance: 'supporting' },
      { canonical: 'FPGA', aliases: ['fpga', 'vhdl', 'verilog'], importance: 'supporting' },
      { canonical: 'ARM', aliases: ['arm', 'arm cortex', 'stm32'], importance: 'supporting' },
      { canonical: 'Embedded C++', aliases: ['embedded cpp'], importance: 'adjacent' },
    ]
  },
  {
    name: 'Java Development',
    skills: [
      { canonical: 'Java', aliases: ['java', 'core java', 'java8', 'java11', 'java17'], importance: 'core' },
    ]
  },
];

// ─── Combination Roles ────────────────────────────────────────────────

export interface CombinationRole {
  categories: [string, string];
  result: string;
}

export const combinationRoles: CombinationRole[] = [
  { categories: ['Frontend Development', 'Backend Development'], result: 'Full-Stack Development' },
  { categories: ['AI/ML Engineering', 'Data Engineering'], result: 'ML Platform Engineering' },
  { categories: ['DevOps & Cloud', 'Backend Development'], result: 'Platform Engineering' },
  { categories: ['UI/UX Design', 'Frontend Development'], result: 'Design Engineering' },
  { categories: ['Cybersecurity', 'DevOps & Cloud'], result: 'Cloud Security Engineering' },
  { categories: ['AI/ML Engineering', 'Backend Development'], result: 'AI Backend Engineering' },
  { categories: ['Database Engineering', 'Backend Development'], result: 'Data Platform Engineering' },
  { categories: ['Graphic Design', 'UI/UX Design'], result: 'Product Design Lead' },
  { categories: ['Mobile Development', 'UI/UX Design'], result: 'Mobile Design Lead' },
  { categories: ['Embedded Systems', 'DevOps & Cloud'], result: 'IoT Platform Engineering' },
];

// ─── Career Path Definitions ──────────────────────────────────────────

export interface CareerPathDef {
  title: string;
  description: string;
  keyResponsibilities: string[];
  whyItFits: string;
  relevantJobTitles: string[];
  baseMatchScore: number;
  category: string;
}

export const careerPaths: Record<string, CareerPathDef[]> = {
  'Frontend Development': [
    {
      title: 'Frontend Developer',
      description: 'Build complex web applications with modern frameworks',
      keyResponsibilities: ['Component architecture', 'Performance optimization', 'State management', 'UI implementation'],
      whyItFits: 'Your frontend framework expertise qualifies you for development roles',
      relevantJobTitles: ['Frontend Developer', 'Frontend Engineer', 'UI Developer', 'React Developer'],
      baseMatchScore: 94,
      category: 'Frontend Development'
    },
    {
      title: 'Full-Stack Developer',
      description: 'Build end-to-end applications combining frontend and backend skills',
      keyResponsibilities: ['Frontend development', 'Backend API integration', 'Database design', 'Deployment'],
      whyItFits: 'Adding backend skills to your frontend expertise opens full-stack opportunities',
      relevantJobTitles: ['Full-Stack Developer', 'MERN Stack Developer', 'JavaScript Full-Stack Engineer'],
      baseMatchScore: 82,
      category: 'Full-Stack Development'
    },
    {
      title: 'Frontend Architect',
      description: 'Design frontend systems and establish best practices',
      keyResponsibilities: ['Architecture decisions', 'Technical leadership', 'Code standards', 'Performance strategy'],
      whyItFits: 'Your broad frontend knowledge positions you for architecture roles',
      relevantJobTitles: ['Frontend Architect', 'Principal Frontend Engineer', 'UI Architect'],
      baseMatchScore: 78,
      category: 'Frontend Development'
    }
  ],
  'Backend Development': [
    {
      title: 'Backend Developer',
      description: 'Build scalable server-side applications',
      keyResponsibilities: ['API development', 'Database design', 'System architecture', 'Performance tuning'],
      whyItFits: 'Your backend skills are perfect for development roles',
      relevantJobTitles: ['Backend Developer', 'Backend Engineer', 'API Developer', 'Server Developer'],
      baseMatchScore: 93,
      category: 'Backend Development'
    },
    {
      title: 'Full-Stack Developer',
      description: 'Build complete applications with both frontend and backend',
      keyResponsibilities: ['Server-side logic', 'Client-side integration', 'Database management', 'API design'],
      whyItFits: 'Learning frontend technologies would make you a versatile full-stack developer',
      relevantJobTitles: ['Full-Stack Developer', 'Software Engineer', 'Web Developer'],
      baseMatchScore: 75,
      category: 'Full-Stack Development'
    },
    {
      title: 'Platform Engineer',
      description: 'Build internal platforms and developer tools',
      keyResponsibilities: ['Platform architecture', 'Developer experience', 'Infrastructure APIs', 'System reliability'],
      whyItFits: 'Your backend expertise extends well to platform engineering',
      relevantJobTitles: ['Platform Engineer', 'Infrastructure Engineer', 'Backend Platform Engineer'],
      baseMatchScore: 80,
      category: 'Platform Engineering'
    }
  ],
  'Full-Stack Development': [
    {
      title: 'Full-Stack Developer',
      description: 'Build complete web applications from frontend to backend',
      keyResponsibilities: ['Frontend development', 'Backend API design', 'Database architecture', 'Deployment'],
      whyItFits: 'Your combined frontend and backend skills make you a versatile full-stack developer',
      relevantJobTitles: ['Full-Stack Developer', 'MERN Stack Developer', 'JavaScript Full-Stack Engineer', 'Web Developer'],
      baseMatchScore: 95,
      category: 'Full-Stack Development'
    },
    {
      title: 'Software Engineer',
      description: 'Develop comprehensive software solutions across the stack',
      keyResponsibilities: ['Application architecture', 'Full-cycle development', 'Code optimization', 'System integration'],
      whyItFits: 'Your broad skill set aligns well with general software engineering roles',
      relevantJobTitles: ['Software Engineer', 'Application Developer', 'Software Developer', 'Full-Stack Engineer'],
      baseMatchScore: 88,
      category: 'Software Engineering'
    },
    {
      title: 'Technical Lead',
      description: 'Lead development teams and technical decisions',
      keyResponsibilities: ['Technical leadership', 'Architecture decisions', 'Code reviews', 'Team mentoring'],
      whyItFits: 'Your comprehensive knowledge prepares you for technical leadership',
      relevantJobTitles: ['Technical Lead', 'Team Lead', 'Engineering Lead', 'Tech Lead'],
      baseMatchScore: 82,
      category: 'Technical Leadership'
    }
  ],
  'UI/UX Design': [
    {
      title: 'UI/UX Designer',
      description: 'Lead design initiatives and create exceptional user experiences',
      keyResponsibilities: ['User research', 'Wireframing and prototyping', 'Design systems', 'Usability testing'],
      whyItFits: 'Your UI/UX tool expertise positions you for design roles',
      relevantJobTitles: ['UI/UX Designer', 'Product Designer', 'Interaction Designer', 'Experience Designer'],
      baseMatchScore: 95,
      category: 'UI/UX Design'
    },
    {
      title: 'Design Engineer',
      description: 'Bridge design and development with frontend coding skills',
      keyResponsibilities: ['Design implementation', 'Component libraries', 'Design system maintenance', 'Prototyping'],
      whyItFits: 'Learning frontend development would make you a powerful design engineer',
      relevantJobTitles: ['Design Engineer', 'Design Technologist', 'Creative Developer'],
      baseMatchScore: 78,
      category: 'Design Engineering'
    },
    {
      title: 'Product Designer',
      description: 'Design end-to-end product experiences',
      keyResponsibilities: ['Product strategy', 'Design execution', 'Cross-functional collaboration', 'Design metrics'],
      whyItFits: 'Your broad design skills fit product design perfectly',
      relevantJobTitles: ['Product Designer', 'Digital Product Designer', 'UX Product Designer'],
      baseMatchScore: 88,
      category: 'UI/UX Design'
    }
  ],
  'AI/ML Engineering': [
    {
      title: 'Machine Learning Engineer',
      description: 'Build and deploy ML models for production systems',
      keyResponsibilities: ['Train and optimize ML models', 'Deploy models to production', 'Build ML pipelines', 'Monitor model performance'],
      whyItFits: 'Your strong foundation in ML frameworks and Python is perfect for this role',
      relevantJobTitles: ['ML Engineer', 'AI Engineer', 'Deep Learning Engineer', 'MLOps Engineer'],
      baseMatchScore: 95,
      category: 'AI/ML Engineering'
    },
    {
      title: 'AI Backend Engineer',
      description: 'Build backend systems for AI applications',
      keyResponsibilities: ['API development for ML', 'Model serving infrastructure', 'Data pipelines', 'Scalable architectures'],
      whyItFits: 'Combining backend skills with AI expertise creates a specialized niche',
      relevantJobTitles: ['AI Backend Engineer', 'ML Platform Engineer', 'AI Infrastructure Engineer'],
      baseMatchScore: 85,
      category: 'AI Backend Engineering'
    },
    {
      title: 'Data Scientist',
      description: 'Analyze complex data and build predictive models',
      keyResponsibilities: ['Statistical analysis', 'Predictive modeling', 'Data visualization', 'Business insights'],
      whyItFits: 'Your data science and ML skills align well with data science roles',
      relevantJobTitles: ['Data Scientist', 'Lead Data Scientist', 'Quantitative Analyst'],
      baseMatchScore: 88,
      category: 'AI/ML Engineering'
    }
  ],
  'Graphic Design': [
    {
      title: 'Graphic Designer',
      description: 'Create visual content for brands and media',
      keyResponsibilities: ['Brand design', 'Marketing materials', 'Digital illustrations', 'Print design'],
      whyItFits: 'Your Adobe Creative Suite skills are ideal for graphic design',
      relevantJobTitles: ['Graphic Designer', 'Visual Designer', 'Brand Designer', 'Creative Designer'],
      baseMatchScore: 93,
      category: 'Graphic Design'
    },
    {
      title: 'UI/UX Designer',
      description: 'Transition into digital product design',
      keyResponsibilities: ['Interface design', 'User research', 'Prototyping', 'Design systems'],
      whyItFits: 'Your visual design skills are a strong foundation for UI/UX work',
      relevantJobTitles: ['UI Designer', 'Visual UI Designer', 'Digital Designer'],
      baseMatchScore: 75,
      category: 'UI/UX Design'
    },
    {
      title: 'Art Director',
      description: 'Lead visual creative direction for projects',
      keyResponsibilities: ['Creative vision', 'Team leadership', 'Client presentations', 'Brand strategy'],
      whyItFits: 'Your strong design foundation can lead to art direction',
      relevantJobTitles: ['Art Director', 'Creative Director', 'Visual Director'],
      baseMatchScore: 70,
      category: 'Graphic Design'
    }
  ],
  'DevOps & Cloud': [
    {
      title: 'DevOps Engineer',
      description: 'Build and maintain CI/CD and cloud infrastructure',
      keyResponsibilities: ['CI/CD pipelines', 'Cloud architecture', 'Infrastructure automation', 'Monitoring'],
      whyItFits: 'Your DevOps and cloud skills are in high demand',
      relevantJobTitles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Platform Engineer'],
      baseMatchScore: 94,
      category: 'DevOps & Cloud'
    },
    {
      title: 'Cloud Security Engineer',
      description: 'Secure cloud infrastructure and applications',
      keyResponsibilities: ['Cloud security architecture', 'Compliance', 'Security automation', 'Risk assessment'],
      whyItFits: 'Adding security expertise to your cloud skills creates a valuable specialization',
      relevantJobTitles: ['Cloud Security Engineer', 'DevSecOps Engineer', 'Security Architect'],
      baseMatchScore: 82,
      category: 'Cloud Security Engineering'
    },
    {
      title: 'Cloud Architect',
      description: 'Design cloud infrastructure and migration strategies',
      keyResponsibilities: ['Cloud strategy', 'Architecture design', 'Cost optimization', 'Security compliance'],
      whyItFits: 'Your cloud expertise positions you for architecture roles',
      relevantJobTitles: ['Cloud Architect', 'AWS/Azure/GCP Architect', 'Solutions Architect'],
      baseMatchScore: 85,
      category: 'DevOps & Cloud'
    }
  ],
  'Mobile Development': [
    {
      title: 'Mobile Developer',
      description: 'Build native and cross-platform mobile applications',
      keyResponsibilities: ['Mobile app development', 'Performance optimization', 'Native integrations', 'App store deployment'],
      whyItFits: 'Your mobile development skills qualify you for development roles',
      relevantJobTitles: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer'],
      baseMatchScore: 93,
      category: 'Mobile Development'
    },
    {
      title: 'Mobile Tech Lead',
      description: 'Lead mobile development teams and architecture',
      keyResponsibilities: ['Technical leadership', 'Architecture decisions', 'Code reviews', 'Team mentoring'],
      whyItFits: 'Your mobile expertise prepares you for leadership roles',
      relevantJobTitles: ['Mobile Tech Lead', 'Mobile Engineer', 'Mobile Architect'],
      baseMatchScore: 85,
      category: 'Mobile Development'
    },
    {
      title: 'Full-Stack Mobile Developer',
      description: 'Build complete mobile apps with backend services',
      keyResponsibilities: ['Mobile frontend', 'Backend APIs', 'Database integration', 'Push notifications'],
      whyItFits: 'Backend skills would complement your mobile expertise for end-to-end development',
      relevantJobTitles: ['Full-Stack Mobile Developer', 'Mobile Backend Developer'],
      baseMatchScore: 72,
      category: 'Full-Stack Development'
    }
  ],
  'Cybersecurity': [
    {
      title: 'Security Engineer',
      description: 'Protect systems and networks from cyber threats',
      keyResponsibilities: ['Security assessments', 'Vulnerability management', 'Incident response', 'Security tooling'],
      whyItFits: 'Your security skills are critical for modern organizations',
      relevantJobTitles: ['Security Engineer', 'Cybersecurity Engineer', 'Application Security Engineer'],
      baseMatchScore: 95,
      category: 'Cybersecurity'
    },
    {
      title: 'Penetration Tester',
      description: 'Identify security vulnerabilities through ethical hacking',
      keyResponsibilities: ['Vulnerability assessment', 'Penetration testing', 'Security reports', 'Remediation guidance'],
      whyItFits: 'Your penetration testing skills are highly specialized',
      relevantJobTitles: ['Penetration Tester', 'Ethical Hacker', 'Security Consultant'],
      baseMatchScore: 90,
      category: 'Cybersecurity'
    },
    {
      title: 'DevSecOps Engineer',
      description: 'Integrate security into CI/CD pipelines',
      keyResponsibilities: ['Security automation', 'Pipeline integration', 'Vulnerability scanning', 'Compliance'],
      whyItFits: 'Adding DevOps skills to your security expertise creates a high-demand role',
      relevantJobTitles: ['DevSecOps Engineer', 'Security Automation Engineer'],
      baseMatchScore: 78,
      category: 'Cloud Security Engineering'
    }
  ],
  'Database Engineering': [
    {
      title: 'Database Engineer',
      description: 'Design and optimize database systems',
      keyResponsibilities: ['Schema design', 'Query optimization', 'Data modeling', 'Database scaling'],
      whyItFits: 'Your database skills qualify you for specialized DB roles',
      relevantJobTitles: ['Database Engineer', 'DBA', 'Data Architect', 'Database Developer'],
      baseMatchScore: 92,
      category: 'Database Engineering'
    },
    {
      title: 'Data Platform Engineer',
      description: 'Build data infrastructure and platforms',
      keyResponsibilities: ['Data pipelines', 'ETL processes', 'Data warehousing', 'Platform architecture'],
      whyItFits: 'Backend development skills would enhance your data platform capabilities',
      relevantJobTitles: ['Data Platform Engineer', 'Data Infrastructure Engineer'],
      baseMatchScore: 80,
      category: 'Data Platform Engineering'
    },
    {
      title: 'Backend Developer',
      description: 'Develop server-side applications with database focus',
      keyResponsibilities: ['API development', 'Database integration', 'Performance tuning', 'Data security'],
      whyItFits: 'Your database expertise is a strong foundation for backend development',
      relevantJobTitles: ['Backend Developer', 'Database Developer', 'API Developer'],
      baseMatchScore: 75,
      category: 'Backend Development'
    }
  ],
  'Data Engineering': [
    {
      title: 'Data Engineer',
      description: 'Build data pipelines and infrastructure',
      keyResponsibilities: ['Data pipelines', 'ETL processes', 'Data warehousing', 'Big data processing'],
      whyItFits: 'Your data engineering skills are in high demand',
      relevantJobTitles: ['Data Engineer', 'Big Data Engineer', 'Analytics Engineer', 'ETL Developer'],
      baseMatchScore: 93,
      category: 'Data Engineering'
    },
    {
      title: 'ML Platform Engineer',
      description: 'Build infrastructure for ML systems',
      keyResponsibilities: ['ML pipelines', 'Feature stores', 'Model deployment', 'Data versioning'],
      whyItFits: 'Adding ML knowledge to your data engineering creates a specialized niche',
      relevantJobTitles: ['ML Platform Engineer', 'MLOps Engineer', 'AI Infrastructure Engineer'],
      baseMatchScore: 82,
      category: 'ML Platform Engineering'
    },
    {
      title: 'Data Architect',
      description: 'Design enterprise data architecture',
      keyResponsibilities: ['Data strategy', 'Architecture design', 'Data governance', 'Scalability planning'],
      whyItFits: 'Your data expertise positions you for architecture leadership',
      relevantJobTitles: ['Data Architect', 'Enterprise Data Architect', 'Big Data Architect'],
      baseMatchScore: 85,
      category: 'Data Engineering'
    }
  ],
  'QA & Testing': [
    {
      title: 'SDET (Software Development Engineer in Test)',
      description: 'Build test automation frameworks and tooling',
      keyResponsibilities: ['Test automation', 'Framework development', 'CI/CD integration', 'Quality strategy'],
      whyItFits: 'Your testing and automation skills fit SDET roles',
      relevantJobTitles: ['SDET', 'Test Automation Engineer', 'QA Automation Engineer'],
      baseMatchScore: 91,
      category: 'QA & Testing'
    },
    {
      title: 'QA Lead',
      description: 'Lead quality assurance teams and processes',
      keyResponsibilities: ['Test strategy', 'Team management', 'Process improvement', 'Quality metrics'],
      whyItFits: 'Your testing expertise prepares you for QA leadership',
      relevantJobTitles: ['QA Lead', 'QA Manager', 'Test Lead', 'Quality Engineer'],
      baseMatchScore: 85,
      category: 'QA & Testing'
    },
    {
      title: 'DevOps Engineer',
      description: 'Build CI/CD and automation infrastructure',
      keyResponsibilities: ['Pipeline automation', 'Test integration', 'Release management', 'Infrastructure'],
      whyItFits: 'Your automation skills are a strong foundation for DevOps',
      relevantJobTitles: ['DevOps Engineer', 'Automation Engineer', 'Release Engineer'],
      baseMatchScore: 75,
      category: 'DevOps & Cloud'
    }
  ],
  'Blockchain/Web3': [
    {
      title: 'Blockchain Developer',
      description: 'Build decentralized applications and smart contracts',
      keyResponsibilities: ['Smart contract development', 'DApp creation', 'Web3 integration', 'Security audits'],
      whyItFits: 'Your Web3 skills are perfect for blockchain development',
      relevantJobTitles: ['Blockchain Developer', 'Web3 Developer', 'Solidity Developer', 'Smart Contract Developer'],
      baseMatchScore: 94,
      category: 'Blockchain/Web3'
    },
    {
      title: 'DeFi Developer',
      description: 'Build decentralized finance protocols',
      keyResponsibilities: ['Smart contract development', 'Protocol design', 'Security', 'Yield optimization'],
      whyItFits: 'Your blockchain skills apply well to DeFi development',
      relevantJobTitles: ['DeFi Developer', 'Blockchain Engineer', 'Protocol Developer'],
      baseMatchScore: 88,
      category: 'Blockchain/Web3'
    },
    {
      title: 'Full-Stack Web3 Developer',
      description: 'Build complete dApps with frontend and smart contracts',
      keyResponsibilities: ['Frontend development', 'Smart contracts', 'Web3 integration', 'Wallet integration'],
      whyItFits: 'Frontend skills would make you a complete Web3 developer',
      relevantJobTitles: ['Full-Stack Web3 Developer', 'dApp Developer', 'Web3 Full-Stack Engineer'],
      baseMatchScore: 78,
      category: 'Full-Stack Development'
    }
  ],
  'Game Development': [
    {
      title: 'Game Developer',
      description: 'Create video games using industry-standard engines',
      keyResponsibilities: ['Game programming', 'Engine development', 'Gameplay systems', 'Performance optimization'],
      whyItFits: 'Your game engine skills qualify you for game dev roles',
      relevantJobTitles: ['Game Developer', 'Unity Developer', 'Unreal Developer', 'Gameplay Programmer'],
      baseMatchScore: 93,
      category: 'Game Development'
    },
    {
      title: 'Game Designer',
      description: 'Design game mechanics and systems',
      keyResponsibilities: ['Game mechanics', 'Level design', 'Balance', 'Player experience'],
      whyItFits: 'Your game development background supports design roles',
      relevantJobTitles: ['Game Designer', 'Level Designer', 'Systems Designer'],
      baseMatchScore: 80,
      category: 'Game Development'
    },
    {
      title: 'Graphics Programmer',
      description: 'Develop rendering and graphics systems',
      keyResponsibilities: ['Graphics programming', 'Shader development', 'Rendering optimization', 'Visual effects'],
      whyItFits: 'Your engine skills can specialize into graphics programming',
      relevantJobTitles: ['Graphics Programmer', 'Rendering Engineer', 'Technical Artist'],
      baseMatchScore: 75,
      category: 'Game Development'
    }
  ],
  'Embedded Systems': [
    {
      title: 'Embedded Systems Engineer',
      description: 'Develop firmware and low-level software',
      keyResponsibilities: ['Firmware development', 'Hardware integration', 'RTOS programming', 'Device drivers'],
      whyItFits: 'Your embedded skills qualify you for specialized hardware roles',
      relevantJobTitles: ['Embedded Engineer', 'Firmware Developer', 'IoT Developer', 'Hardware Engineer'],
      baseMatchScore: 92,
      category: 'Embedded Systems'
    },
    {
      title: 'IoT Developer',
      description: 'Build Internet of Things applications and systems',
      keyResponsibilities: ['IoT protocols', 'Sensor integration', 'Cloud connectivity', 'Edge computing'],
      whyItFits: 'Your embedded skills are perfect for IoT development',
      relevantJobTitles: ['IoT Developer', 'IoT Engineer', 'Connected Devices Engineer'],
      baseMatchScore: 88,
      category: 'IoT Platform Engineering'
    },
    {
      title: 'Robotics Engineer',
      description: 'Develop software for robotic systems',
      keyResponsibilities: ['Robot programming', 'Motion control', 'Sensor fusion', 'Autonomous systems'],
      whyItFits: 'Your embedded expertise applies well to robotics',
      relevantJobTitles: ['Robotics Engineer', 'Robot Programmer', 'Automation Engineer'],
      baseMatchScore: 78,
      category: 'Embedded Systems'
    }
  ],
  'Java Development': [
    {
      title: 'Java Developer',
      description: 'Build enterprise applications with Java ecosystem',
      keyResponsibilities: ['Application development', 'API design', 'System architecture', 'Performance optimization'],
      whyItFits: 'Your Java skills are in demand for enterprise development',
      relevantJobTitles: ['Java Developer', 'Software Engineer', 'Backend Developer'],
      baseMatchScore: 90,
      category: 'Java Development'
    }
  ]
};

// ─── Skill Reasons for Missing Skills ─────────────────────────────────

export const skillReasons: Record<string, Record<string, string>> = {
  'Frontend Development': {
    'React': 'Most in-demand frontend framework',
    'TypeScript': 'Adds type safety to JavaScript projects',
    'Redux': 'State management for complex applications',
    'Jest': 'Critical for production code quality',
    'Responsive Design': 'Essential for modern web experiences',
  },
  'Backend Development': {
    'Node.js': 'Versatile runtime for server-side JavaScript',
    'REST APIs': 'Foundation of web service communication',
    'Authentication': 'Protecting APIs and user data is critical',
    'GraphQL': 'Modern query language for APIs',
    'Go': 'High-performance backend language',
  },
  'UI/UX Design': {
    'Figma': 'Industry-standard design tool',
    'Prototyping': 'Essential for user testing',
    'Design Systems': 'Scale design across products',
    'User Research': 'Data-driven design decisions',
    'UX Design': 'Core competency for product roles',
  },
  'AI/ML Engineering': {
    'Python': 'Primary language for ML development',
    'TensorFlow': 'Industry-standard deep learning framework',
    'PyTorch': 'Preferred framework in research and production',
    'MLOps': 'Deploy and scale ML models',
    'Deep Learning': 'Enable complex pattern recognition',
  },
  'DevOps & Cloud': {
    'Docker': 'Container standard for deployment',
    'Kubernetes': 'Orchestrate containers at scale',
    'Terraform': 'Infrastructure as code best practice',
    'CI/CD': 'Automated deployment is essential',
    'AWS': 'Dominant cloud platform',
  },
  'Database Engineering': {
    'SQL': 'Foundation of data querying',
    'PostgreSQL': 'Most advanced open-source database',
    'Database Design': 'Core competency for data roles',
    'Redis': 'Essential caching technology',
  },
};

// ─── Learning Approaches ──────────────────────────────────────────────

export const learningApproaches: Record<string, { title: string; steps: { action: string; description: string }[] }[]> = {
  'Frontend Development': [
    {
      title: 'Deepen Your Frontend Mastery',
      steps: [
        { action: 'Build Real Projects', description: 'Create 3 complex applications using React/Vue with state management' },
        { action: 'Learn TypeScript', description: 'Add type safety to your JavaScript projects systematically' },
        { action: 'Performance Optimization', description: 'Study Core Web Vitals, lazy loading, and code splitting' },
        { action: 'Testing Expertise', description: 'Master Jest, Cypress, and React Testing Library' },
      ]
    },
    {
      title: 'Expand to Full-Stack',
      steps: [
        { action: 'Learn Node.js', description: 'Build REST APIs with Express or NestJS' },
        { action: 'Database Basics', description: 'Understand SQL with PostgreSQL or MySQL' },
        { action: 'Authentication', description: 'Implement JWT, OAuth, and session management' },
        { action: 'Deploy Applications', description: 'Use Docker, AWS, or Vercel for production deployment' },
      ]
    },
    {
      title: 'Career Growth Strategies',
      steps: [
        { action: 'Open Source', description: 'Contribute to React, Vue, or component libraries' },
        { action: 'Technical Writing', description: 'Blog about frontend patterns and solutions' },
        { action: 'Mentorship', description: 'Join communities like Discord, Reddit r/webdev' },
        { action: 'Portfolio', description: 'Showcase 5+ projects with live demos and source code' },
      ]
    }
  ],
  'Backend Development': [
    {
      title: 'Strengthen Backend Foundation',
      steps: [
        { action: 'Master Databases', description: 'Deep dive into PostgreSQL, indexing, and query optimization' },
        { action: 'API Design', description: 'Learn REST best practices and GraphQL fundamentals' },
        { action: 'Authentication', description: 'Implement OAuth 2.0, JWT, and role-based access control' },
        { action: 'Testing', description: 'Unit tests, integration tests, and load testing with JMeter' },
      ]
    },
    {
      title: 'DevOps & Infrastructure',
      steps: [
        { action: 'Docker & Kubernetes', description: 'Containerize applications and orchestrate deployments' },
        { action: 'CI/CD Pipelines', description: 'Set up GitHub Actions or GitLab CI for automated testing' },
        { action: 'Cloud Services', description: 'Deploy on AWS (EC2, Lambda) or Google Cloud Platform' },
        { action: 'Monitoring', description: 'Implement logging with ELK stack and monitoring with Prometheus' },
      ]
    },
    {
      title: 'Architecture & Leadership',
      steps: [
        { action: 'System Design', description: 'Study distributed systems, microservices, and caching strategies' },
        { action: 'Security', description: 'Learn OWASP top 10, encryption, and security best practices' },
        { action: 'Code Reviews', description: 'Practice giving and receiving constructive feedback' },
        { action: 'Mentoring', description: 'Help junior developers grow through pair programming' },
      ]
    }
  ],
  'UI/UX Design': [
    {
      title: 'Perfect Your Design Craft',
      steps: [
        { action: 'Master Figma', description: 'Learn auto-layout, components, and advanced prototyping' },
        { action: 'Design Systems', description: 'Create a complete component library with documentation' },
        { action: 'User Research', description: 'Conduct interviews, usability tests, and analyze data' },
        { action: 'Accessibility', description: 'Study WCAG guidelines and implement inclusive design' },
      ]
    },
    {
      title: 'Bridge Design & Development',
      steps: [
        { action: 'Learn HTML/CSS', description: 'Understand how designs translate to code' },
        { action: 'Basic JavaScript', description: 'Add interactivity knowledge to communicate with developers' },
        { action: 'Design Handoff', description: 'Master tools like Zeplin and proper documentation' },
        { action: 'Version Control', description: 'Learn Git basics for design file management' },
      ]
    },
    {
      title: 'Build Your Design Career',
      steps: [
        { action: 'Portfolio', description: 'Curate 4-6 case studies with process and outcomes' },
        { action: 'Networking', description: 'Join design communities like Dribbble, Behance, ADPList' },
        { action: 'Side Projects', description: 'Redesign existing apps or create concept projects' },
        { action: 'Feedback', description: 'Participate in design critiques and iterate on work' },
      ]
    }
  ],
  'AI/ML Engineering': [
    {
      title: 'Solidify ML Fundamentals',
      steps: [
        { action: 'Mathematics', description: 'Strengthen linear algebra, calculus, and statistics' },
        { action: 'Deep Learning', description: 'Complete fast.ai or deep learning specialization' },
        { action: 'Frameworks', description: 'Master PyTorch and TensorFlow with real datasets' },
        { action: 'MLOps', description: 'Learn model versioning, deployment, and monitoring' },
      ]
    },
    {
      title: 'Specialize Your Skills',
      steps: [
        { action: 'NLP or CV', description: 'Choose NLP (transformers) or Computer Vision (CNNs)' },
        { action: 'Cloud ML', description: 'Use AWS SageMaker, Google AI Platform, or Azure ML' },
        { action: 'Big Data', description: 'Learn Spark, Hadoop for large-scale data processing' },
        { action: 'Optimization', description: 'Study model compression, quantization, and edge deployment' },
      ]
    },
    {
      title: 'Industry Applications',
      steps: [
        { action: 'Kaggle Competitions', description: 'Participate in competitions and share solutions' },
        { action: 'Research Papers', description: 'Read and implement papers from arXiv' },
        { action: 'Open Source', description: 'Contribute to Hugging Face, scikit-learn, or PyTorch' },
        { action: 'Production Systems', description: 'Build end-to-end ML applications with APIs' },
      ]
    }
  ],
  'DevOps & Cloud': [
    {
      title: 'Core DevOps Mastery',
      steps: [
        { action: 'Linux Administration', description: 'Master shell scripting, process management, and networking' },
        { action: 'Docker Deep Dive', description: 'Multi-stage builds, networking, and compose files' },
        { action: 'Kubernetes', description: 'Pods, services, deployments, and Helm charts' },
        { action: 'Infrastructure as Code', description: 'Terraform and Ansible for automated provisioning' },
      ]
    },
    {
      title: 'Cloud Platforms',
      steps: [
        { action: 'AWS Certification', description: 'Prepare for Solutions Architect or DevOps Engineer cert' },
        { action: 'Multi-Cloud', description: 'Understand GCP and Azure equivalents' },
        { action: 'Serverless', description: 'Lambda functions, API Gateway, and event-driven architecture' },
        { action: 'Cost Optimization', description: 'Right-sizing, reserved instances, and budget alerts' },
      ]
    },
    {
      title: 'Security & Reliability',
      steps: [
        { action: 'DevSecOps', description: 'Integrate security scanning into CI/CD pipelines' },
        { action: 'Monitoring', description: 'Prometheus, Grafana, ELK stack for observability' },
        { action: 'Incident Response', description: 'PagerDuty, runbooks, and post-mortem practices' },
        { action: 'Chaos Engineering', description: 'Test resilience with Chaos Monkey or Gremlin' },
      ]
    }
  ],
  'Full-Stack Development': [
    {
      title: 'Master Both Frontend and Backend',
      steps: [
        { action: 'Integrate Technologies', description: 'Build projects that connect React/Vue with Node.js APIs' },
        { action: 'Database Design', description: 'Learn SQL and NoSQL database design patterns' },
        { action: 'API Development', description: 'Create RESTful APIs and GraphQL endpoints' },
        { action: 'Authentication', description: 'Implement JWT, OAuth, and session management' },
      ]
    },
    {
      title: 'Build End-to-End Applications',
      steps: [
        { action: 'Full Projects', description: 'Create complete apps from database to UI' },
        { action: 'Deployment', description: 'Deploy both frontend and backend to production' },
        { action: 'Testing', description: 'Write unit and integration tests for all layers' },
        { action: 'Performance', description: 'Optimize database queries and frontend rendering' },
      ]
    }
  ],
};

// ─── Career Title Map ─────────────────────────────────────────────────

export const careerTitleMap: Record<string, string> = {
  'AI/ML Engineering': 'AI/ML Engineer',
  'UI/UX Design': 'UI/UX Designer',
  'Graphic Design': 'Graphic Designer',
  'Frontend Development': 'Frontend Developer',
  'Backend Development': 'Backend Developer',
  'Full-Stack Development': 'Full-Stack Developer',
  'Database Engineering': 'Database Engineer',
  'DevOps & Cloud': 'DevOps Engineer',
  'Mobile Development': 'Mobile Developer',
  'Cybersecurity': 'Security Engineer',
  'Blockchain/Web3': 'Blockchain Developer',
  'Game Development': 'Game Developer',
  'QA & Testing': 'SDET',
  'Data Engineering': 'Data Engineer',
  'Embedded Systems': 'Embedded Engineer',
  'Java Development': 'Java Developer',
  // Combination roles
  'Design Engineering': 'Design Engineer',
  'Platform Engineering': 'Platform Engineer',
  'Cloud Security Engineering': 'Cloud Security Engineer',
  'AI Backend Engineering': 'AI Backend Engineer',
  'Data Platform Engineering': 'Data Platform Engineer',
  'Product Design Lead': 'Product Design Lead',
  'Mobile Design Lead': 'Mobile Design Lead',
  'ML Platform Engineering': 'ML Platform Engineer',
  'IoT Platform Engineering': 'IoT Platform Engineer',
};

// ─── Default Learning Approach ────────────────────────────────────────

export const defaultLearningApproach = [
  {
    title: 'Build Strong Foundations',
    steps: [
      { action: 'Learn Fundamentals', description: 'Master core concepts in your primary technology stack' },
      { action: 'Practice Daily', description: 'Code or design every day, even if just for 30 minutes' },
      { action: 'Build Projects', description: 'Create portfolio projects that solve real problems' },
      { action: 'Read Documentation', description: 'Study official docs to understand tools deeply' },
    ]
  },
  {
    title: 'Expand Your Knowledge',
    steps: [
      { action: 'Related Technologies', description: 'Learn complementary skills to your main stack' },
      { action: 'Best Practices', description: 'Study design patterns, clean code, and architecture' },
      { action: 'Testing', description: 'Make testing a habit in all your projects' },
      { action: 'Deployment', description: 'Learn how to ship and maintain production applications' },
    ]
  },
  {
    title: 'Professional Growth',
    steps: [
      { action: 'Open Source', description: 'Contribute to projects you use and admire' },
      { action: 'Networking', description: 'Attend meetups, conferences, and join online communities' },
      { action: 'Mentorship', description: 'Find a mentor and mentor others when possible' },
      { action: 'Stay Updated', description: 'Follow industry blogs, newsletters, and podcasts' },
    ]
  }
];
