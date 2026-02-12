import { Controller, Get, Put, Param, Body, NotFoundException, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { updateEmployeeProfileSchema, updateEmployerProfileSchema, type UpdateEmployeeProfileDto, type UpdateEmployerProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('employee/:id')
  async findEmployee(@Param('id') id: string) {
    const employee = await this.usersService.findEmployeeById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    const { password, ...result } = employee;
    return result;
  }

  @Get('employer/:id')
  async findEmployer(@Param('id') id: string) {
    const employer = await this.usersService.findEmployerById(id);
    if (!employer) {
      throw new NotFoundException('Employer not found');
    }
    const { password, ...result } = employer;
    return result;
  }

  @Put('employee/profile')
  @UseGuards(JwtAuthGuard)
  async updateEmployeeProfile(
    @Request() req: any,
    @Body(new ZodValidationPipe(updateEmployeeProfileSchema)) data: UpdateEmployeeProfileDto
  ) {
    const employeeId = req.user.sub;
    const employee = await this.usersService.updateEmployee(employeeId, data);
    const { password, ...result } = employee;
    return result;
  }

  @Put('employer/profile')
  @UseGuards(JwtAuthGuard)
  async updateEmployerProfile(
    @Request() req: any,
    @Body(new ZodValidationPipe(updateEmployerProfileSchema)) data: UpdateEmployerProfileDto
  ) {
    const employerId = req.user.sub;
    const employer = await this.usersService.updateEmployer(employerId, data);
    const { password, ...result } = employer;
    return result;
  }

  @Get('search')
  async searchByEmail(@Query('email') email: string, @Query('type') type: 'employee' | 'employer') {
    if (type === 'employee') {
      const employee = await this.usersService.findEmployeeByEmail(email);
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }
      const { password, ...result } = employee;
      return result;
    } else {
      const employer = await this.usersService.findEmployerByEmail(email);
      if (!employer) {
        throw new NotFoundException('Employer not found');
      }
      const { password, ...result } = employer;
      return result;
    }
  }
}
