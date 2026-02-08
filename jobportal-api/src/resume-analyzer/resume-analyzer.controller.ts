import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body,
  BadRequestException,
  ParseFilePipeBuilder,
  HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeAnalyzerService } from './resume-analyzer.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';

@Controller('resume-analyzer')
export class ResumeAnalyzerController {
  constructor(private readonly resumeAnalyzerService: ResumeAnalyzerService) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeResume(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'pdf',
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: (error) => new BadRequestException(error),
        }),
    )
    file: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const dto: AnalyzeResumeDto = { file };
    
    try {
      const analysis = await this.resumeAnalyzerService.analyzeResume(dto);
      return {
        success: true,
        data: analysis,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
