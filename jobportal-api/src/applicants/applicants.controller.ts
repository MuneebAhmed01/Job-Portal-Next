import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('applicants')
export class ApplicantsController {
  constructor(private authService: AuthService) {}

  @Get(':id')
  async getApplicantBio(@Param('id') id: string) {
    const user = await this.authService.findUserById(id);
    if (!user) {
      throw new NotFoundException('Applicant not found');
    }
    return user;
  }

  @Get(':id/resume')
  async downloadResume(@Param('id') id: string, @Res() res: Response) {
    const user = await this.authService.findUserById(id);
    if (!user || !user.resumePath) {
      throw new NotFoundException('Resume not found');
    }

    const filePath = path.join(process.cwd(), user.resumePath);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Resume file not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume-${user.name}.pdf"`);
    fs.createReadStream(filePath).pipe(res);
  }
}
