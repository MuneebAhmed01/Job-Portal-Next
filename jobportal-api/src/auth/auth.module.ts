import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { PrismaModule } from '../lib/prisma/prisma.module';
import { LinkedInModule } from './linkedin/linkedin.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
    LinkedInModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService],
  exports: [AuthService],
})
export class AuthModule {}
