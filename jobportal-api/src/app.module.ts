import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { CareerGuidanceModule } from './career-guidance/career-guidance.module';
import { ResumeAnalyzerModule } from './resume-analyzer/resume-analyzer.module';
import { ResumeParserModule } from './features/resume-parser/resume-parser.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RedisModule,
    UsersModule,
    AuthModule,
    ApplicantsModule,
    JobsModule,
    CareerGuidanceModule,
    ResumeAnalyzerModule,
    ResumeParserModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
