import { Controller, Get, Put, Post, Param, Body, NotFoundException, Query, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { updateEmployeeProfileSchema, updateEmployerProfileSchema, type UpdateEmployeeProfileDto, type UpdateEmployerProfileDto } from './dto/update-profile.dto';
import * as path from 'path';
import * as fs from 'fs';

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

  @Post('employee/resume')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('resume', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'resumes');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') cb(null, true);
      else cb(new Error('Only PDF files are allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadResume(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Please upload a PDF file');
    const employeeId = req.user.sub;
    const employee = await this.usersService.updateEmployee(employeeId, { resumePath: file.path });
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
