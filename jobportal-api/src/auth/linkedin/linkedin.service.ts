import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { LinkedInProfileDto } from './dto/linkedin-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LinkedInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** Download LinkedIn profile image and save to uploads/avatars; returns local path or null. */
  private async downloadAndSaveProfilePicture(profilePictureUrl: string): Promise<string | null> {
    if (!profilePictureUrl || !profilePictureUrl.startsWith('http')) return null;
    try {
      const response = await fetch(profilePictureUrl, {
        redirect: 'follow',
        headers: { 'User-Agent': 'JobPortal/1.0 (Profile Picture Sync)' },
      });
      if (!response.ok) {
        console.warn('LinkedIn picture download failed:', response.status, profilePictureUrl.slice(0, 60));
        return null;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length === 0) return null;
      const ext = path.extname(new URL(profilePictureUrl).pathname) || '.jpg';
      const safeExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase()) ? ext : '.jpg';
      const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `linkedin-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      console.log('✅ LinkedIn profile picture saved:', filename);
      return filePath;
    } catch (e) {
      console.warn('LinkedIn picture download error:', e instanceof Error ? e.message : e);
      return null;
    }
  }

  async validateLinkedInUser(profile: LinkedInProfileDto & { role?: string }): Promise<any> {
    let {
      id,
      email,
      firstName,
      lastName,
      profilePicture,
      headline,
      summary,
      role = 'employee',
    } = profile;

    console.log('🔍 LinkedIn Service - Role:', role, '(will write to', role === 'employer' ? 'employers' : 'employees', 'table)');
    console.log('🔍 LinkedIn Service - Profile:', { id, email, firstName, lastName, hasPicture: !!profilePicture });

    if (!id) {
      throw new BadRequestException('LinkedIn ID is required');
    }

    // Download and persist LinkedIn profile image if it's a URL (every login = fresh fetch)
    if (profilePicture && profilePicture.startsWith('http')) {
      const localPath = await this.downloadAndSaveProfilePicture(profilePicture);
      if (localPath) profilePicture = localPath;
    }

    // Security: only ever use the picture from THIS LinkedIn login — never keep a previous account's picture
    const pictureToStore = profilePicture && profilePicture.trim() !== '' ? profilePicture : null;

    const fullName = `${firstName} ${lastName}`.trim();
    const bio = headline || summary || '';

    let employee = await this.prisma.employee.findFirst({
      where: { linkedinId: id },
    });

    let employer = await this.prisma.employer.findFirst({
      where: { linkedinId: id },
    });

    if (employee) {
      // Update existing LinkedIn employee — always overwrite with this login's picture
      employee = await this.prisma.employee.update({
        where: { id: employee.id },
        data: {
          name: fullName,
          profilePicture: pictureToStore,
          bio: bio || employee.bio,
          updatedAt: new Date(),
        },
      });

      return this.generateToken(employee, 'employee');
    } else if (employer) {
      // Update existing LinkedIn employer — always overwrite with this login's picture
      employer = await this.prisma.employer.update({
        where: { id: employer.id },
        data: {
          name: fullName,
          profilePicture: pictureToStore,
          bio: bio || employer.bio,
          updatedAt: new Date(),
        },
      });

      return this.generateToken(employer, 'employer');
    } else if (email) {
      // Check if user exists with email (merge accounts)
      employee = await this.prisma.employee.findFirst({
        where: { email },
      });

      employer = await this.prisma.employer.findFirst({
        where: { email },
      });

      if (employee) {
        // Link LinkedIn to existing employee — use this login's LinkedIn picture only
        employee = await this.prisma.employee.update({
          where: { id: employee.id },
          data: {
            linkedinId: id,
            profilePicture: pictureToStore,
            bio: bio || employee.bio,
            updatedAt: new Date(),
          },
        });

        return this.generateToken(employee, 'employee');
      } else if (employer) {
        // Link LinkedIn to existing employer — use this login's LinkedIn picture only
        employer = await this.prisma.employer.update({
          where: { id: employer.id },
          data: {
            linkedinId: id,
            profilePicture: pictureToStore,
            bio: bio || employer.bio,
            updatedAt: new Date(),
          },
        });

        return this.generateToken(employer, 'employer');
      } else {
        // Create new user based on role parameter
        console.log('🔍 Creating new LinkedIn user with role:', role);
        
        if (role === 'employer') {
          console.log('🔍 Creating new employer profile');
          // Create new employer
          employer = await this.prisma.employer.create({
            data: {
              name: fullName,
              email,
              linkedinId: id,
              profilePicture: pictureToStore,
              bio,
              provider: 'linkedin',
              companyName: `${fullName}'s Company`, // Default company name for LinkedIn signup
              isProfileComplete: true, // Employers don't need to complete profile
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          console.log('✅ Employer created:', { id: employer.id, name: employer.name, email: employer.email });
          return this.generateToken(employer, 'employer');
        } else {
          console.log('🔍 Creating new employee profile');
          // Create new employee (default behavior)
          employee = await this.prisma.employee.create({
            data: {
              name: fullName,
              email,
              linkedinId: id,
              profilePicture: pictureToStore,
              bio,
              provider: 'linkedin',
              isProfileComplete: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });

          console.log('✅ Employee created:', { id: employee.id, name: employee.name, email: employee.email });
          return this.generateToken(employee, 'employee');
        }
      }
    } else {
      throw new BadRequestException(
        'Email is required for LinkedIn authentication',
      );
    }
  }

  private generateToken(user: any, role: string): any {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: role,
    };

    const token = this.jwtService.sign(payload);

    const baseUser: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      userType: role,
      isProfileComplete: user.isProfileComplete || false,
    };

    if (user.phone) baseUser.phone = user.phone;
    if (user.profilePicture) baseUser.profilePicture = user.profilePicture;
    if (role === 'employee' && user.resumePath)
      baseUser.resumePath = user.resumePath;
    if (role === 'employer' && user.companyName)
      baseUser.companyName = user.companyName;

    return {
      user: baseUser,
      token,
    };
  }

  generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  validateState(state: string, storedState: string): void {
    if (!state || !storedState || state !== storedState) {
      throw new UnauthorizedException('Invalid state parameter');
    }
  }

  getRedirectUri(): string {
    const redirectUri = this.configService.get<string>('LINKEDIN_REDIRECT_URI');
    console.log('redirect URI : ', redirectUri);
    if (!redirectUri) {
      throw new BadRequestException('LinkedIn redirect URI not configured');
    }
    return redirectUri;
  }
}
