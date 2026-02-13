import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../lib/prisma/prisma.service';

interface GoogleUser {
  email: string;
  name: string;
}

@Injectable()
export class GoogleAuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async authenticate(accessToken: string, role?: 'employee' | 'employer') {
    const googleUser = await this.getGoogleUser(accessToken);

    // Check employee table
    const employee = await this.prisma.employee.findUnique({ where: { email: googleUser.email } });
    if (employee) return this.issueToken(employee, 'employee');

    // Check employer table
    const employer = await this.prisma.employer.findUnique({ where: { email: googleUser.email } });
    if (employer) return this.issueToken(employer, 'employer');

    // New user — role required
    if (!role) throw new BadRequestException('Role is required for new Google sign-up');

    return role === 'employee'
      ? this.createEmployee(googleUser)
      : this.createEmployer(googleUser);
  }

  private async getGoogleUser(accessToken: string): Promise<GoogleUser> {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new UnauthorizedException('Invalid Google token');
    const data = await res.json();
    if (!data.email) throw new UnauthorizedException('Google account has no email');
    return { email: data.email, name: data.name || data.email.split('@')[0] };
  }

  private issueToken(user: any, userType: 'employee' | 'employer') {
    const token = this.jwt.sign({ sub: user.id, email: user.email, userType });
    const base: any = { id: user.id, email: user.email, name: user.name, phone: user.phone, userType };
    if (userType === 'employer') base.companyName = user.companyName;
    return { user: base, token };
  }

  private async createEmployee(g: GoogleUser) {
    const employee = await this.prisma.employee.create({
      data: { name: g.name, email: g.email, phone: '', password: null, provider: 'google' },
    });
    await this.prisma.userLog.create({
      data: { userId: employee.id, action: 'google_signup', message: `${employee.email} signed up via Google` },
    });
    return this.issueToken(employee, 'employee');
  }

  private async createEmployer(g: GoogleUser) {
    const employer = await this.prisma.employer.create({
      data: { name: g.name, email: g.email, phone: '', companyName: '', password: null, provider: 'google' },
    });
    await this.prisma.employerLog.create({
      data: { employerId: employer.id, action: 'google_signup', message: `${employer.email} signed up via Google` },
    });
    return this.issueToken(employer, 'employer');
  }
}
