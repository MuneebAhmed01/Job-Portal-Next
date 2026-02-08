import { Module } from '@nestjs/common';
import { ResumeAnalyzerController } from './resume-analyzer.controller';
import { ResumeAnalyzerService } from './resume-analyzer.service';
import { PdfExtractorService } from './services/pdf-extractor.service';
import { AtsScorerService } from './services/ats-scorer.service';
import { AiAnalysisService } from './services/ai-analysis.service';

@Module({
  controllers: [ResumeAnalyzerController],
  providers: [
    ResumeAnalyzerService,
    PdfExtractorService,
    AtsScorerService,
    AiAnalysisService,
  ],
})
export class ResumeAnalyzerModule {}
