import { Module } from '@nestjs/common';
import { ApplicantsController } from './applicants.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ApplicantsController],
})
export class ApplicantsModule {}
