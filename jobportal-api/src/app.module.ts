import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { CareerGuidanceModule } from './career-guidance/career-guidance.module';
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
    JobsModule,
    CareerGuidanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
