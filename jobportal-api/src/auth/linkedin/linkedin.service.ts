import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { LinkedInProfileDto } from './dto/linkedin-profile.dto';

@Injectable()
export class LinkedInService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateLinkedInUser(profile: LinkedInProfileDto): Promise<any> {
    const {
      id,
      email,
      firstName,
      lastName,
      profilePicture,
      headline,
      summary,
    } = profile;

    if (!id) {
      throw new BadRequestException('LinkedIn ID is required');
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const bio = headline || summary || '';

    let employee = await this.prisma.employee.findFirst({
      where: { linkedinId: id },
    });

    let employer = await this.prisma.employer.findFirst({
      where: { linkedinId: id },
    });

    if (employee) {
      // Update existing LinkedIn employee
      employee = await this.prisma.employee.update({
        where: { id: employee.id },
        data: {
          name: fullName,
          profilePicture: profilePicture || employee.profilePicture,
          bio: bio || employee.bio,
          updatedAt: new Date(),
        },
      });
      
      return this.generateToken(employee, 'employee');
    } else if (employer) {
      // Update existing LinkedIn employer
      employer = await this.prisma.employer.update({
        where: { id: employer.id },
        data: {
          name: fullName,
          profilePicture: profilePicture || employer.profilePicture,
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
        // Link LinkedIn to existing employee
        employee = await this.prisma.employee.update({
          where: { id: employee.id },
          data: {
            linkedinId: id,
            profilePicture: profilePicture || employee.profilePicture,
            bio: bio || employee.bio,
            updatedAt: new Date(),
          },
        });
        
        return this.generateToken(employee, 'employee');
      } else if (employer) {
        // Link LinkedIn to existing employer
        employer = await this.prisma.employer.update({
          where: { id: employer.id },
          data: {
            linkedinId: id,
            profilePicture: profilePicture || employer.profilePicture,
            bio: bio || employer.bio,
            updatedAt: new Date(),
          },
        });
        
        return this.generateToken(employer, 'employer');
      } else {
        // Create new user - default to employee
        employee = await this.prisma.employee.create({
          data: {
            name: fullName,
            email,
            linkedinId: id,
            profilePicture,
            bio,
            provider: 'linkedin',
            isProfileComplete: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        
        return this.generateToken(employee, 'employee');
      }
    } else {
      throw new BadRequestException('Email is required for LinkedIn authentication');
    }
  }

  private generateToken(user: any, role: string): any {
    const payload = {
      sub: user.id,
      email: user.email,
      role: role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: role,
        isProfileComplete: user.isProfileComplete || false,
      },
      accessToken,
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
    if (!redirectUri) {
      throw new BadRequestException('LinkedIn redirect URI not configured');
    }
    return redirectUri;
  }
}
