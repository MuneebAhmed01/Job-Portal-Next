import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { LinkedInService } from './linkedin.service';

/**
 * Employer-only LinkedIn strategy. Uses a fixed employer callback URL so that
 * when LinkedIn redirects back to /auth/linkedin/employer/callback, this strategy
 * runs and we always create/update the Employer table (never Employee).
 *
 * Required: In LinkedIn Developer Console, add BOTH redirect URLs:
 * - .../auth/linkedin/callback
 * - .../auth/linkedin/employer/callback
 */
@Injectable()
export class LinkedInEmployerStrategy extends PassportStrategy(
  Strategy,
  'linkedin-employer',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly linkedInService: LinkedInService,
  ) {
    const baseUrl = getBaseUrlFromConfig(configService);
    const employerCallbackURL =
      `${baseUrl}/auth/linkedin/employer/callback`;
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: employerCallbackURL,
      scope: ['openid', 'profile', 'email'],
      state: true,
      passReqToCallback: true,
    });
  }

  userProfile(accessToken: string, done: (err?: any, profile?: any) => void) {
    (this as any)._oauth2.useAuthorizationHeaderforGET(true);
    (this as any)._oauth2.get(
      'https://api.linkedin.com/v2/userinfo',
      accessToken,
      (err, body) => {
        if (err) return done(new Error('Failed to fetch user profile'));
        try {
          const json = JSON.parse(body);
          done(null, {
            _json: json,
            id: json.sub,
            displayName: `${json.given_name || ''} ${json.family_name || ''}`.trim(),
            emails: [{ value: json.email }],
            photos: [{ value: json.picture }],
            name: {
              givenName: json.given_name,
              familyName: json.family_name,
            },
          });
        } catch (e) {
          done(e);
        }
      },
    );
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const profileData = profile._json;
      console.log('✅ [EMPLOYER] LinkedIn Profile identified:', profileData.sub);

      const linkedInProfile = {
        id: profileData.sub || '',
        firstName: profileData.given_name || '',
        lastName: profileData.family_name || '',
        email: profileData.email || '',
        profilePicture: profileData.picture || '',
        role: 'employer' as const,
      };

      const validatedUser =
        await this.linkedInService.validateLinkedInUser(linkedInProfile);

      console.log(
        '🔍 [EMPLOYER] LinkedIn Auth Role: employer (strategy: linkedin-employer), userType:',
        validatedUser.user?.userType,
      );
      return {
        user: validatedUser.user,
        token: validatedUser.token,
      };
    } catch (error) {
      console.error('❌ [EMPLOYER] Strategy validation error:', error);
      throw error;
    }
  }
}

function getBaseUrlFromConfig(config: ConfigService): string {
  const uri = config.get<string>('LINKEDIN_REDIRECT_URI') || '';
  const match = uri.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : config.get<string>('BACKEND_URL') || 'http://localhost:3002';
}
