import { Module } from '@nestjs/common';
import { CareerGuidanceController } from './career-guidance.controller';
import { CareerGuidanceService } from './career-guidance.service';

@Module({
  controllers: [CareerGuidanceController],
  providers: [CareerGuidanceService],
})
export class CareerGuidanceModule {}
