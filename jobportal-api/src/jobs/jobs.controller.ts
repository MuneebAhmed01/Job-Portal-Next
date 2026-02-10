import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';
import type { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.create(createJobDto, employerId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByEmployer(@Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.findByEmployer(employerId);
  }

  @Get('all')
  findAll() {
    return this.jobsService.findAllPublic();
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async applyToJob(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;
    const user = req.user;
    return this.jobsService.applyToJob(id, userId, user);
  }

  @Get('my-applications')
  @UseGuards(JwtAuthGuard)
  async getMyApplications(@Request() req: any) {
    const userId = req.user.sub;
    return this.jobsService.findUserApplications(userId);
  }
}
