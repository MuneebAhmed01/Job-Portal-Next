import { PrismaClient, JobStatus } from '../src/lib/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:zain1234@localhost:5432/next-jobportal',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // Create a demo employer
  const employer = await prisma.employer.upsert({
    where: { email: 'employer@demo.com' },
    update: {},
    create: {
      email: 'employer@demo.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      name: 'Demo Employer',
      phone: '+1234567890',
      companyName: 'Tech Corp',
      bio: 'A leading technology company',
    },
  });

  console.log('Created employer:', employer);

  // Create a demo employee
  const employee = await prisma.employee.upsert({
    where: { email: 'employee@demo.com' },
    update: {},
    create: {
      email: 'employee@demo.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      name: 'Demo Employee',
      phone: '+1234567890',
      bio: 'Experienced software developer',
    },
  });

  console.log('Created employee:', employee);

  // Create dummy jobs
  const jobs = [
    {
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      salaryRange: '$120,000 - $180,000',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
      employerId: employer.id,
      status: JobStatus.ACTIVE,
    },
    {
      title: 'Backend Engineer',
      location: 'New York, NY',
      salaryRange: '$130,000 - $190,000',
      description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js, Python, or Go is required. Knowledge of databases and cloud services is a plus.',
      employerId: employer.id,
      status: JobStatus.ACTIVE,
    },
    {
      title: 'Full Stack Developer',
      location: 'Remote',
      salaryRange: '$100,000 - $150,000',
      description: 'Looking for a versatile Full Stack Developer who can work on both frontend and backend. Experience with MERN stack or similar technologies required.',
      employerId: employer.id,
      status: JobStatus.ACTIVE,
    },
    {
      title: 'DevOps Engineer',
      location: 'Austin, TX',
      salaryRange: '$110,000 - $160,000',
      description: 'We need a DevOps Engineer to manage our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines is essential.',
      employerId: employer.id,
      status: JobStatus.ACTIVE,
    },
    {
      title: 'Mobile App Developer',
      location: 'Seattle, WA',
      salaryRange: '$115,000 - $165,000',
      description: 'Join our mobile team to build amazing iOS and Android apps. Experience with React Native, Flutter, or native development is required.',
      employerId: employer.id,
      status: JobStatus.ACTIVE,
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
