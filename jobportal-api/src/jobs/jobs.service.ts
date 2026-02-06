import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService implements OnModuleInit {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async onModuleInit() {
    await this.seedJobs();
  }

  private async seedJobs() {
    const count = await this.jobsRepository.count();
    if (count > 0) return;

    const demoJobs: CreateJobDto[] = [
      {
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'New York, NY',
        salary: '$120,000 - $150,000',
        description: 'We are looking for an experienced React developer to join our team. You will be responsible for building user interfaces and working closely with our backend team.',
      },
      {
        title: 'Backend Engineer',
        company: 'DataFlow Systems',
        location: 'San Francisco, CA',
        salary: '$130,000 - $160,000',
        description: 'Join our backend team to build scalable APIs and microservices. Experience with Node.js and PostgreSQL required.',
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$100,000 - $130,000',
        description: 'We need a versatile developer who can work on both frontend and backend. Next.js and NestJS experience is a plus.',
      },
    ];

    for (const job of demoJobs) {
      await this.jobsRepository.save(this.jobsRepository.create(job));
    }
    console.log('Demo jobs seeded successfully');
  }

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create(createJobDto);
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({ order: { createdAt: 'DESC' } });
  }
}
