import { PrismaClient } from '../src/lib/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:zain1234@localhost:5432/next-jobportal',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // Create a dummy employer user first
  const employer = await prisma.user.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      email: 'employer@demo.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      name: 'Demo Company',
      role: 'EMPLOYER',
    },
  });

  console.log('Created employer:', employer);

  // Create dummy jobs
  const jobs = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      salary: '$120,000 - $180,000',
      type: 'FULL_TIME',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
      employerId: employer.id,
    },
    {
      title: 'Backend Engineer',
      company: 'Data Systems Inc',
      location: 'New York, NY',
      salary: '$130,000 - $190,000',
      type: 'FULL_TIME',
      description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js, Python, or Go is required. Knowledge of databases and cloud services is a plus.',
      employerId: employer.id,
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupHub',
      location: 'Remote',
      salary: '$100,000 - $150,000',
      type: 'REMOTE',
      description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend. Experience with MERN stack or similar technologies required.',
      employerId: employer.id,
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Austin, TX',
      salary: '$110,000 - $160,000',
      type: 'FULL_TIME',
      description: 'We need a DevOps Engineer to manage our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines is essential.',
      employerId: employer.id,
    },
    {
      title: 'Mobile App Developer',
      company: 'AppWorks',
      location: 'Seattle, WA',
      salary: '$115,000 - $165,000',
      type: 'FULL_TIME',
      description: 'Join our mobile team to build amazing iOS and Android apps. Experience with React Native, Flutter, or native development is required.',
      employerId: employer.id,
    },
    {
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      salary: '$90,000 - $130,000',
      type: 'CONTRACT',
      description: 'We are seeking a talented UI/UX Designer to create beautiful and intuitive user interfaces. Proficiency in Figma, Adobe Creative Suite, and modern design principles is required.',
      employerId: employer.id,
    },
    {
      title: 'Data Scientist',
      company: 'AI Analytics',
      location: 'Boston, MA',
      salary: '$140,000 - $200,000',
      type: 'FULL_TIME',
      description: 'Looking for a Data Scientist to work on machine learning projects. Strong background in statistics, Python, and ML frameworks like TensorFlow or PyTorch is required.',
      employerId: employer.id,
    },
    {
      title: 'Junior Web Developer',
      company: 'Web Agency',
      location: 'Chicago, IL',
      salary: '$60,000 - $80,000',
      type: 'ENTRY_LEVEL',
      description: 'Great opportunity for junior developers to grow their skills. Basic knowledge of HTML, CSS, JavaScript, and one modern framework is required.',
      employerId: employer.id,
    },
  ];

  // Create jobs
  for (const jobData of jobs) {
    const job = await prisma.job.create({
      data: jobData,
    });
    console.log('Created job:', job.title);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
