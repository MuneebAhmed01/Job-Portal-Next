import { Controller, Get, Post, Delete, Body, UseGuards, Request, Param, Put, UsePipes } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { DraftStorageService } from '../redis/draft-storage.service';
import { createJobSchema, type CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly draftStorage: DraftStorageService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createJobSchema))
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

  // Employee-specific routes - must be before :id routes
  @Get('employee/applications')
  @UseGuards(JwtAuthGuard)
  async getMyApplications(@Request() req: any) {
    const employeeId = req.user.sub;
    return this.jobsService.findEmployeeApplications(employeeId);
  }

  @Get('employee/saved')
  @UseGuards(JwtAuthGuard)
  async getSavedJobs(@Request() req: any) {
    const employeeId = req.user.sub;
    return this.jobsService.findEmployeeSavedJobs(employeeId);
  }

  // Parameterized routes last
  @Get(':id')
  getJob(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async applyToJob(@Param('id') id: string, @Request() req: any) {
    const employeeId = req.user.sub;
    return this.jobsService.applyToJob(id, employeeId);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async saveJob(@Param('id') id: string, @Request() req: any) {
    const employeeId = req.user.sub;
    return this.jobsService.saveJob(id, employeeId);
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  async unsaveJob(@Param('id') id: string, @Request() req: any) {
    const employeeId = req.user.sub;
    return this.jobsService.unsaveJob(id, employeeId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(@Param('id') id: string, @Body() updateJobDto: CreateJobDto, @Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.updateJob(id, updateJobDto, employerId);
  }

  @Post(':id/close')
  @UseGuards(JwtAuthGuard)
  async closeJob(@Param('id') id: string, @Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.closeJob(id, employerId);
  }

  @Get(':id/applicants')
  @UseGuards(JwtAuthGuard)
  async getJobApplicants(@Param('id') id: string, @Request() req: any) {
    const employerId = req.user.sub;
    return this.jobsService.findApplicants(id, employerId);
  }

  /* ------------------------------------------------------------------ */
  /*  Draft application endpoints (Redis-backed)                         */
  /* ------------------------------------------------------------------ */

  @Post(':id/draft')
  @UseGuards(JwtAuthGuard)
  async saveDraft(
    @Param('id') jobId: string,
    @Body() body: Record<string, any>,
    @Request() req: any,
  ) {
    const employeeId = req.user.sub;
    await this.draftStorage.saveDraft(employeeId, jobId, body);
    return { message: 'Draft saved' };
  }

  @Get(':id/draft')
  @UseGuards(JwtAuthGuard)
  async getDraft(@Param('id') jobId: string, @Request() req: any) {
    const employeeId = req.user.sub;
    const draft = await this.draftStorage.getDraft(employeeId, jobId);
    return draft ?? { message: 'No draft found' };
  }

  @Delete(':id/draft')
  @UseGuards(JwtAuthGuard)
  async deleteDraft(@Param('id') jobId: string, @Request() req: any) {
    const employeeId = req.user.sub;
    await this.draftStorage.deleteDraft(employeeId, jobId);
    return { message: 'Draft deleted' };
  }
}
