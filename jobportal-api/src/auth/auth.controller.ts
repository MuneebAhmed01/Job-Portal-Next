import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Headers, Query, UnauthorizedException, UsePipes, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { signupSchema, type SignupDto } from './dto/signup.dto';
import { signinSchema, type SigninDto } from './dto/signin.dto';
import { googleAuthSchema, googleRoleSchema } from './dto/google-auth.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import * as path from 'path';
import * as fs from 'fs';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('resume', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'uploads', 'resumes');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `resume-${uniqueSuffix}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    }
  }))
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() resume?: Express.Multer.File
  ) {
    // Manually validate since @UsePipes doesn't work with FileInterceptor (multipart)
    const result = signupSchema.safeParse(signupDto);
    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      throw new BadRequestException({ message: 'Validation failed', errors });
    }
    return this.authService.signup(result.data, resume);
  }

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinSchema))
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('google')
  async googleAuth(
    @Body() body: any,
    @Query('role') role?: string,
  ) {
    const bodyResult = googleAuthSchema.safeParse(body);
    if (!bodyResult.success) {
      throw new BadRequestException('Invalid request: accessToken is required');
    }
    const roleResult = googleRoleSchema.safeParse({ role });
    const validRole = roleResult.success ? roleResult.data.role : undefined;
    return this.googleAuthService.authenticate(bodyResult.data.accessToken, validRole);
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    
    if (payload.userType === 'employee') {
      return this.authService.findEmployeeById(payload.sub);
    } else {
      return this.authService.findEmployerById(payload.sub);
    }
  }

  @Get('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    try {
      const payload = this.authService.verifyToken(body.token);
      return { valid: true, payload, message: 'Token is valid' };
    } catch {
      return { valid: false, message: 'Token is invalid' };
    }
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    await this.authService.logout(payload.sub);
    return { message: 'Logged out successfully' };
  }
}
