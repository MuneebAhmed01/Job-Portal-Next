import { Injectable } from '@nestjs/common';
import { PdfExtractorService } from './services/pdf-extractor.service';
import { AtsScorerService, AtsAnalysisResult } from './services/ats-scorer.service';
import { AiAnalysisService, AiAnalysisResponse } from './services/ai-analysis.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';

@Injectable()
export class ResumeAnalyzerService {
  constructor(
    private readonly pdfExtractorService: PdfExtractorService,
    private readonly atsScorerService: AtsScorerService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  async analyzeResume(dto: AnalyzeResumeDto): Promise<AiAnalysisResponse> {
    // Validate PDF
    const isValidPdf = await this.pdfExtractorService.isValidPdf(dto.file.buffer);
    if (!isValidPdf) {
      throw new Error('Invalid PDF file');
    }

    // Extract text from PDF
    const resumeText = await this.pdfExtractorService.extractTextFromPdf(dto.file.buffer);

    if (!resumeText || resumeText.trim().length < 50) {
      throw new Error('Resume text is too short or could not be extracted');
    }

    // Perform ATS analysis
    const atsResult: AtsAnalysisResult = this.atsScorerService.analyzeResume(resumeText);

    // Generate AI-powered analysis
    const aiResponse = await this.aiAnalysisService.generateAnalysis(atsResult);

    return aiResponse;
  }
}
