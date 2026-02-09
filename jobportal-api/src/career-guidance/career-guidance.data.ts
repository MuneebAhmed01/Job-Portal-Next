import { SkillMapping, CareerCategory } from './career-guidance.types';

export interface CareerPath {
  title: string;
  description: string;
  keyResponsibilities: string[];
  whyItFits: string;
  relevantJobTitles: string[];
  matchScore: number;
  category: string;
}

// Skill categories with weights and aliases for fuzzy matching
export const careerCategories: CareerCategory[] = [
  {
    name: 'AI/ML Engineering',
    weightMultiplier: 1.2,
    skills: [
      { canonical: 'Python', aliases: ['python', 'py', 'python3'], weight: 10 },
      { canonical: 'TensorFlow', aliases: ['tensorflow', 'tf', 'tensor flow'], weight: 12 },
      { canonical: 'PyTorch', aliases: ['pytorch', 'torch', 'py torch'], weight: 12 },
      { canonical: 'Machine Learning', aliases: ['machine learning', 'ml', 'machinelearning', 'machin learn'], weight: 15 },
      { canonical: 'Deep Learning', aliases: ['deep learning', 'dl', 'deeplearning', 'deep learn', 'neural networks', 'neural network', 'neural net'], weight: 14 },
      { canonical: 'Computer Vision', aliases: ['computer vision', 'cv', 'opencv', 'image processing'], weight: 11 },
      { canonical: 'NLP', aliases: ['nlp', 'natural language processing', 'natural language', 'text processing', 'llm', 'large language model'], weight: 12 },
      { canonical: 'Keras', aliases: ['keras'], weight: 8 },
      { canonical: 'Scikit-learn', aliases: ['scikit-learn', 'sklearn', 'scikit learn', 'sci-kit'], weight: 9 },
      { canonical: 'Pandas', aliases: ['pandas', 'pd'], weight: 7 },
      { canonical: 'NumPy', aliases: ['numpy', 'np', 'num py'], weight: 7 },
      { canonical: 'Data Science', aliases: ['data science', 'datascience', 'data scientist'], weight: 10 },
      { canonical: 'MLOps', aliases: ['mlops', 'ml ops', 'model deployment'], weight: 10 },
      { canonical: 'Hugging Face', aliases: ['huggingface', 'hugging face', 'transformers'], weight: 9 },
      { canonical: 'AI Frameworks', aliases: ['jax', 'mxnet', 'caffe', 'theano'], weight: 8 },
    ]
  },
  {
    name: 'UI/UX Design',
    weightMultiplier: 1.15,
    skills: [
      { canonical: 'Figma', aliases: ['figma'], weight: 12 },
      { canonical: 'Adobe XD', aliases: ['adobe xd', 'xd', 'adobexd'], weight: 10 },
      { canonical: 'Sketch', aliases: ['sketch'], weight: 9 },
      { canonical: 'UI Design', aliases: ['ui design', 'user interface', 'interface design', 'ui'], weight: 14 },
      { canonical: 'UX Design', aliases: ['ux design', 'user experience', 'experience design', 'ux', 'uxdesign'], weight: 14 },
      { canonical: 'Prototyping', aliases: ['prototyping', 'prototype', 'wireframing', 'wireframe'], weight: 10 },
      { canonical: 'User Research', aliases: ['user research', 'usability testing', 'user testing', 'ux research'], weight: 11 },
      { canonical: 'Design Systems', aliases: ['design systems', 'component library', 'style guide'], weight: 9 },
      { canonical: 'Interaction Design', aliases: ['interaction design', 'motion design', 'microinteractions'], weight: 10 },
      { canonical: 'Adobe Photoshop', aliases: ['photoshop', 'ps', 'adobe photoshop'], weight: 7 },
      { canonical: 'Adobe Illustrator', aliases: ['illustrator', 'ai', 'adobe illustrator'], weight: 7 },
      { canonical: 'InVision', aliases: ['invision', 'invision studio'], weight: 8 },
      { canonical: 'Framer', aliases: ['framer'], weight: 8 },
    ]
  },
  {
    name: 'Graphic Design',
    weightMultiplier: 1.1,
    skills: [
      { canonical: 'Adobe Photoshop', aliases: ['photoshop', 'ps', 'adobe photoshop', 'photo shop'], weight: 12 },
      { canonical: 'Adobe Illustrator', aliases: ['illustrator', 'ai', 'adobe illustrator', 'illustator'], weight: 12 },
      { canonical: 'Adobe InDesign', aliases: ['indesign', 'in design', 'adobe indesign'], weight: 10 },
      { canonical: 'Branding', aliases: ['branding', 'brand design', 'brand identity', 'logo design'], weight: 11 },
      { canonical: 'Typography', aliases: ['typography', 'fonts', 'type design'], weight: 9 },
      { canonical: 'Color Theory', aliases: ['color theory', 'color psychology', 'palette design'], weight: 8 },
      { canonical: 'Print Design', aliases: ['print design', 'publishing', 'layout design'], weight: 9 },
      { canonical: 'Digital Illustration', aliases: ['illustration', 'digital art', 'vector art', 'drawing'], weight: 10 },
      { canonical: 'Canva', aliases: ['canva'], weight: 6 },
      { canonical: 'CorelDRAW', aliases: ['coreldraw', 'corel draw', 'corel'], weight: 8 },
      { canonical: 'Affinity Designer', aliases: ['affinity designer', 'affinity'], weight: 7 },
    ]
  },
  {
    name: 'Frontend Development',
    weightMultiplier: 1.0,
    skills: [
      { canonical: 'React', aliases: ['react', 'reactjs', 'react.js', 'jsx'], weight: 12 },
      { canonical: 'Vue.js', aliases: ['vue', 'vuejs', 'vue.js'], weight: 11 },
      { canonical: 'Angular', aliases: ['angular', 'angularjs', 'ng'], weight: 11 },
      { canonical: 'TypeScript', aliases: ['typescript', 'ts', 'type script'], weight: 10 },
      { canonical: 'JavaScript', aliases: ['javascript', 'js', 'java script', 'ecmascript', 'es6', 'es2015'], weight: 10 },
      { canonical: 'HTML5', aliases: ['html', 'html5', 'markup'], weight: 9 },
      { canonical: 'CSS3', aliases: ['css', 'css3', 'stylesheets', 'styling'], weight: 9 },
      { canonical: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss', 'tailwind css'], weight: 10 },
      { canonical: 'Next.js', aliases: ['nextjs', 'next.js', 'next'], weight: 11 },
      { canonical: 'Svelte', aliases: ['svelte', 'svetle'], weight: 9 },
      { canonical: 'Redux', aliases: ['redux', 'redux toolkit', 'rtk'], weight: 9 },
      { canonical: 'Webpack', aliases: ['webpack', 'vite', 'rollup', 'parcel', 'bundler'], weight: 7 },
      { canonical: 'Jest', aliases: ['jest', 'testing library', 'react testing library'], weight: 8 },
      { canonical: 'SASS/SCSS', aliases: ['sass', 'scss', 'less', 'css preprocessor'], weight: 7 },
      { canonical: 'Responsive Design', aliases: ['responsive', 'mobile first', 'adaptive design'], weight: 8 },
    ]
  },
  {
    name: 'Backend Development',
    weightMultiplier: 1.0,
    skills: [
      { canonical: 'Node.js', aliases: ['node', 'nodejs', 'node.js', 'ndejs', 'nodjs', 'nods'], weight: 12 },
      { canonical: 'Express.js', aliases: ['express', 'expressjs', 'express.js'], weight: 10 },
      { canonical: 'NestJS', aliases: ['nestjs', 'nest.js', 'nest'], weight: 10 },
      { canonical: 'Python', aliases: ['python', 'py', 'python3', 'py3'], weight: 11 },
      { canonical: 'Django', aliases: ['django'], weight: 10 },
      { canonical: 'Flask', aliases: ['flask'], weight: 8 },
      { canonical: 'FastAPI', aliases: ['fastapi', 'fast api'], weight: 9 },
      { canonical: 'Java', aliases: ['java', 'core java', 'java8', 'java11'], weight: 11 },
      { canonical: 'Spring Boot', aliases: ['spring', 'springboot', 'spring boot', 'spring framework'], weight: 10 },
      { canonical: 'C#', aliases: ['c#', 'csharp', 'c sharp', '.net', 'dotnet', 'dot net'], weight: 10 },
      { canonical: 'Go', aliases: ['go', 'golang', 'go lang'], weight: 9 },
      { canonical: 'Ruby on Rails', aliases: ['ruby', 'rails', 'ruby on rails', 'ror'], weight: 8 },
      { canonical: 'PHP', aliases: ['php', 'laravel', 'symfony', 'codeigniter'], weight: 8 },
      { canonical: 'REST APIs', aliases: ['rest', 'rest api', 'restful', 'api design'], weight: 10 },
      { canonical: 'GraphQL', aliases: ['graphql', 'graph ql', 'apollo'], weight: 9 },
      { canonical: 'gRPC', aliases: ['grpc'], weight: 8 },
    ]
  },
  {
    name: 'Database Engineering',
    weightMultiplier: 1.05,
    skills: [
      { canonical: 'PostgreSQL', aliases: ['postgresql', 'postgres', 'psql', 'pg'], weight: 11 },
      { canonical: 'MongoDB', aliases: ['mongodb', 'mongo', 'mongo db', 'nosql'], weight: 10 },
      { canonical: 'MySQL', aliases: ['mysql', 'my sql', 'sql'], weight: 10 },
      { canonical: 'Redis', aliases: ['redis', 'caching', 'cache'], weight: 9 },
      { canonical: 'Elasticsearch', aliases: ['elasticsearch', 'elastic search', 'es'], weight: 8 },
      { canonical: 'Prisma', aliases: ['prisma', 'orm'], weight: 8 },
      { canonical: 'TypeORM', aliases: ['typeorm', 'type orm'], weight: 7 },
      { canonical: 'Sequelize', aliases: ['sequelize', 'sequel'], weight: 7 },
      { canonical: 'Database Design', aliases: ['database design', 'schema design', 'db design', 'normalization'], weight: 10 },
      { canonical: 'SQL', aliases: ['sql', 'structured query language', 't-sql', 'plsql'], weight: 10 },
      { canonical: 'Cassandra', aliases: ['cassandra'], weight: 7 },
      { canonical: 'DynamoDB', aliases: ['dynamodb', 'dynamo db', 'aws dynamodb'], weight: 8 },
    ]
  },
  {
    name: 'DevOps & Cloud',
    weightMultiplier: 1.1,
    skills: [
      { canonical: 'Docker', aliases: ['docker', 'containerization', 'containers'], weight: 11 },
      { canonical: 'Kubernetes', aliases: ['kubernetes', 'k8s', 'kube', 'kubectl'], weight: 12 },
      { canonical: 'AWS', aliases: ['aws', 'amazon web services', 'amazon cloud', 'ec2', 's3', 'lambda'], weight: 12 },
      { canonical: 'Azure', aliases: ['azure', 'microsoft azure', 'ms azure'], weight: 11 },
      { canonical: 'GCP', aliases: ['gcp', 'google cloud', 'google cloud platform'], weight: 11 },
      { canonical: 'CI/CD', aliases: ['ci/cd', 'cicd', 'ci cd', 'continuous integration', 'continuous deployment', 'jenkins', 'github actions', 'gitlab ci'], weight: 11 },
      { canonical: 'Terraform', aliases: ['terraform', 'infrastructure as code', 'iac'], weight: 10 },
      { canonical: 'Ansible', aliases: ['ansible', 'configuration management'], weight: 8 },
      { canonical: 'Linux', aliases: ['linux', 'unix', 'bash', 'shell scripting', 'ubuntu', 'centos'], weight: 9 },
      { canonical: 'Monitoring', aliases: ['prometheus', 'grafana', 'datadog', 'new relic', 'monitoring'], weight: 8 },
      { canonical: 'Git', aliases: ['git', 'github', 'gitlab', 'bitbucket', 'version control'], weight: 8 },
      { canonical: 'Nginx', aliases: ['nginx', 'apache', 'web server', 'reverse proxy'], weight: 7 },
    ]
  },
  {
    name: 'Mobile Development',
    weightMultiplier: 1.0,
    skills: [
      { canonical: 'React Native', aliases: ['react native', 'reactnative', 'rn'], weight: 12 },
      { canonical: 'Flutter', aliases: ['flutter', 'dart'], weight: 11 },
      { canonical: 'Swift', aliases: ['swift', 'ios', 'ios development'], weight: 11 },
      { canonical: 'Kotlin', aliases: ['kotlin', 'android', 'android development'], weight: 11 },
      { canonical: 'iOS', aliases: ['ios', 'iphone', 'ipad', 'apple development'], weight: 10 },
      { canonical: 'Android', aliases: ['android', 'java android'], weight: 10 },
      { canonical: 'Mobile UI', aliases: ['mobile ui', 'mobile design', 'app design'], weight: 9 },
      { canonical: 'Expo', aliases: ['expo'], weight: 7 },
      { canonical: 'Ionic', aliases: ['ionic', 'cordova', 'phonegap'], weight: 6 },
    ]
  },
  {
    name: 'Cybersecurity',
    weightMultiplier: 1.15,
    skills: [
      { canonical: 'Penetration Testing', aliases: ['penetration testing', 'pen testing', 'pentest', 'ethical hacking'], weight: 12 },
      { canonical: 'Network Security', aliases: ['network security', 'firewall', 'ids/ips'], weight: 11 },
      { canonical: 'Cryptography', aliases: ['cryptography', 'encryption', 'ssl/tls', 'certificates'], weight: 10 },
      { canonical: 'Security Auditing', aliases: ['security audit', 'vulnerability assessment', 'security assessment'], weight: 11 },
      { canonical: 'OWASP', aliases: ['owasp', 'web security', 'application security', 'appsec'], weight: 10 },
      { canonical: 'SIEM', aliases: ['siem', 'splunk', 'security monitoring'], weight: 9 },
      { canonical: 'Identity Management', aliases: ['iam', 'identity access management', 'oauth', 'sso', 'authentication'], weight: 9 },
      { canonical: 'Cloud Security', aliases: ['cloud security', 'aws security', 'azure security'], weight: 10 },
    ]
  },
  {
    name: 'Blockchain/Web3',
    weightMultiplier: 1.1,
    skills: [
      { canonical: 'Solidity', aliases: ['solidity', 'sol'], weight: 12 },
      { canonical: 'Ethereum', aliases: ['ethereum', 'eth', 'evm'], weight: 11 },
      { canonical: 'Smart Contracts', aliases: ['smart contracts', 'smartcontract', 'contract development'], weight: 12 },
      { canonical: 'Web3.js', aliases: ['web3', 'web3.js', 'ethers.js', 'ethers'], weight: 10 },
      { canonical: 'DeFi', aliases: ['defi', 'decentralized finance'], weight: 9 },
      { canonical: 'NFT', aliases: ['nft', 'non-fungible token', 'nft development'], weight: 8 },
      { canonical: 'Hyperledger', aliases: ['hyperledger', 'fabric', 'enterprise blockchain'], weight: 8 },
      { canonical: 'Rust', aliases: ['rust', 'rustlang', 'solana', 'near protocol'], weight: 9 },
    ]
  },
  {
    name: 'Game Development',
    weightMultiplier: 1.0,
    skills: [
      { canonical: 'Unity', aliases: ['unity', 'unity3d', 'unity 3d'], weight: 12 },
      { canonical: 'Unreal Engine', aliases: ['unreal', 'unreal engine', 'ue4', 'ue5'], weight: 12 },
      { canonical: 'C++', aliases: ['c++', 'cpp', 'c plus plus'], weight: 11 },
      { canonical: 'C#', aliases: ['c#', 'csharp', 'unity scripting'], weight: 10 },
      { canonical: 'Game Design', aliases: ['game design', 'level design', 'game mechanics'], weight: 10 },
      { canonical: 'Blender', aliases: ['blender', '3d modeling', '3d art'], weight: 9 },
      { canonical: 'Godot', aliases: ['godot'], weight: 8 },
      { canonical: 'Game Physics', aliases: ['physics', 'game physics', 'collision detection'], weight: 8 },
    ]
  },
  {
    name: 'QA & Testing',
    weightMultiplier: 0.95,
    skills: [
      { canonical: 'Selenium', aliases: ['selenium', 'webdriver'], weight: 10 },
      { canonical: 'Cypress', aliases: ['cypress', 'e2e testing', 'end to end testing'], weight: 10 },
      { canonical: 'JUnit', aliases: ['junit', 'testng', 'java testing'], weight: 8 },
      { canonical: 'Test Automation', aliases: ['test automation', 'automated testing', 'automation framework'], weight: 11 },
      { canonical: 'Performance Testing', aliases: ['performance testing', 'load testing', 'jmeter', 'k6'], weight: 9 },
      { canonical: 'Manual Testing', aliases: ['manual testing', 'test cases', 'test plans'], weight: 8 },
      { canonical: 'API Testing', aliases: ['api testing', 'postman', 'rest assured'], weight: 9 },
      { canonical: 'BDD/TDD', aliases: ['bdd', 'tdd', 'behavior driven', 'test driven'], weight: 8 },
    ]
  },
  {
    name: 'Data Engineering',
    weightMultiplier: 1.1,
    skills: [
      { canonical: 'Apache Spark', aliases: ['spark', 'apache spark', 'pyspark'], weight: 11 },
      { canonical: 'Hadoop', aliases: ['hadoop', 'hdfs', 'mapreduce'], weight: 9 },
      { canonical: 'Kafka', aliases: ['kafka', 'apache kafka', 'event streaming'], weight: 10 },
      { canonical: 'Airflow', aliases: ['airflow', 'apache airflow', 'workflow orchestration'], weight: 9 },
      { canonical: 'ETL', aliases: ['etl', 'extract transform load', 'data pipeline'], weight: 10 },
      { canonical: 'Data Warehouse', aliases: ['data warehouse', 'snowflake', 'redshift', 'bigquery', 'dwh'], weight: 10 },
      { canonical: 'dbt', aliases: ['dbt', 'data build tool'], weight: 8 },
      { canonical: 'Apache Airflow', aliases: ['prefect', 'dagster'], weight: 7 },
    ]
  },
  {
    name: 'Embedded Systems',
    weightMultiplier: 1.0,
    skills: [
      { canonical: 'C', aliases: ['c', 'c language', 'embedded c'], weight: 11 },
      { canonical: 'C++', aliases: ['c++', 'cpp', 'embedded cpp'], weight: 10 },
      { canonical: 'Microcontrollers', aliases: ['microcontroller', 'mcu', 'arduino', 'raspberry pi', 'rpi'], weight: 10 },
      { canonical: 'RTOS', aliases: ['rtos', 'real time os', 'free rtos', 'freertos'], weight: 9 },
      { canonical: 'Embedded Linux', aliases: ['embedded linux', 'yocto', 'buildroot'], weight: 9 },
      { canonical: 'IoT', aliases: ['iot', 'internet of things', 'sensor', 'actuator'], weight: 9 },
      { canonical: 'FPGA', aliases: ['fpga', 'vhdl', 'verilog', 'hdl'], weight: 8 },
      { canonical: 'ARM', aliases: ['arm', 'arm cortex', 'stm32'], weight: 8 },
    ]
  },
];

// Career path definitions
export const careerPaths: Record<string, CareerPath[]> = {
  'Frontend Development': [
    {
      title: 'Senior Frontend Developer',
      description: 'Build complex web applications with modern frameworks',
      keyResponsibilities: ['Component architecture', 'Performance optimization', 'State management', 'UI implementation'],
      whyItFits: 'Your frontend framework expertise qualifies you for senior roles',
      relevantJobTitles: ['Frontend Developer', 'Senior Frontend Engineer', 'UI Developer', 'React Developer'],
      matchScore: 94,
      category: 'Frontend Development'
    },
    {
      title: 'Full-Stack Developer',
      description: 'Build end-to-end applications combining frontend and backend skills',
      keyResponsibilities: ['Frontend development', 'Backend API integration', 'Database design', 'Deployment'],
      whyItFits: 'Adding backend skills to your frontend expertise opens full-stack opportunities',
      relevantJobTitles: ['Full-Stack Developer', 'MERN Stack Developer', 'JavaScript Full-Stack Engineer'],
      matchScore: 82,
      category: 'Full-Stack Development'
    },
    {
      title: 'Frontend Architect',
      description: 'Design frontend systems and establish best practices',
      keyResponsibilities: ['Architecture decisions', 'Technical leadership', 'Code standards', 'Performance strategy'],
      whyItFits: 'Your broad frontend knowledge positions you for architecture roles',
      relevantJobTitles: ['Frontend Architect', 'Principal Frontend Engineer', 'UI Architect'],
      matchScore: 78,
      category: 'Frontend Development'
    }
  ],
  'Backend Development': [
    {
      title: 'Senior Backend Developer',
      description: 'Build scalable server-side applications',
      keyResponsibilities: ['API development', 'Database design', 'System architecture', 'Performance tuning'],
      whyItFits: 'Your backend skills are perfect for senior development roles',
      relevantJobTitles: ['Backend Developer', 'Senior Backend Engineer', 'API Developer', 'Server Developer'],
      matchScore: 93,
      category: 'Backend Development'
    },
    {
      title: 'Full-Stack Developer',
      description: 'Build complete applications with both frontend and backend',
      keyResponsibilities: ['Server-side logic', 'Client-side integration', 'Database management', 'API design'],
      whyItFits: 'Learning frontend technologies would make you a versatile full-stack developer',
      relevantJobTitles: ['Full-Stack Developer', 'Software Engineer', 'Web Developer'],
      matchScore: 75,
      category: 'Full-Stack Development'
    },
    {
      title: 'Platform Engineer',
      description: 'Build internal platforms and developer tools',
      keyResponsibilities: ['Platform architecture', 'Developer experience', 'Infrastructure APIs', 'System reliability'],
      whyItFits: 'Your backend expertise extends well to platform engineering',
      relevantJobTitles: ['Platform Engineer', 'Infrastructure Engineer', 'Backend Platform Engineer'],
      matchScore: 80,
      category: 'Platform Engineering'
    }
  ],
  'UI/UX Design': [
    {
      title: 'Senior UI/UX Designer',
      description: 'Lead design initiatives and create exceptional user experiences',
      keyResponsibilities: ['User research', 'Wireframing and prototyping', 'Design systems', 'Usability testing'],
      whyItFits: 'Your UI/UX tool expertise positions you for senior design roles',
      relevantJobTitles: ['UI/UX Designer', 'Product Designer', 'Interaction Designer', 'Experience Designer'],
      matchScore: 95,
      category: 'UI/UX Design'
    },
    {
      title: 'Design Engineer',
      description: 'Bridge design and development with frontend coding skills',
      keyResponsibilities: ['Design implementation', 'Component libraries', 'Design system maintenance', 'Prototyping'],
      whyItFits: 'Learning frontend development would make you a powerful design engineer',
      relevantJobTitles: ['Design Engineer', 'Design Technologist', 'Creative Developer'],
      matchScore: 78,
      category: 'Design Engineering'
    },
    {
      title: 'Product Designer',
      description: 'Design end-to-end product experiences',
      keyResponsibilities: ['Product strategy', 'Design execution', 'Cross-functional collaboration', 'Design metrics'],
      whyItFits: 'Your broad design skills fit product design perfectly',
      relevantJobTitles: ['Product Designer', 'Digital Product Designer', 'UX Product Designer'],
      matchScore: 88,
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
      matchScore: 95,
      category: 'AI/ML Engineering'
    },
    {
      title: 'AI Backend Engineer',
      description: 'Build backend systems for AI applications',
      keyResponsibilities: ['API development for ML', 'Model serving infrastructure', 'Data pipelines', 'Scalable architectures'],
      whyItFits: 'Combining backend skills with AI expertise creates a specialized niche',
      relevantJobTitles: ['AI Backend Engineer', 'ML Platform Engineer', 'AI Infrastructure Engineer'],
      matchScore: 85,
      category: 'AI Backend Engineering'
    },
    {
      title: 'Data Scientist',
      description: 'Analyze complex data and build predictive models',
      keyResponsibilities: ['Statistical analysis', 'Predictive modeling', 'Data visualization', 'Business insights'],
      whyItFits: 'Your data science and ML skills align well with data science roles',
      relevantJobTitles: ['Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Quantitative Analyst'],
      matchScore: 88,
      category: 'AI/ML Engineering'
    }
  ],
  'Graphic Design': [
    {
      title: 'Senior Graphic Designer',
      description: 'Create visual content for brands and media',
      keyResponsibilities: ['Brand design', 'Marketing materials', 'Digital illustrations', 'Print design'],
      whyItFits: 'Your Adobe Creative Suite skills are ideal for graphic design',
      relevantJobTitles: ['Graphic Designer', 'Visual Designer', 'Brand Designer', 'Creative Designer'],
      matchScore: 93,
      category: 'Graphic Design'
    },
    {
      title: 'UI/UX Designer',
      description: 'Transition into digital product design',
      keyResponsibilities: ['Interface design', 'User research', 'Prototyping', 'Design systems'],
      whyItFits: 'Your visual design skills are a strong foundation for UI/UX work',
      relevantJobTitles: ['UI Designer', 'Visual UI Designer', 'Digital Designer'],
      matchScore: 75,
      category: 'UI/UX Design'
    },
    {
      title: 'Art Director',
      description: 'Lead visual creative direction for projects',
      keyResponsibilities: ['Creative vision', 'Team leadership', 'Client presentations', 'Brand strategy'],
      whyItFits: 'Your strong design foundation can lead to art direction',
      relevantJobTitles: ['Art Director', 'Creative Director', 'Visual Director'],
      matchScore: 70,
      category: 'Graphic Design'
    }
  ],
  'DevOps & Cloud': [
    {
      title: 'Senior DevOps Engineer',
      description: 'Build and maintain CI/CD and cloud infrastructure',
      keyResponsibilities: ['CI/CD pipelines', 'Cloud architecture', 'Infrastructure automation', 'Monitoring'],
      whyItFits: 'Your DevOps and cloud skills are in high demand',
      relevantJobTitles: ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'Platform Engineer'],
      matchScore: 94,
      category: 'DevOps & Cloud'
    },
    {
      title: 'Cloud Security Engineer',
      description: 'Secure cloud infrastructure and applications',
      keyResponsibilities: ['Cloud security architecture', 'Compliance', 'Security automation', 'Risk assessment'],
      whyItFits: 'Adding security expertise to your cloud skills creates a valuable specialization',
      relevantJobTitles: ['Cloud Security Engineer', 'DevSecOps Engineer', 'Security Architect'],
      matchScore: 82,
      category: 'Cloud Security Engineering'
    },
    {
      title: 'Cloud Architect',
      description: 'Design cloud infrastructure and migration strategies',
      keyResponsibilities: ['Cloud strategy', 'Architecture design', 'Cost optimization', 'Security compliance'],
      whyItFits: 'Your cloud expertise positions you for architecture roles',
      relevantJobTitles: ['Cloud Architect', 'AWS/Azure/GCP Architect', 'Solutions Architect'],
      matchScore: 85,
      category: 'DevOps & Cloud'
    }
  ],
  'Mobile Development': [
    {
      title: 'Senior Mobile Developer',
      description: 'Build native and cross-platform mobile applications',
      keyResponsibilities: ['Mobile app development', 'Performance optimization', 'Native integrations', 'App store deployment'],
      whyItFits: 'Your mobile development skills qualify you for senior roles',
      relevantJobTitles: ['Mobile Developer', 'iOS Developer', 'Android Developer', 'React Native Developer'],
      matchScore: 93,
      category: 'Mobile Development'
    },
    {
      title: 'Mobile Tech Lead',
      description: 'Lead mobile development teams and architecture',
      keyResponsibilities: ['Technical leadership', 'Architecture decisions', 'Code reviews', 'Team mentoring'],
      whyItFits: 'Your mobile expertise prepares you for leadership roles',
      relevantJobTitles: ['Mobile Tech Lead', 'Senior Mobile Engineer', 'Mobile Architect'],
      matchScore: 85,
      category: 'Mobile Development'
    },
    {
      title: 'Full-Stack Mobile Developer',
      description: 'Build complete mobile apps with backend services',
      keyResponsibilities: ['Mobile frontend', 'Backend APIs', 'Database integration', 'Push notifications'],
      whyItFits: 'Backend skills would complement your mobile expertise for end-to-end development',
      relevantJobTitles: ['Full-Stack Mobile Developer', 'Mobile Backend Developer'],
      matchScore: 72,
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
      matchScore: 95,
      category: 'Cybersecurity'
    },
    {
      title: 'Penetration Tester',
      description: 'Identify security vulnerabilities through ethical hacking',
      keyResponsibilities: ['Vulnerability assessment', 'Penetration testing', 'Security reports', 'Remediation guidance'],
      whyItFits: 'Your penetration testing skills are highly specialized',
      relevantJobTitles: ['Penetration Tester', 'Ethical Hacker', 'Security Consultant'],
      matchScore: 90,
      category: 'Cybersecurity'
    },
    {
      title: 'DevSecOps Engineer',
      description: 'Integrate security into CI/CD pipelines',
      keyResponsibilities: ['Security automation', 'Pipeline integration', 'Vulnerability scanning', 'Compliance'],
      whyItFits: 'Adding DevOps skills to your security expertise creates a high-demand role',
      relevantJobTitles: ['DevSecOps Engineer', 'Security Automation Engineer'],
      matchScore: 78,
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
      matchScore: 92,
      category: 'Database Engineering'
    },
    {
      title: 'Data Platform Engineer',
      description: 'Build data infrastructure and platforms',
      keyResponsibilities: ['Data pipelines', 'ETL processes', 'Data warehousing', 'Platform architecture'],
      whyItFits: 'Backend development skills would enhance your data platform capabilities',
      relevantJobTitles: ['Data Platform Engineer', 'Data Infrastructure Engineer'],
      matchScore: 80,
      category: 'Data Platform Engineering'
    },
    {
      title: 'Backend Developer',
      description: 'Develop server-side applications with database focus',
      keyResponsibilities: ['API development', 'Database integration', 'Performance tuning', 'Data security'],
      whyItFits: 'Your database expertise is a strong foundation for backend development',
      relevantJobTitles: ['Backend Developer', 'Database Developer', 'API Developer'],
      matchScore: 75,
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
      matchScore: 93,
      category: 'Data Engineering'
    },
    {
      title: 'ML Platform Engineer',
      description: 'Build infrastructure for ML systems',
      keyResponsibilities: ['ML pipelines', 'Feature stores', 'Model deployment', 'Data versioning'],
      whyItFits: 'Adding ML knowledge to your data engineering creates a specialized niche',
      relevantJobTitles: ['ML Platform Engineer', 'MLOps Engineer', 'AI Infrastructure Engineer'],
      matchScore: 82,
      category: 'ML Platform Engineering'
    },
    {
      title: 'Data Architect',
      description: 'Design enterprise data architecture',
      keyResponsibilities: ['Data strategy', 'Architecture design', 'Data governance', 'Scalability planning'],
      whyItFits: 'Your data expertise positions you for architecture leadership',
      relevantJobTitles: ['Data Architect', 'Enterprise Data Architect', 'Big Data Architect'],
      matchScore: 85,
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
      matchScore: 91,
      category: 'QA & Testing'
    },
    {
      title: 'QA Lead',
      description: 'Lead quality assurance teams and processes',
      keyResponsibilities: ['Test strategy', 'Team management', 'Process improvement', 'Quality metrics'],
      whyItFits: 'Your testing expertise prepares you for QA leadership',
      relevantJobTitles: ['QA Lead', 'QA Manager', 'Test Lead', 'Quality Engineer'],
      matchScore: 85,
      category: 'QA & Testing'
    },
    {
      title: 'DevOps Engineer',
      description: 'Build CI/CD and automation infrastructure',
      keyResponsibilities: ['Pipeline automation', 'Test integration', 'Release management', 'Infrastructure'],
      whyItFits: 'Your automation skills are a strong foundation for DevOps',
      relevantJobTitles: ['DevOps Engineer', 'Automation Engineer', 'Release Engineer'],
      matchScore: 75,
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
      matchScore: 94,
      category: 'Blockchain/Web3'
    },
    {
      title: 'DeFi Developer',
      description: 'Build decentralized finance protocols',
      keyResponsibilities: ['Smart contract development', 'Protocol design', 'Security', 'Yield optimization'],
      whyItFits: 'Your blockchain skills apply well to DeFi development',
      relevantJobTitles: ['DeFi Developer', 'Blockchain Engineer', 'Protocol Developer'],
      matchScore: 88,
      category: 'Blockchain/Web3'
    },
    {
      title: 'Full-Stack Web3 Developer',
      description: 'Build complete dApps with frontend and smart contracts',
      keyResponsibilities: ['Frontend development', 'Smart contracts', 'Web3 integration', 'Wallet integration'],
      whyItFits: 'Frontend skills would make you a complete Web3 developer',
      relevantJobTitles: ['Full-Stack Web3 Developer', 'dApp Developer', 'Web3 Full-Stack Engineer'],
      matchScore: 78,
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
      matchScore: 93,
      category: 'Game Development'
    },
    {
      title: 'Game Designer',
      description: 'Design game mechanics and systems',
      keyResponsibilities: ['Game mechanics', 'Level design', 'Balance', 'Player experience'],
      whyItFits: 'Your game development background supports design roles',
      relevantJobTitles: ['Game Designer', 'Level Designer', 'Systems Designer'],
      matchScore: 80,
      category: 'Game Development'
    },
    {
      title: 'Graphics Programmer',
      description: 'Develop rendering and graphics systems',
      keyResponsibilities: ['Graphics programming', 'Shader development', 'Rendering optimization', 'Visual effects'],
      whyItFits: 'Your engine skills can specialize into graphics programming',
      relevantJobTitles: ['Graphics Programmer', 'Rendering Engineer', 'Technical Artist'],
      matchScore: 75,
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
      matchScore: 92,
      category: 'Embedded Systems'
    },
    {
      title: 'IoT Developer',
      description: 'Build Internet of Things applications and systems',
      keyResponsibilities: ['IoT protocols', 'Sensor integration', 'Cloud connectivity', 'Edge computing'],
      whyItFits: 'Your embedded skills are perfect for IoT development',
      relevantJobTitles: ['IoT Developer', 'IoT Engineer', 'Connected Devices Engineer'],
      matchScore: 88,
      category: 'IoT Platform Engineering'
    },
    {
      title: 'Robotics Engineer',
      description: 'Develop software for robotic systems',
      keyResponsibilities: ['Robot programming', 'Motion control', 'Sensor fusion', 'Autonomous systems'],
      whyItFits: 'Your embedded expertise applies well to robotics',
      relevantJobTitles: ['Robotics Engineer', 'Robot Programmer', 'Automation Engineer'],
      matchScore: 78,
      category: 'Embedded Systems'
    }
  ]
};

