import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  HttpException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { ResumeParseResult } from './resume.types';

@Controller('resume')
export class ResumeController {
  private readonly logger = new Logger(ResumeController.name);

  constructor(private readonly resumeService: ResumeService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException(
          'No file uploaded',
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`Processing resume upload: ${file.originalname}`);
      
      const result = await this.resumeService.processResume(file);
      
      if (!result.success) {
        throw new HttpException(
          result.error || 'Resume processing failed',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        message: 'Resume processed successfully',
        data: result.data
      };

    } catch (error) {
      this.logger.error(`Resume upload failed: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error during resume processing',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('parse-text')
  async parseResumeText(@Body('text') text: string) {
    try {
      if (!text || text.trim().length === 0) {
        throw new HttpException(
          'No text provided for parsing',
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log('Processing resume text parsing');
      
      const result: ResumeParseResult = this.resumeService.parseResumeText(text);
      
      if (!result.success) {
        throw new HttpException(
          result.error || 'Text parsing failed',
          HttpStatus.BAD_REQUEST
        );
      }

      return {
        success: true,
        message: 'Resume text parsed successfully',
        data: result.data
      };

    } catch (error) {
      this.logger.error(`Resume text parsing failed: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error during text parsing',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('validate')
  async validateParsedResume(@Body() resumeData: any) {
    try {
      if (!resumeData) {
        throw new HttpException(
          'No resume data provided for validation',
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log('Validating parsed resume data');
      
      // Import here to avoid circular dependency
      const { ResumeParser } = await import('./resume.parser');
      const validation = ResumeParser.validateParsedResume(resumeData);

      return {
        success: true,
        message: 'Resume validation completed',
        data: validation
      };

    } catch (error) {
      this.logger.error(`Resume validation failed: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error during validation',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
