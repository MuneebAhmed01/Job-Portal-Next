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
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: configService.get<string>('LINKEDIN_REDIRECT_URI'),
      scope: ['openid', 'profile', 'email'],
      state: true,
    });
  }

  // We override the internal userProfile to use the correct OIDC endpoint
  // AND we ensure the Authorization header is set correctly
  userProfile(accessToken: string, done: (err?: any, profile?: any) => void) {
    console.log('🔑 Received Access Token:', accessToken ? 'YES (Hidden for security)' : 'MISSING');

    (this as any)._oauth2.useAuthorizationHeaderforGET(true); // <--- THIS IS THE KEY FIX
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
          const profile = {
            _json: json,
            id: json.sub,
            displayName: `${json.given_name} ${json.family_name}`,
            emails: [{ value: json.email }],
            photos: [{ value: json.picture }],
            name: {
              givenName: json.given_name,
              familyName: json.family_name,
            },
          };
          done(null, profile);
        } catch (e) {
          done(e);
        }
      },
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    try {
      const profileData = profile._json;
      console.log('✅ Success! LinkedIn Profile identified:', profileData.sub);

      const linkedInProfile = {
        id: profileData.sub || '',
        firstName: profileData.given_name || '',
        lastName: profileData.family_name || '',
        email: profileData.email || '',
        profilePicture: profileData.picture || '',
      };

      const validatedUser = await this.linkedInService.validateLinkedInUser(linkedInProfile);
      
      return {
        user: validatedUser,
        accessToken,
      };
    } catch (error) {
      console.error('❌ Strategy validation error:', error);
      throw error;
    }
  }
}