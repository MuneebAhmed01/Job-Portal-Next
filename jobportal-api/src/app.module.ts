import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { AuthModule } from './auth/auth.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { CareerGuidanceModule } from './career-guidance/career-guidance.module';
import { ResumeAnalyzerModule } from './resume-analyzer/resume-analyzer.module';
import { Job } from './jobs/entities/job.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Job],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    ApplicantsModule,
    JobsModule,
    CareerGuidanceModule,
    ResumeAnalyzerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
