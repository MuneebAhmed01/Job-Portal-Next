/**
 * Resume Service
 * Main service for handling resume processing, PDF extraction, and file operations
 */

import { promises as fs } from 'fs';
import { join, extname } from 'path';
import { PDFParse } from 'pdf-parse';
import { 
  ParsedResume, 
  ResumeParseResult, 
  ResumeUploadResponse, 
  PdfExtractionResult,
  ResumeFileInfo,
  ResumeValidationResult,
  ResumeParseError,
  ResumeParserConfig
} from './resume.types';
import { ResumeParser } from './resume.parser';

export class ResumeService {
  private config: ResumeParserConfig;

  constructor(config?: Partial<ResumeParserConfig>) {
    this.config = {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: ['application/pdf'],
      uploadPath: process.env.UPLOAD_PATH || './uploads/resumes',
      enableFileCleanup: true,
      ...config
    };
  }

  /**
   * Process uploaded resume file
   */
  async processResume(file: Express.Multer.File): Promise<ResumeUploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Save file to storage
      const fileInfo = await this.saveFile(file);

      // Extract text from PDF
      const extractionResult = await this.extractTextFromPDF(file.buffer);
      if (!extractionResult.success) {
        // Clean up saved file if extraction fails
        await this.cleanupFile(fileInfo.path);
        return {
          success: false,
          error: extractionResult.error
        };
      }

      // Parse resume text
      const parseResult = ResumeParser.parseResume(extractionResult.text!);
      if (!parseResult.success) {
        await this.cleanupFile(fileInfo.path);
        return {
          success: false,
          error: parseResult.error
        };
      }

      return {
        success: true,
        data: {
          parsedResume: parseResult.data!,
          resumeUrl: `/uploads/resumes/${fileInfo.filename}`
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `Resume processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract text from PDF buffer
   */
  async extractTextFromPDF(buffer: Buffer): Promise<PdfExtractionResult> {
    try {
      // Use PDFParse class for proper PDF text extraction
      const pdfParser = new PDFParse({ data: buffer });
      const textResult = await pdfParser.getText();
      
      if (!textResult.text || textResult.text.trim().length === 0) {
        return {
          success: false,
          error: ResumeParseError.NO_EXTRACTABLE_TEXT
        };
      }

      // Check if PDF might be encrypted (PDFParse handles this but we can add extra checks)
      const info = await pdfParser.getInfo();
      if (info.info && info.info.Encrypted) {
        return {
          success: false,
          error: ResumeParseError.ENCRYPTED_PDF
        };
      }

      return {
        success: true,
        text: textResult.text // Temporarily disable cleaning to debug
      };

    } catch (error) {
      // Handle specific PDF parsing errors
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';
      
      if (errorMessage.includes('encrypted') || errorMessage.includes('password')) {
        return {
          success: false,
          error: ResumeParseError.ENCRYPTED_PDF
        };
      }
      
      if (errorMessage.includes('corrupt') || errorMessage.includes('invalid')) {
        return {
          success: false,
          error: ResumeParseError.CORRUPTED_FILE
        };
      }

      return {
        success: false,
        error: ResumeParseError.PDF_EXTRACTION_FAILED
      };
    }
  }

  /**
   * Parse resume text directly (without file upload)
   */
  parseResumeText(text: string): ResumeParseResult {
    return ResumeParser.parseResume(text);
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): ResumeValidationResult {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxFileSize / 1024 / 1024}MB`,
        maxSize: this.config.maxFileSize,
        allowedTypes: this.config.allowedMimeTypes
      };
    }

    // Check file type
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${this.config.allowedMimeTypes.join(', ')}`,
        maxSize: this.config.maxFileSize,
        allowedTypes: this.config.allowedMimeTypes
      };
    }

    // Check file extension
    const fileExtension = extname(file.originalname).toLowerCase();
    if (fileExtension !== '.pdf') {
      return {
        isValid: false,
        error: 'Invalid file extension. Only PDF files are allowed.',
        maxSize: this.config.maxFileSize,
        allowedTypes: this.config.allowedMimeTypes
      };
    }

    return {
      isValid: true,
      maxSize: this.config.maxFileSize,
      allowedTypes: this.config.allowedMimeTypes
    };
  }

  /**
   * Save file to storage
   */
  private async saveFile(file: Express.Multer.File): Promise<ResumeFileInfo> {
    // Ensure upload directory exists
    await this.ensureDirectoryExists(this.config.uploadPath);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const filename = `resume_${timestamp}_${randomString}.pdf`;
    const filePath = join(this.config.uploadPath, filename);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    return {
      originalName: file.originalname,
      filename,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Clean up file if processing fails
   */
  private async cleanupFile(filePath: string): Promise<void> {
    if (!this.config.enableFileCleanup) return;

    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore cleanup errors
    }
  }

  /**
   * Get file info for existing resume
   */
  async getResumeInfo(filename: string): Promise<ResumeFileInfo | null> {
    try {
      const filePath = join(this.config.uploadPath, filename);
      const stats = await fs.stat(filePath);
      
      return {
        originalName: filename,
        filename,
        path: filePath,
        size: stats.size,
        mimetype: 'application/pdf'
      };
    } catch {
      return null;
    }
  }

  /**
   * Delete resume file
   */
  async deleteResume(filename: string): Promise<boolean> {
    try {
      const filePath = join(this.config.uploadPath, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get service configuration
   */
  getConfig(): ResumeParserConfig {
    return { ...this.config };
  }

  /**
   * Update service configuration
   */
  updateConfig(newConfig: Partial<ResumeParserConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
