import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';
import { User, UserRole } from '../lib/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(userData: { email: string; password: string; name: string; role?: UserRole }) {
    const user = await this.prisma.user.create({
      data: userData,
    });

    // Log user creation
    await this.prisma.userLog.create({
      data: {
        userId: user.id,
        action: 'user_created',
        message: `User ${user.email} created successfully`,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async logUserAction(userId: string, action: string, message?: string) {
    await this.prisma.userLog.create({
      data: {
        userId,
        action,
        message,
      },
    });
  }

  async logEmployerAction(employerId: string, action: string, message?: string) {
    await this.prisma.employerLog.create({
      data: {
        employerId,
        action,
        message,
      },
    });
  }
}
