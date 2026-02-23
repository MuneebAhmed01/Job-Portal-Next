import {
  Controller,
  Get,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/linkedin')
export class LinkedInController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {
    // Passport handles the redirect to LinkedIn
  }

  // 2. Single callback — redirect by role (employee vs employer)
  @Get('callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(@Req() req: any, @Res() res: Response) {
    return this.handleLinkedInCallback(req, res, 'callback');
  }

  // 3. Employer Login — uses linkedin-employer strategy (fixed employer callback URL)
  @Get('employer')
  @UseGuards(AuthGuard('linkedin-employer'))
  async linkedinEmployerAuth() {
    // Passport redirects to LinkedIn with redirect_uri=.../auth/linkedin/employer/callback
  }

  // 4. Employer callback — must be whitelisted in LinkedIn app; always creates/updates Employer
  @Get('employer/callback')
  @UseGuards(AuthGuard('linkedin-employer'))
  async linkedinEmployerCallback(@Req() req: any, @Res() res: Response) {
    return this.handleLinkedInCallback(req, res, 'employer/callback');
  }

  /** Redirect both roles to /auth/success; frontend then sends to /dashboard (role-based UI) */
  private handleLinkedInCallback(req: any, res: Response, from: string): void {
    try {
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        console.error('❌ No user found on request object');
        throw new UnauthorizedException('Authentication failed');
      }

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
   
      const redirectPath = '/auth/success';
      const redirectUrl =
        `${frontendUrl}${redirectPath}?` +
        `token=${encodeURIComponent(authenticatedUser.token)}&` +
        `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`;

      console.log(
        `🔍 LinkedIn auth successful (${from}), redirecting to ${redirectPath}`,
      );
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ LinkedIn callback error:', error);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error?error=unauthorized`);
    }
  }
}
