import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';

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

    return res.sendFile(employee.resumePath);
  }
}
