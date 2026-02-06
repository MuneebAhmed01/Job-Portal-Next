import { Controller, Post, Body } from '@nestjs/common';
import { CareerGuidanceService } from './career-guidance.service';
import { AnalyzeSkillsDto } from './dto/analyze-skills.dto';

@Controller('career-guidance')
export class CareerGuidanceController {
  constructor(private readonly careerGuidanceService: CareerGuidanceService) {}

  @Post('analyze')
  analyzeSkills(@Body() analyzeSkillsDto: AnalyzeSkillsDto) {
    return this.careerGuidanceService.analyzeSkills(analyzeSkillsDto.skills);
  }
}
