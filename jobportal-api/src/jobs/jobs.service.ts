import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { PrismaService } from '../lib/prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, employerId: string) {
    const job = await (this.prisma as any).job.create({
      data: {
        ...createJobDto,
        employerId,
      },
    });
    return job;
  }

  async findByEmployer(employerId: string) {
    return (this.prisma as any).job.findMany({
      where: { employerId },
    });
  }

  async findAllPublic() {
    return (this.prisma as any).job.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        salary: true,
        type: true,
        createdAt: true,
      },
    });
  }

  async findApplicants(jobId: string, employerId: string) {
    const job = await (this.prisma as any).job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only view applicants for your own jobs');
    }
    
    return (this.prisma as any).jobApplication.findMany({
      where: { jobId },
    });
  }

  async applyToJob(jobId: string, userId: string, user: any) {
    const job = await (this.prisma as any).job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    // Check if already applied
    const existingApplication = await (this.prisma as any).jobApplication.findFirst({
      where: {
        jobId,
        userId,
      },
    });
    
    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }
    
    // Create application
    const application = await (this.prisma as any).jobApplication.create({
      data: {
        jobId,
        userId,
        name: user.email?.split('@')[0] || 'Applicant',
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        resumePath: user.resumePath || '',
      },
    });
    
    return { message: 'Application submitted successfully', application };
  }

  async findUserApplications(userId: string) {
    return (this.prisma as any).jobApplication.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            salary: true,
            type: true,
            description: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  async saveJob(jobId: string, userId: string) {
    const job = await (this.prisma as any).job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    // Check if already saved
    const existingSavedJob = await (this.prisma as any).savedJob.findFirst({
      where: {
        jobId,
        userId,
      },
    });
    
    if (existingSavedJob) {
      throw new ForbiddenException('Job already saved');
    }
    
    // Create saved job
    const savedJob = await (this.prisma as any).savedJob.create({
      data: {
        jobId,
        userId,
      },
    });
    
    return { message: 'Job saved successfully', savedJob };
  }

  async unsaveJob(jobId: string, userId: string) {
    const savedJob = await (this.prisma as any).savedJob.findFirst({
      where: {
        jobId,
        userId,
      },
    });
    
    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }
    
    await (this.prisma as any).savedJob.delete({
      where: {
        id: savedJob.id,
      },
    });
    
    return { message: 'Job unsaved successfully' };
  }

  async findUserSavedJobs(userId: string) {
    return (this.prisma as any).savedJob.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            salary: true,
            type: true,
            description: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        savedAt: 'desc',
      },
    });
  }
}
