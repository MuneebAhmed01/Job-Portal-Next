import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('applicants')
export class ApplicantsController {
  constructor(private authService: AuthService) {}

  @Get(':id')
  async getApplicantBio(@Param('id') id: string) {
    const employee = await this.authService.findEmployeeById(id);
    if (!employee) {
      throw new NotFoundException('Applicant not found');
    }
    return employee;
  }

  @Get(':id/resume')
  async downloadResume(@Param('id') id: string, @Res() res: Response) {
    const employee = await this.authService.findEmployeeById(id);
    if (!employee) {
      throw new NotFoundException('Applicant not found');
    }

    if (!employee.resumePath) {
      throw new NotFoundException('Resume not found for this applicant');
    }

    // Ensure we have an absolute path
    const absolutePath = path.isAbsolute(employee.resumePath)
      ? employee.resumePath
      : path.join(process.cwd(), employee.resumePath);

    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Resume file not found on server');
    }

    // Set headers for file download
    const filename = path.basename(absolutePath);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    return res.sendFile(absolutePath);
  }
}
