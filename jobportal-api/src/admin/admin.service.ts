import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../lib/prisma/prisma.service';

// Hardcoded admin credentials — single admin account
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = '12345678';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async login(email: string, password: string) {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const token = this.jwtService.sign({
      sub: 'admin',
      email: ADMIN_EMAIL,
      userType: 'admin',
    });

    return {
      user: {
        id: 'admin',
        email: ADMIN_EMAIL,
        name: 'Admin',
        userType: 'admin',
      },
      token,
    };
  }

  verifyAdminToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.userType !== 'admin') {
        throw new UnauthorizedException('Not an admin token');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getDashboardStats() {
    const [totalEmployees, totalEmployers, totalJobs, totalApplications] =
      await Promise.all([
        this.prismaService.employee.count(),
        this.prismaService.employer.count(),
        this.prismaService.job.count(),
        this.prismaService.jobApplication.count(),
      ]);

    return {
      totalUsers: totalEmployees,
      totalEmployers,
      totalJobs,
      totalApplicants: totalApplications,
    };
  }

  async getJobsOverTime() {
    // Get jobs grouped by creation date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const jobs = await this.prismaService.job.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const grouped: Record<string, number> = {};
    jobs.forEach((job) => {
      const date = job.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    // Fill in missing dates
    const result: { date: string; count: number }[] = [];
    const current = new Date(thirtyDaysAgo);
    const today = new Date();
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      result.push({ date: dateStr, count: grouped[dateStr] || 0 });
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  async getApplicantsPerJob() {
    const jobs = await this.prismaService.job.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Top 10 most recent jobs
    });

    return jobs.map((job) => ({
      jobTitle: job.title.length > 25 ? job.title.substring(0, 25) + '...' : job.title,
      applicants: job._count.applications,
    }));
  }

  async getUserVsEmployerRatio() {
    const [totalEmployees, totalEmployers] = await Promise.all([
      this.prismaService.employee.count(),
      this.prismaService.employer.count(),
    ]);

    return [
      { name: 'Users', value: totalEmployees },
      { name: 'Employers', value: totalEmployers },
    ];
  }
}
