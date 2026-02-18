import { Controller, Get, Res, Req, Query, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LinkedInService } from './linkedin.service';
import { ConfigService } from '@nestjs/config';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';

@Controller('auth/linkedin')
export class LinkedInController {
  constructor(
    private readonly linkedInService: LinkedInService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async linkedinAuth(@Res() res: Response) {
    try {
      const state = this.linkedInService.generateState();
      
      // Store state in session or secure cookie
      res.cookie('linkedin_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600000, // 10 minutes
      });

      const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
      const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
      
      if (!clientId || !redirectUri) {
        throw new BadRequestException('LinkedIn OAuth configuration is missing');
      }
      
      const scope = 'openid profile w_member_social email';
      
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;

      return res.redirect(authUrl);
    } catch (error) {
      throw new BadRequestException('Failed to initiate LinkedIn authentication');
    }
  }

  @Get('callback')
  @UseGuards(LinkedInAuthGuard)
  async linkedinCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
  ) {
    try {
      // Handle OAuth errors
      if (error) {
        console.error('LinkedIn OAuth Error:', error, errorDescription);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || 'LinkedIn authentication failed')}`);
      }

      // Validate state parameter
      const storedState = req.cookies?.linkedin_oauth_state;
      this.linkedInService.validateState(state, storedState);
      
      // Clear the state cookie
      res.clearCookie('linkedin_oauth_state');

      // Get authenticated user from passport strategy
      const authenticatedUser = req.user;
      
      if (!authenticatedUser) {
        throw new UnauthorizedException('Authentication failed');
      }

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/success?` +
        `token=${encodeURIComponent(authenticatedUser.accessToken)}&` +
        `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`;

      // Check if profile is complete
      if (!authenticatedUser.user.isProfileComplete) {
        return res.redirect(`${frontendUrl}/complete-profile?` +
          `token=${encodeURIComponent(authenticatedUser.accessToken)}&` +
          `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`);
      }

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('LinkedIn callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?error=authentication_failed&description=${encodeURIComponent(error.message)}`);
    }
  }

  @Get('employer')
  async linkedinEmployerAuth(@Res() res: Response) {
    try {
      const state = this.linkedInService.generateState();
      
      res.cookie('linkedin_employer_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600000,
      });

      const clientId = this.configService.get<string>('LINKEDIN_CLIENT_ID');
      const redirectUri = `${this.linkedInService.getRedirectUri()}/employer`;
      const scope = 'openid profile w_member_social email';
      
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${state}`;

      return res.redirect(authUrl);
    } catch (error) {
      throw new BadRequestException('Failed to initiate LinkedIn employer authentication');
    }
  }

  @Get('callback/employer')
  @UseGuards(LinkedInAuthGuard)
  async linkedinEmployerCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
  ) {
    try {
      if (error) {
        console.error('LinkedIn Employer OAuth Error:', error, errorDescription);
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        return res.redirect(`${frontendUrl}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || 'LinkedIn employer authentication failed')}`);
      }

      const storedState = req.cookies?.linkedin_employer_oauth_state;
      this.linkedInService.validateState(state, storedState);
      
      res.clearCookie('linkedin_employer_oauth_state');

      const authenticatedUser = req.user;
      
      if (!authenticatedUser) {
        throw new UnauthorizedException('Employer authentication failed');
      }

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

      // For employer, we need to use the employer service method
      // This would require a separate strategy or modifying the existing one
      // For now, redirect to employer dashboard
      return res.redirect(`${frontendUrl}/employer/dashboard?` +
        `token=${encodeURIComponent(authenticatedUser.accessToken)}&` +
        `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`);
    } catch (error) {
      console.error('LinkedIn employer callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?error=employer_authentication_failed&description=${encodeURIComponent(error.message)}`);
    }
  }
}
