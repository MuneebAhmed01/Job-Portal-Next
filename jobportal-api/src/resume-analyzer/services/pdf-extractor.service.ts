import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class PdfExtractorService {
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      // Create temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      const tempFilePath = path.join(tempDir, `resume_${Date.now()}.pdf`);
      fs.writeFileSync(tempFilePath, buffer);

      try {
        // Try using pdftotext (most reliable)
        const { stdout } = await execAsync(`pdftotext "${tempFilePath}" -`);
        return stdout.trim();
      } catch (error) {
        // Fallback to pdf-parse if pdftotext is not available
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text;
      }
    } catch (error) {
      throw new Error('Failed to extract text from PDF');
    }
  }

  async isValidPdf(buffer: Buffer): Promise<boolean> {
    try {
      const pdfHeader = buffer.slice(0, 4).toString();
      return pdfHeader === '%PDF';
    } catch {
      return false;
    }
  }
}
