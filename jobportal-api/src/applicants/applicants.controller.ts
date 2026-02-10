import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';

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
    if (!user) {
      throw new NotFoundException('Applicant not found');
    }
    
    // Note: Resume handling would need to be updated based on new user structure
    // For now, return a message that resume feature needs to be updated
    return {
      message: 'Resume download feature needs to be updated for new user structure',
      userId: id,
    };
  }
}
