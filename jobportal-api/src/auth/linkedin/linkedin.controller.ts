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

  // 1. Initiate Login
  // Passport automatically generates the 'state' and redirects to LinkedIn
  @Get()
  @UseGuards(AuthGuard('linkedin'))
  async linkedinAuth() {
    // This body is empty; the Guard handles the redirect.
  }

  // 2. Handle Callback
  // Passport automatically verifies the 'state' and 'code' from the URL
  @Get('callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinCallback(@Req() req: any, @Res() res: Response) {
    try {
      console.log('🔍 LinkedIn Callback hit');

      const authenticatedUser = req.user;

      if (!authenticatedUser) {
        console.error('❌ No user found on request object');
        throw new UnauthorizedException('Authentication failed');
      }

      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3000';

      // Check if profile is complete - smarter check
      const user = authenticatedUser.user;
      const hasBasicProfile = user.phone && user.phone.trim().length > 0;
      const hasResume = user.resumePath && user.resumePath.trim().length > 0;
      const hasBio = user.bio && user.bio.trim().length > 0;
      
      // Consider profile complete if user has phone and either resume or bio
      const isEffectivelyComplete = hasBasicProfile && (hasResume || hasBio);
      
      console.log('🔍 LinkedIn Profile Check:');
      console.log('- User:', user.name, '(', user.email, ')');
      console.log('- isProfileComplete flag:', user.isProfileComplete);
      console.log('- Has phone:', hasBasicProfile, '(', user.phone, ')');
      console.log('- Has resume:', hasResume, '(', user.resumePath, ')');
      console.log('- Has bio:', hasBio, '(', user.bio, ')');
      console.log('- Is effectively complete:', isEffectivelyComplete);
      console.log('- Will redirect to complete-profile:', !user.isProfileComplete && !isEffectivelyComplete);
      
      if (!user.isProfileComplete && !isEffectivelyComplete) {
        return res.redirect(
          `${frontendUrl}/complete-profile?` +
            `token=${encodeURIComponent(authenticatedUser.token)}&` +
            `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`,
        );
      }

      // Successful login redirect
      const redirectUrl =
        `${frontendUrl}/auth/success?` +
        `token=${encodeURIComponent(authenticatedUser.token)}&` +
        `user=${encodeURIComponent(JSON.stringify(authenticatedUser.user))}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ Callback error:', error);
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3000';
      return res.redirect(`${frontendUrl}/auth/error?error=unauthorized`);
    }
  }

  // 3. Employer Login (Using a custom property in the Strategy via state if needed)
  @Get('employer')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinEmployerAuth() {
    // Note: To distinguish employer vs employee, you might need a separate strategy
    // or to append a 'role' in the validate method.
  }
}
