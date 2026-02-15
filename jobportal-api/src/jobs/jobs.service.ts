import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobSearchQueryBuilder } from './job-search-query.builder';
import { PrismaService } from '../lib/prisma/prisma.service';
import { JobCacheService } from '../redis/job-cache.service';
import { DraftStorageService } from '../redis/draft-storage.service';
import { ApplicationStatus, JobStatus } from '../lib/prisma/client';

@Injectable()
export class JobsService {
  constructor(
    private prisma: PrismaService,
    private jobCache: JobCacheService,
    private draftStorage: DraftStorageService,
  ) {}

  async create(createJobDto: CreateJobDto, employerId: string) {
    // Parse salary from salaryRange if not provided
    let salary = createJobDto.salary;
    if (!salary && createJobDto.salaryRange) {
      salary = this.parseMinSalary(createJobDto.salaryRange); // Use MIN salary for filtering
    }

    const job = await this.prisma.job.create({
      data: {
        ...createJobDto,
        salary: salary || undefined,
        employerId,
        status: JobStatus.ACTIVE,
      },
    });

    // Invalidate cache so new job appears immediately
    await this.jobCache.invalidateAll();

    return job;
  }

  /**
   * Parse salary for filtering - returns minimum for general use
   */
  private parseSalaryForFiltering(salaryRange: string): number | undefined {
    return this.parseMinSalary(salaryRange);
  }

  /**
   * Parse minimum salary value from a salary range string
   * Examples: "$80k-$100k" -> 80000, "50k-70k" -> 50000, "$120k" -> 120000
   */
  private parseMinSalary(salaryRange: string): number | undefined {
    try {
      // Remove common currency symbols and whitespace
      const cleaned = salaryRange.replace(/[$,\s]/g, '').toLowerCase();
      
      // Handle different formats
      if (cleaned.includes('-')) {
        // Range format: "80k-100k" or "80000-100000"
        const parts = cleaned.split('-');
        const minPart = parts[0]; // Take first part as min
        return this.parseSalaryValue(minPart);
      } else {
        // Single value format: "100k" or "100000"
        return this.parseSalaryValue(cleaned);
      }
    } catch {
      return undefined;
    }
  }

  /**
   * Parse maximum salary value from a salary range string
   * Examples: "$80k-$100k" -> 100000, "50k-70k" -> 70000, "$120k" -> 120000
   */
  private parseMaxSalary(salaryRange: string): number | undefined {
    try {
      // Remove common currency symbols and whitespace
      const cleaned = salaryRange.replace(/[$,\s]/g, '').toLowerCase();
      
      // Handle different formats
      if (cleaned.includes('-')) {
        // Range format: "80k-100k" or "80000-100000"
        const parts = cleaned.split('-');
        const maxPart = parts[parts.length - 1]; // Take the last part as max
        return this.parseSalaryValue(maxPart);
      } else {
        // Single value format: "100k" or "100000"
        return this.parseSalaryValue(cleaned);
      }
    } catch {
      return undefined;
    }
  }

  /**
   * Parse individual salary value (handles 'k' suffix and plain numbers)
   */
  private parseSalaryValue(value: string): number | undefined {
    if (value.includes('k')) {
      const numValue = parseFloat(value.replace('k', ''));
      return isNaN(numValue) ? undefined : Math.round(numValue * 1000);
    } else {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? undefined : Math.round(numValue);
    }
  }

  async updateExistingJobSalaries() {
    const jobsToUpdate = await this.prisma.job.findMany({
      where: {
        salaryRange: {
          not: ''
        }
      }
    });

    let updatedCount = 0;

    for (const job of jobsToUpdate) {
      const parsedSalary = this.parseMinSalary(job.salaryRange); // Use MIN salary for filtering
      
      await this.prisma.job.update({
        where: { id: job.id },
        data: { salary: parsedSalary }
      });

      updatedCount++;
      console.log(`Updated job "${job.title}" - salaryRange: "${job.salaryRange}" -> salary: ${parsedSalary}`);
    }

    // Invalidate cache
    await this.jobCache.invalidateAll();

    return { message: `Updated ${updatedCount} jobs with salary values` };
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

  async searchJobs(params: SearchJobsDto) {
    const { where, orderBy, skip, take } = new JobSearchQueryBuilder(params).build();

    const include = {
      employer: { select: { id: true, name: true, companyName: true } },
      _count: { select: { applications: true } },
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({ where, orderBy, skip, take, include }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / params.limit),
      currentPage: params.page,
    };
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

  private getAllowedNextStatuses(current: ApplicationStatus): ApplicationStatus[] {
    switch (current) {
      case ApplicationStatus.PENDING:
        return [ApplicationStatus.REVIEWED];
      case ApplicationStatus.REVIEWED:
        return [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED];
      case ApplicationStatus.ACCEPTED:
      case ApplicationStatus.REJECTED:
        return [];
      default:
        return [];
    }
  }

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    employerId: string,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    if (application.job.employerId !== employerId) {
      throw new ForbiddenException('You can only update applications for your own jobs');
    }
    const allowed = this.getAllowedNextStatuses(application.status);
    if (!allowed.includes(status)) {
      throw new BadRequestException('Invalid status transition');
    }
    return this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
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
