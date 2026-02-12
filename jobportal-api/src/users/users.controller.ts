import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { UsersService } from './users.service';

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
