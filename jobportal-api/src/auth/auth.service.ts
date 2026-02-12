import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../lib/prisma/prisma.service';
import type { SignupDto, EmployeeSignupDto, EmployerSignupDto } from './dto/signup.dto';
import type { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signup(signupDto: SignupDto, resume?: Express.Multer.File) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    if (signupDto.userType === 'employee') {
      return this.signupEmployee(signupDto as EmployeeSignupDto, hashedPassword, resume);
    } else {
      return this.signupEmployer(signupDto as EmployerSignupDto, hashedPassword);
    }
  }

  private async signupEmployee(dto: EmployeeSignupDto, hashedPassword: string, resume?: Express.Multer.File) {
    // Check existing employee
    const existingEmployee = await this.prismaService.employee.findUnique({
      where: { email: dto.email },
    });
    if (existingEmployee) {
      throw new BadRequestException('Email already registered');
    }

    // Create employee
    const employee = await this.prismaService.employee.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        bio: dto.bio || null,
        resumePath: resume?.path || null,
      },
    });

    // Log employee creation
    await this.prismaService.userLog.create({
      data: {
        userId: employee.id,
        action: 'employee_created',
        message: `Employee ${employee.email} created successfully`,
      },
    });

    // Generate token
    const token = this.jwtService.sign({
      sub: employee.id,
      email: employee.email,
      userType: 'employee',
    });

    return {
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        phone: employee.phone,
        userType: 'employee',
      },
      token,
    };
  }

  private async signupEmployer(dto: EmployerSignupDto, hashedPassword: string) {
    // Check existing employer
    const existingEmployer = await this.prismaService.employer.findUnique({
      where: { email: dto.email },
    });
    if (existingEmployer) {
      throw new BadRequestException('Email already registered');
    }

    // Create employer
    const employer = await this.prismaService.employer.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        companyName: dto.companyName,
        bio: dto.bio || null,
      },
    });

    // Log employer creation
    await this.prismaService.employerLog.create({
      data: {
        employerId: employer.id,
        action: 'employer_created',
        message: `Employer ${employer.email} created successfully`,
      },
    });

    // Generate token
    const token = this.jwtService.sign({
      sub: employer.id,
      email: employer.email,
      userType: 'employer',
    });

    return {
      user: {
        id: employer.id,
        email: employer.email,
        name: employer.name,
        phone: employer.phone,
        companyName: employer.companyName,
        userType: 'employer',
      },
      token,
    };
  }

  async signin(signinDto: SigninDto) {
    if (signinDto.userType === 'employee') {
      return this.signinEmployee(signinDto.email, signinDto.password);
    } else {
      return this.signinEmployer(signinDto.email, signinDto.password);
    }
  }

  private async signinEmployee(email: string, password: string) {
    const employee = await this.prismaService.employee.findUnique({
      where: { email },
    });
    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Log employee login
    await this.prismaService.userLog.create({
      data: {
        userId: employee.id,
        action: 'employee_login',
        message: `Employee ${employee.email} logged in successfully`,
      },
    });

    const token = this.jwtService.sign({
      sub: employee.id,
      email: employee.email,
      userType: 'employee',
    });

    return {
      user: {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        phone: employee.phone,
        userType: 'employee',
      },
      token,
    };
  }

  private async signinEmployer(email: string, password: string) {
    const employer = await this.prismaService.employer.findUnique({
      where: { email },
    });
    if (!employer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, employer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Log employer login
    await this.prismaService.employerLog.create({
      data: {
        employerId: employer.id,
        action: 'employer_login',
        message: `Employer ${employer.email} logged in successfully`,
      },
    });

    const token = this.jwtService.sign({
      sub: employer.id,
      email: employer.email,
      userType: 'employer',
    });

    return {
      user: {
        id: employer.id,
        email: employer.email,
        name: employer.name,
        phone: employer.phone,
        companyName: employer.companyName,
        userType: 'employer',
      },
      token,
    };
  }

  async findEmployeeById(id: string) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id },
    });
    if (!employee) return null;
    const { password, ...result } = employee;
    return { ...result, userType: 'employee' };
  }

  async findEmployerById(id: string) {
    const employer = await this.prismaService.employer.findUnique({
      where: { id },
    });
    if (!employer) return null;
    const { password, ...result } = employer;
    return { ...result, userType: 'employer' };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
