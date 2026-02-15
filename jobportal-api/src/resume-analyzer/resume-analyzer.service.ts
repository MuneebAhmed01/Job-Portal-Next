import { Injectable } from '@nestjs/common';
import { PdfExtractorService } from './services/pdf-extractor.service';
import { AtsScorerService } from './services/ats-scorer.service';
import { AiAnalysisService } from './services/ai-analysis.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';

@Injectable()
export class ResumeAnalyzerService {
  constructor(
    private readonly pdfExtractorService: PdfExtractorService,
    private readonly atsScorerService: AtsScorerService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) { }

  async analyzeResume(dto: AnalyzeResumeDto) {
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

    // Perform ATS analysis with job description if provided
    const atsResult = this.atsScorerService.analyzeResume(resumeText, dto.jobDescription);

    // Generate AI-powered analysis
    const aiResponse = this.aiAnalysisService.generateAnalysis(atsResult);

    // Compose response matching frontend expectations
    return {
      atsScore: atsResult.score,
      summary: aiResponse.summary,
      scoreBreakdown: aiResponse.scoreBreakdown,
      strengths: aiResponse.strengths,
      improvements: aiResponse.improvements,
      improvementPriority: aiResponse.improvementPriority,
      penalties: aiResponse.penalties,
      jobMatchAnalysis: atsResult.analysis.jobMatchAnalysis || undefined,
    };
  }
}
