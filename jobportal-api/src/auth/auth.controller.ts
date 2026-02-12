import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import type { SignupDto } from './dto/signup.dto';
import type { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('resume'))
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() resume?: Express.Multer.File
  ) {
    return this.authService.signup(signupDto, resume);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
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
}
