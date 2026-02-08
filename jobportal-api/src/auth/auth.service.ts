import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import type { SignupDto } from './dto/signup.dto';
import type { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  private users: any[] = [];

  constructor(private jwtService: JwtService) {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  async signup(signupDto: SignupDto, resume: any) {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === signupDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Save resume file
    const resumePath = path.join('uploads', 'resumes', `${Date.now()}-${resume.originalname}`);
    const fullPath = path.join(process.cwd(), resumePath);
    fs.writeFileSync(fullPath, resume.buffer);

    // Create user
    const user = {
      id: Date.now().toString(),
      name: signupDto.name,
      email: signupDto.email,
      password: signupDto.password, // TODO: Hash password
      phone: signupDto.phone,
      role: signupDto.role,
      bio: signupDto.bio || null,
      resumePath: resumePath,
      createdAt: new Date()
    };

    this.users.push(user);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async signin(signinDto: SigninDto) {
    const user = this.users.find(u => u.email === signinDto.email && u.password === signinDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async findUserById(id: string) {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