// Combination roles for hybrid skill sets
export const combinationRoles = [
  { categories: ['Frontend Development', 'Backend Development'], result: 'Full-Stack Development', weight: 1.3 },
  { categories: ['AI/ML Engineering', 'Data Engineering'], result: 'ML Platform Engineering', weight: 1.25 },
  { categories: ['DevOps & Cloud', 'Backend Development'], result: 'Platform Engineering', weight: 1.2 },
  { categories: ['UI/UX Design', 'Frontend Development'], result: 'Design Engineering', weight: 1.2 },
  { categories: ['Cybersecurity', 'DevOps & Cloud'], result: 'Cloud Security Engineering', weight: 1.25 },
  { categories: ['AI/ML Engineering', 'Backend Development'], result: 'AI Backend Engineering', weight: 1.2 },
  { categories: ['Database Engineering', 'Backend Development'], result: 'Data Platform Engineering', weight: 1.15 },
  { categories: ['Graphic Design', 'UI/UX Design'], result: 'Product Design Lead', weight: 1.2 },
  { categories: ['Mobile Development', 'UI/UX Design'], result: 'Mobile Design Lead', weight: 1.15 },
  { categories: ['Embedded Systems', 'DevOps & Cloud'], result: 'IoT Platform Engineering', weight: 1.2 },
];

