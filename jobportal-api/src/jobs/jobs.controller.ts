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

  @Get(':id/applicants')
  @UseGuards(JwtAuthGuard)
  findApplicants(@Param('id') id: string, @Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.findApplicants(id, employerId);
  }
}
