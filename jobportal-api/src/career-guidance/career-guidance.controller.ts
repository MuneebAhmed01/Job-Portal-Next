import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CareerGuidanceService } from './career-guidance.service';
import { analyzeSkillsSchema, type AnalyzeSkillsDto } from './dto/analyze-skills.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('career-guidance')
export class CareerGuidanceController {
  constructor(private readonly careerGuidanceService: CareerGuidanceService) {}

  @Post('analyze')
  @UsePipes(new ZodValidationPipe(analyzeSkillsSchema))
  analyzeSkills(@Body() analyzeSkillsDto: AnalyzeSkillsDto) {
    return this.careerGuidanceService.analyzeSkills(analyzeSkillsDto.skills);
  }
}
