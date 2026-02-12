import { Injectable } from '@nestjs/common';
import { PrismaService } from '../lib/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Employee operations
  async createEmployee(data: { email: string; password: string; name: string; phone: string; bio?: string }) {
    const employee = await this.prisma.employee.create({
      data,
    });

    await this.prisma.userLog.create({
      data: {
        userId: employee.id,
        action: 'employee_created',
        message: `Employee ${employee.email} created successfully`,
      },
    });

    return employee;
  }

  async findEmployeeByEmail(email: string) {
    return this.prisma.employee.findUnique({
      where: { email },
    });
  }

  async findEmployeeById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id },
    });
  }

  async updateEmployee(id: string, data: { name?: string; phone?: string; bio?: string }) {
    const employee = await this.prisma.employee.update({
      where: { id },
      data,
    });

    await this.prisma.userLog.create({
      data: {
        userId: id,
        action: 'employee_updated',
        message: `Employee profile updated`,
      },
    });

    return employee;
  }

  // Employer operations
  async createEmployer(data: { email: string; password: string; name: string; phone: string; companyName: string; bio?: string }) {
    const employer = await this.prisma.employer.create({
      data,
    });

    await this.prisma.employerLog.create({
      data: {
        employerId: employer.id,
        action: 'employer_created',
        message: `Employer ${employer.email} created successfully`,
      },
    });

    return employer;
  }

  async findEmployerByEmail(email: string) {
    return this.prisma.employer.findUnique({
      where: { email },
    });
  }

  async findEmployerById(id: string) {
    return this.prisma.employer.findUnique({
      where: { id },
    });
  }

  async updateEmployer(id: string, data: { name?: string; phone?: string; companyName?: string; bio?: string }) {
    const employer = await this.prisma.employer.update({
      where: { id },
      data,
    });

    await this.prisma.employerLog.create({
      data: {
        employerId: id,
        action: 'employer_updated',
        message: `Employer profile updated`,
      },
    });

    return employer;
  }

  // Logging operations
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
