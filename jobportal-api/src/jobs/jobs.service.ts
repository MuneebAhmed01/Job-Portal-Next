import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { PrismaService } from '../lib/prisma/prisma.service';
import { JobCacheService } from '../redis/job-cache.service';
import { DraftStorageService } from '../redis/draft-storage.service';
import { JobStatus } from '../lib/prisma/client';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private jobCache: JobCacheService,
    private draftStorage: DraftStorageService,
  ) {}

  async create(createJobDto: CreateJobDto, employerId: string) {
    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        employerId,
        status: JobStatus.ACTIVE,
      },
    });

    // Invalidate the "all jobs" cache so the new job appears immediately
    await this.jobCache.invalidateAll();

    return job;
  }

  async findByEmployer(employerId: string) {
    return this.prisma.job.findMany({
      where: { employerId },
      include: {
        _count: {
          select: { applications: true }
        },
        applications: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findAllPublic() {
    // Try cache first
    const cached = await this.jobCache.getAllJobs();
    if (cached) return cached;

    const jobs = await this.prisma.job.findMany({
      where: { status: JobStatus.ACTIVE },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    // Store in cache for next request
    await this.jobCache.cacheAllJobs(jobs);
    return jobs;
  }

  async findApplicants(jobId: string, employerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only view applicants for your own jobs');
    }
    
    return this.prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
            resumePath: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  async applyToJob(jobId: string, employeeId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.status !== JobStatus.ACTIVE) {
      throw new ForbiddenException('This job is not accepting applications');
    }
    
    // Check if already applied
    const existingApplication = await this.prisma.jobApplication.findUnique({
      where: {
        jobId_employeeId: {
          jobId,
          employeeId,
        },
      },
    });
    
    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }
    
    // Create application
    const application = await this.prisma.jobApplication.create({
      data: {
        jobId,
        employeeId,
      },
    });
    
    return { message: 'Application submitted successfully', application };
  }

  async findEmployeeApplications(employeeId: string) {
    return this.prisma.jobApplication.findMany({
      where: { employeeId },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  async saveJob(jobId: string, employeeId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    
    // Check if already saved
    const existingSavedJob = await this.prisma.savedJob.findUnique({
      where: {
        jobId_employeeId: {
          jobId,
          employeeId,
        },
      },
    });
    
    if (existingSavedJob) {
      throw new ForbiddenException('Job already saved');
    }
    
    // Create saved job
    const savedJob = await this.prisma.savedJob.create({
      data: {
        jobId,
        employeeId,
      },
    });
    
    return { message: 'Job saved successfully', savedJob };
  }

  async unsaveJob(jobId: string, employeeId: string) {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        jobId_employeeId: {
          jobId,
          employeeId,
        },
      },
    });
    
    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }
    
    await this.prisma.savedJob.delete({
      where: { id: savedJob.id },
    });
    
    return { message: 'Job unsaved successfully' };
  }

  async findEmployeeSavedJobs(employeeId: string) {
    return this.prisma.savedJob.findMany({
      where: { employeeId },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: {
        savedAt: 'desc',
      },
    });
  }

  async updateJob(id: string, updateJobDto: CreateJobDto, employerId: string) {
    const existingJob = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      throw new NotFoundException('Job not found');
    }

    if (existingJob.employerId !== employerId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: updateJobDto,
    });

    // Bust cache for this job + the listing
    await this.jobCache.invalidateJob(id);

    return updated;
  }

  async closeJob(id: string, employerId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only close your own jobs');
    }

    const closed = await this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.CLOSED },
    });

    // Bust cache
    await this.jobCache.invalidateJob(id);

    return closed;
  }

  async getJobById(id: string) {
    // Try cache first
    const cached = await this.jobCache.getJob(id);
    if (cached) return cached;

    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Cache the result
    await this.jobCache.cacheJob(id, job);

    return job;
  }
}
