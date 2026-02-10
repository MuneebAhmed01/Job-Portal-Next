import { Controller, Post, Body, BadRequestException, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
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
    @UploadedFile() resume: any
  ) {
    if (!resume) {
      throw new BadRequestException('Resume is required');
    }
    return this.authService.signup(signupDto, resume);
  }

  @Post('signin')
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Get('verify-token')
  async verifyToken(@Body() body: { token: string }) {
    try {
      const payload = this.authService.verifyToken(body.token);
      return {
        valid: true,
        payload,
        message: 'Token is valid'
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        message: 'Token is invalid'
      };
    }
  }
}
