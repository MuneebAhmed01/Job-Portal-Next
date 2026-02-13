import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.adminService.login(body.email, body.password);
  }

  @Get('dashboard-stats')
  async getDashboardStats(@Headers('authorization') authHeader: string) {
    this.verifyAdmin(authHeader);
    return this.adminService.getDashboardStats();
  }

  @Get('jobs-over-time')
  async getJobsOverTime(@Headers('authorization') authHeader: string) {
    this.verifyAdmin(authHeader);
    return this.adminService.getJobsOverTime();
  }

  @Get('applicants-per-job')
  async getApplicantsPerJob(@Headers('authorization') authHeader: string) {
    this.verifyAdmin(authHeader);
    return this.adminService.getApplicantsPerJob();
  }

  @Get('user-employer-ratio')
  async getUserEmployerRatio(@Headers('authorization') authHeader: string) {
    this.verifyAdmin(authHeader);
    return this.adminService.getUserVsEmployerRatio();
  }

  private verifyAdmin(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return this.adminService.verifyAdminToken(token);
  }
}
