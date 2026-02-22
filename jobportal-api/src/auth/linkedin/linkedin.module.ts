import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LinkedInController } from './linkedin.controller';
import { LinkedInService } from './linkedin.service';
import { LinkedInStrategy } from './linkedin.strategy';
import { LinkedInEmployerStrategy } from './linkedin-employer.strategy';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';
import { PrismaModule } from '../../lib/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  controllers: [LinkedInController],
  providers: [LinkedInService, LinkedInStrategy, LinkedInEmployerStrategy, LinkedInAuthGuard],
  exports: [LinkedInService],
})
export class LinkedInModule {}
