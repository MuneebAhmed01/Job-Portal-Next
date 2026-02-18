import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';
import { LinkedInService } from './linkedin.service';
import { LinkedInProfileDto } from './dto/linkedin-profile.dto';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly linkedInService: LinkedInService,
  ) {
    super({
      clientID: configService.get<string>('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get<string>('LINKEDIN_CLIENT_SECRET'),
      callbackURL: linkedInService.getRedirectUri(),
      scope: ['openid', 'profile', 'w_member_social', 'email'],
      state: true,
      passReqToCallback: true,
      store: {
        get: (key: string, done: Function) => {
          // For state parameter, we'll handle it manually in the controller
          done(null, null);
        },
        set: (key: string, value: string, done: Function) => {
          done(null);
        },
        destroy: (key: string, done: Function) => {
          done(null);
        },
      },
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      // Handle different profile structures from LinkedIn API
      const profileData = profile._json || profile;

      const linkedInProfile: LinkedInProfileDto = {
        id: profileData?.sub || profileData?.id || '',
        firstName:
          profileData?.given_name || profileData?.name?.split(' ')[0] || '',
        lastName:
          profileData?.family_name ||
          profileData?.name?.split(' ').slice(1).join(' ') ||
          '',
        email:
          profileData?.email ||
          profileData?.emailAddress ||
          profileData?.emails?.[0]?.value ||
          '',
        profilePicture:
          profileData?.picture ||
          profileData?.profilePicture?.['displayImage~']?.elements?.[0]
            ?.identifiers?.[0]?.identifier ||
          '',
        headline: profileData?.headline || '',
        summary: profileData?.summary || profileData?.about || '',
        location: profileData?.location?.name || profileData?.location || '',
      };

      const validatedUser =
        await this.linkedInService.validateLinkedInUser(linkedInProfile);
      return done(null, validatedUser);
    } catch (error) {
      return done(error, null);
    }
  }
}
