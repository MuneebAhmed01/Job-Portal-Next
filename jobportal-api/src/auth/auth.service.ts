import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../lib/prisma/prisma.service';
import { UserRole } from '../lib/prisma/client';
import type { SignupDto } from './dto/signup.dto';
import type { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signup(signupDto: SignupDto, resume: any) {
    console.log('Signup DTO received:', signupDto);
    
    // Check existing user
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: signupDto.email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Convert role string to enum
    let userRole: UserRole;
    console.log('Original role:', signupDto.role);
    
    // Handle role conversion explicitly
    if (signupDto.role === 'FIND_JOB' || !signupDto.role) {
      userRole = UserRole.USER;
      console.log('Setting role to USER (FIND_JOB)');
    } else if (signupDto.role === 'HIRE_TALENT') {
      userRole = UserRole.EMPLOYER;
      console.log('Setting role to EMPLOYER (HIRE_TALENT)');
    } else if (signupDto.role === 'USER') {
      userRole = UserRole.USER;
      console.log('Setting role to USER');
    } else if (signupDto.role === 'EMPLOYER') {
      userRole = UserRole.EMPLOYER;
      console.log('Setting role to EMPLOYER');
    } else if (signupDto.role === 'ADMIN') {
      userRole = UserRole.ADMIN;
      console.log('Setting role to ADMIN');
    } else {
      userRole = UserRole.USER;
      console.log('Defaulting to USER for unknown role:', signupDto.role);
    }
    
    console.log('Final converted role:', userRole);
    console.log('Available UserRole values:', Object.values(UserRole));

    // Create user
    console.log('About to create user with role:', userRole);
    const user = await this.prismaService.user.create({
      data: {
        email: signupDto.email,
        password: hashedPassword,
        name: signupDto.name,
        role: userRole,
      },
    });
    console.log('User created successfully:', user);

    // Log user data sent to database
    await this.prismaService.userLog.create({
      data: {
        userId: user.id,
        action: 'user_created',
        message: `User data sent to database: ${JSON.stringify({ email: user.email, name: user.name, role: user.role })}`,
      },
    });

    // Log employer specific data if applicable
    if (userRole === UserRole.EMPLOYER) {
      await this.prismaService.employerLog.create({
        data: {
          employerId: user.id,
          action: 'employer_data_sent',
          message: `Employer data sent to database: ${JSON.stringify({ email: user.email, name: user.name })}`,
        },
      });
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: userRole
    });

    console.log('Generated token for user:', { id: user.id, email: user.email, role: userRole });

    // Return user without password
    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: userRole 
      }, 
      token 
    };
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: signinDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(signinDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Log user login
    await this.prismaService.userLog.create({
      data: {
        userId: user.id,
        action: 'user_login',
        message: `User ${user.email} logged in successfully`,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return { 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      }, 
      token 
    };
  }

  async findUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
