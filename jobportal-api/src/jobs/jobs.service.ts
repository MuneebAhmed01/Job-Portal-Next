import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  private jobs: any[] = [];

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
}
