import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { LinkedInService } from './linkedin.service';


@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly linkedInService: LinkedInService,
  ) {
    const callbackURL =
      configService.get<string>('LINKEDIN_REDIRECT_URI') ||
      'http://localhost:3002/auth/linkedin/callback';
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL,
      scope: ['openid', 'profile', 'email'],
      state: true,
      passReqToCallback: true,
    });
  }

  userProfile(accessToken: string, done: (err?: any, profile?: any) => void) {
    console.log(
      '🔑 Received Access Token:',
      accessToken ? 'YES (Hidden for security)' : 'MISSING',
    );
    (this as any)._oauth2.useAuthorizationHeaderforGET(true);
    (this as any)._oauth2.get(
      'https://api.linkedin.com/v2/userinfo',
      accessToken,
      (err, body) => {
        if (err) {
          console.error('DEBUG: LinkedIn API Error Body:', err.data);
          return done(new Error('Failed to fetch user profile'));
        }
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
      console.log('✅ [EMPLOYEE] LinkedIn Profile identified:', profileData.sub);

      // LinkedIn userinfo can expose picture as picture or profile_picture
      const pictureUrl =
        profileData.picture ??
        profileData.profile_picture ??
        (profile.photos && profile.photos[0] && profile.photos[0].value) ??
        '';

      const linkedInProfile = {
        id: profileData.sub || '',
        firstName: profileData.given_name || '',
        lastName: profileData.family_name || '',
        email: profileData.email || '',
        profilePicture: pictureUrl,
        role: 'employee' as const,
      };

      const validatedUser =
        await this.linkedInService.validateLinkedInUser(linkedInProfile);

      console.log(
        '🔍 [EMPLOYEE] LinkedIn Auth Role: employee (strategy: linkedin), userType:',
        validatedUser.user?.userType,
      );
      return {
        user: validatedUser.user,
        token: validatedUser.token,
      };
    } catch (error) {
      console.error('❌ [EMPLOYEE] Strategy validation error:', error);
      throw error;
    }
  }
}
