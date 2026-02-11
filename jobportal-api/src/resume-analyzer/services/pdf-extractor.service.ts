import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Dynamic import for pdf-parse to handle ESM module
async function getPdfParse() {
  const pdfParseModule = await import('pdf-parse');
  return pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse;
}

@Injectable()
export class PdfExtractorService {
  private readonly logger = new Logger(PdfExtractorService.name);

  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    let tempFilePath: string | null = null;
    
    try {
      this.logger.log(`Starting PDF extraction for buffer of size: ${buffer.length} bytes`);
      
      // Create temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      tempFilePath = path.join(tempDir, `resume_${Date.now()}.pdf`);
      fs.writeFileSync(tempFilePath, buffer);
      this.logger.log(`Temporary PDF created at: ${tempFilePath}`);

      try {
        // Try using pdftotext (most reliable) - skip on Windows as it's rarely installed
        if (process.platform !== 'win32') {
          this.logger.log('Attempting pdftotext extraction');
          const { stdout } = await execAsync(`pdftotext "${tempFilePath}" -`);
          const extractedText = stdout.trim();
          this.logger.log(`pdftotext extraction successful, extracted ${extractedText.length} characters`);
          return extractedText;
        } else {
          this.logger.log('Skipping pdftotext on Windows platform');
        }
      } catch (error) {
        this.logger.log('pdftotext not available, falling back to pdf-parse');
      }

      // Use pdf-parse as primary method on Windows, fallback on other platforms
      this.logger.log('Attempting pdf-parse extraction');
      try {
        const PDFParseClass = await getPdfParse();
        const parser = new PDFParseClass({ data: buffer });
        const result = await parser.getText();
        const extractedText = result.text || result.pages?.map(p => p.text).join('\n') || '';
        
        this.logger.log(`pdf-parse extraction result: ${extractedText?.length || 0} characters`);
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('PDF appears to be empty or contains no extractable text');
        }
        
        // Clean up the parser
        await parser.destroy();
        
        return extractedText;
      } catch (pdfParseError) {
        this.logger.error(`pdf-parse failed: ${pdfParseError.message}`, pdfParseError.stack);
        throw new Error(`PDF parsing failed: ${pdfParseError.message}`);
      }
    } catch (error) {
      this.logger.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    } finally {
      // Clean up temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
          this.logger.log('Temporary file cleaned up successfully');
        } catch (cleanupError) {
          this.logger.warn('Failed to cleanup temporary file:', cleanupError);
        }
      }
    }
  }

  async isValidPdf(buffer: Buffer): Promise<boolean> {
    try {
      this.logger.log(`Validating PDF buffer of size: ${buffer?.length || 0} bytes`);
      
      // Check minimum file size (PDF headers are at least 5 bytes)
      if (!buffer || buffer.length < 5) {
        this.logger.warn('PDF validation failed: Buffer too small or empty');
        return false;
      }
      
      // Check PDF signature
      const pdfHeader = buffer.slice(0, 5).toString();
      const isValid = pdfHeader === '%PDF-';
      
      if (isValid) {
        this.logger.log('PDF validation passed');
      } else {
        this.logger.warn(`PDF validation failed: Invalid header "${pdfHeader}"`);
      }
      
      return isValid;
    } catch (error) {
      this.logger.error('PDF validation error:', error);
      return false;
    }
  }
}
