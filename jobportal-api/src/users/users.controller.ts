import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  NotFoundException,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  updateEmployeeProfileSchema,
  updateEmployerProfileSchema,
  type UpdateEmployeeProfileDto,
  type UpdateEmployerProfileDto,
} from './dto/update-profile.dto';
import * as path from 'path';
import * as fs from 'fs';

const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
    @Body(new ZodValidationPipe(updateEmployeeProfileSchema))
    data: UpdateEmployeeProfileDto,
  ) {
    const employeeId = req.user.sub;
    const employee = await this.usersService.updateEmployee(employeeId, data);
    const { password, ...result } = employee;
    return result;
  }

  @Post('employee/resume')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'resumes');
          if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(
            null,
            `resume-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'), false);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadResume(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Please upload a PDF file');
    const employeeId = req.user.sub;
    const employee = await this.usersService.updateEmployee(employeeId, {
      resumePath: file.path,
    });
    const { password, ...result } = employee;
    return result;
  }

  @Post('employee/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'avatars');
          if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname) || '.jpg';
          cb(
            null,
            `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (AVATAR_MIME_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'), false);
      },
      limits: { fileSize: AVATAR_MAX_SIZE },
    }),
  )
  async uploadEmployeeAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Please upload an image');
    const employeeId = req.user.sub;
    const employee = await this.usersService.updateEmployee(employeeId, {
      profilePicture: file.path,
    });
    const { password, ...result } = employee;
    return result;
  }

  @Post('employer/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'avatars');
          if (!fs.existsSync(uploadPath))
            fs.mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname) || '.jpg';
          cb(
            null,
            `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (AVATAR_MIME_TYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, GIF, or WebP images are allowed'), false);
      },
      limits: { fileSize: AVATAR_MAX_SIZE },
    }),
  )
  async uploadEmployerAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Please upload an image');
    const employerId = req.user.sub;
    const employer = await this.usersService.updateEmployer(employerId, {
      profilePicture: file.path,
    });
    const { password, ...result } = employer;
    return result;
  }

  @Get('avatar')
  @UseGuards(JwtAuthGuard)
  async getAvatar(@Request() req: any, @Res() res: Response) {
    const userId = req.user.sub;
    let user = await this.usersService.findEmployeeById(userId) ?? await this.usersService.findEmployerById(userId);
    if (!user || !user.profilePicture) {
      throw new NotFoundException('Profile picture not found');
    }
    const absolutePath = path.isAbsolute(user.profilePicture)
      ? user.profilePicture
      : path.join(process.cwd(), user.profilePicture);
    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundException('Profile picture file not found');
    }
    const ext = path.extname(absolutePath).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : ext === '.gif' ? 'image/gif' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'private, max-age=3600');
    return res.sendFile(absolutePath);
  }

  @Put('employer/profile')
  @UseGuards(JwtAuthGuard)
  async updateEmployerProfile(
    @Request() req: any,
    @Body(new ZodValidationPipe(updateEmployerProfileSchema))
    data: UpdateEmployerProfileDto,
  ) {
    const employerId = req.user.sub;
    const employer = await this.usersService.updateEmployer(employerId, data);
    const { password, ...result } = employer;
    return result;
  }

  @Get('search')
  async searchByEmail(
    @Query('email') email: string,
    @Query('type') type: 'employee' | 'employer',
  ) {
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