// Skill reasons for missing skills
export const skillReasons: Record<string, Record<string, string>> = {
  'Frontend Development': {
    'TypeScript': 'Adds type safety to JavaScript projects',
    'Testing': 'Critical for production code quality',
    'Performance': 'Essential for fast user experiences',
    'Redux': 'State management for complex applications',
  },
  'Backend Development': {
    'Docker': 'Containerization is industry standard',
    'CI/CD': 'Automated deployment is essential',
    'Testing': 'Backend reliability requires thorough testing',
    'Security': 'Protecting APIs and data is critical',
  },
  'UI/UX Design': {
    'Figma': 'Industry-standard design tool',
    'Prototyping': 'Essential for user testing',
    'Design Systems': 'Scale design across products',
    'User Research': 'Data-driven design decisions',
  },
  'AI/ML Engineering': {
    'MLOps': 'Deploy and scale ML models',
    'Cloud': 'Train models on scalable infrastructure',
    'Docker': 'Containerize ML applications',
    'Testing': 'Ensure model reliability',
  },
  'DevOps & Cloud': {
    'Kubernetes': 'Orchestrate containers at scale',
    'Terraform': 'Infrastructure as code best practice',
    'Monitoring': 'Ensure system reliability',
    'Security': 'Secure cloud infrastructure',
  },
};

// Learning approaches per category
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
};

// Career title mappings
export const careerTitleMap: Record<string, string> = {
  'AI/ML Engineering': 'AI/ML Engineer',
  'UI/UX Design': 'UI/UX Designer',
  'Graphic Design': 'Graphic Designer',
  'Frontend Development': 'Frontend Developer',
  'Backend Development': 'Backend Developer',
  'Database Engineering': 'Database Engineer',
  'DevOps & Cloud': 'DevOps Engineer',
  'Mobile Development': 'Mobile Developer',
  'Cybersecurity': 'Security Engineer',
  'Blockchain/Web3': 'Blockchain Developer',
  'Game Development': 'Game Developer',
  'QA & Testing': 'SDET',
  'Data Engineering': 'Data Engineer',
  'Embedded Systems': 'Embedded Engineer',
};

// Default learning approach for unknown categories
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
