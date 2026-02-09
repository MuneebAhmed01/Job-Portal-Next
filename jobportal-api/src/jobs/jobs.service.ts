import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  private jobs: any[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      description: 'We are looking for an experienced software engineer to join our team. You will be responsible for building scalable web applications using modern technologies.',
      location: 'Mumbai, India',
      salary: '25-40 LPA',
      type: 'FULL_TIME',
      employerId: 'employer-1',
      createdAt: new Date('2026-02-01'),
      applicants: []
    },
    {
      id: '2',
      title: 'Frontend Developer',
      description: 'Join our growing team as a frontend developer. Work with React, Next.js, and modern CSS frameworks to build beautiful user interfaces.',
      location: 'Bangalore, India (Remote)',
      salary: '15-25 LPA',
      type: 'FULL_TIME',
      employerId: 'employer-1',
      createdAt: new Date('2026-02-03'),
      applicants: []
    },
    {
      id: '3',
      title: 'UX Designer Intern',
      description: 'Looking for a creative UX designer intern to help with user research, wireframing, and prototyping. Great opportunity to learn and grow.',
      location: 'Delhi, India',
      salary: '20-30K/month',
      type: 'INTERNSHIP',
      employerId: 'employer-2',
      createdAt: new Date('2026-02-05'),
      applicants: []
    },
    {
      id: '4',
      title: 'Full Stack Developer',
      description: 'Seeking a full stack developer proficient in Node.js, React, and PostgreSQL. Experience with cloud platforms is a plus.',
      location: 'Remote',
      salary: '20-35 LPA',
      type: 'FULL_TIME',
      employerId: 'employer-2',
      createdAt: new Date('2026-02-06'),
      applicants: []
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      description: 'Join our infrastructure team to build and maintain CI/CD pipelines, manage cloud resources, and ensure system reliability.',
      location: 'Hyderabad, India',
      salary: '18-30 LPA',
      type: 'FULL_TIME',
      employerId: 'employer-3',
      createdAt: new Date('2026-02-07'),
      applicants: []
    }
  ];

  create(createJobDto: CreateJobDto, employerId: string) {
    const job = {
      id: Date.now().toString(),
      ...createJobDto,
      employerId,
      createdAt: new Date(),
      applicants: []
    };
    
    this.jobs.push(job);
    return job;
  }

  findByEmployer(employerId: string) {
    return this.jobs.filter(job => job.employerId === employerId);
  }

  findAllPublic() {
    return this.jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      type: job.type,
      createdAt: job.createdAt
    }));
  }

  findApplicants(jobId: string, employerId: string) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only view applicants for your own jobs');
    }
    return job.applicants || [];
  }

  applyToJob(jobId: string, userId: string, user: any) {
    const job = this.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    // Check if already applied
    const alreadyApplied = job.applicants.find((a: any) => a.id === userId);
    if (alreadyApplied) {
      throw new ForbiddenException('You have already applied for this job');
    }
    
    // Add applicant
    const applicant = {
      id: userId,
      name: user.email?.split('@')[0] || 'Applicant',
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      resumePath: user.resumePath || '',
      appliedAt: new Date()
    };
    
    job.applicants.push(applicant);
    return { message: 'Application submitted successfully', applicant };
  }
}
