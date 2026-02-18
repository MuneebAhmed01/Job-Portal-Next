/**
 * Resume Parser
 * Core parsing logic for extracting information from resume text
 */

import { ParsedResume, ResumeParseResult, BioSectionType } from './resume.types';
import { PatternMatcher } from './resume.regex';

export class ResumeParser {
  /**
   * Parse resume text and extract structured information
   */
  static parseResume(text: string): ResumeParseResult {
    try {
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          error: 'No text provided for parsing'
        };
      }

      const cleanedText = PatternMatcher.cleanRawText(text);
      console.log('=== PARSER DEBUG ===');
      console.log('Original text:', text);
      console.log('Cleaned text:', cleanedText);
      console.log('Text length:', cleanedText.length);

      const parsedResume: ParsedResume = {
        fullName: this.extractFullName(cleanedText),
        email: this.extractEmail(cleanedText),
        phone: this.extractPhone(cleanedText),
        bio: this.extractBio(cleanedText),
        rawText: cleanedText
      };

      console.log('Parsed resume:', parsedResume);

      return {
        success: true,
        data: parsedResume
      };

    } catch (error) {
      return {
        success: false,
        error: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Extract full name using heuristics
   */
  private static extractFullName(text: string): string | null {
    return PatternMatcher.extractName(text);
  }

  /**
   * Extract email address
   */
  private static extractEmail(text: string): string | null {
    return PatternMatcher.extractEmail(text);
  }

  /**
   * Extract phone number with Turkish priority
   */
  private static extractPhone(text: string): string | null {
    return PatternMatcher.extractPhone(text);
  }

  /**
   * Extract bio/objective/summary section
   */
  private static extractBio(text: string): string | null {
    return PatternMatcher.extractBio(text);
  }

  /**
   * Validate extracted information
   */
  static validateParsedResume(resume: ParsedResume): {
    isValid: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];

    if (!resume.fullName) {
      warnings.push('Could not extract full name');
    }

    if (!resume.email) {
      warnings.push('Could not extract email address');
    }

    if (!resume.phone) {
      warnings.push('Could not extract phone number');
    }

    if (!resume.bio) {
      warnings.push('Could not extract bio/objective section');
    }

    // Validate email format if present
    if (resume.email && !this.isValidEmail(resume.email)) {
      warnings.push('Extracted email format appears invalid');
    }

    // Validate phone format if present
    if (resume.phone && !this.isValidPhone(resume.phone)) {
      warnings.push('Extracted phone format appears invalid');
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format
   */
  private static isValidPhone(phone: string): boolean {
    // Remove all non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // Check if it's a valid Pakistani format
    if (cleanPhone.startsWith('+92')) {
      return cleanPhone.length === 13; // +92 + 10 digits
    } else if (cleanPhone.startsWith('03')) {
      return cleanPhone.length === 11; // 03 + 9 digits
    }
    // Check if it's a valid Turkish format
    else if (cleanPhone.startsWith('+90')) {
      return cleanPhone.length === 13; // +90 + 10 digits
    } else if (cleanPhone.startsWith('+')) {
      return cleanPhone.length >= 11 && cleanPhone.length <= 16; // International format
    } else {
      return cleanPhone.length >= 10 && cleanPhone.length <= 15; // Local format
    }
  }

  /**
   * Extract specific bio section type
   */
  static extractBioSection(text: string, sectionType: BioSectionType): string | null {
    const cleanedText = PatternMatcher.cleanRawText(text);
    
    switch (sectionType) {
      case 'objective':
        return this.extractObjective(cleanedText);
      case 'summary':
        return this.extractSummary(cleanedText);
      case 'profile':
        return this.extractProfile(cleanedText);
      default:
        return PatternMatcher.extractBio(cleanedText);
    }
  }

  /**
   * Extract objective section specifically
   */
  private static extractObjective(text: string): string | null {
    const objectivePattern = /(?:OBJECTIVE|OBJECTIVES?)[\s:]*\n+(.+?)(?=\n[A-Z][A-Z\s]*\n|\n\n|$)/is;
    const match = text.match(objectivePattern);
    return match && match[1] ? PatternMatcher.cleanBioText(match[1].trim()) : null;
  }

  /**
   * Extract summary section specifically
   */
  private static extractSummary(text: string): string | null {
    const summaryPattern = /(?:SUMMARY|PROFESSIONAL\s+SUMMARY|EXECUTIVE\s+SUMMARY)[\s:]*\n+(.+?)(?=\n[A-Z][A-Z\s]*\n|\n\n|$)/is;
    const match = text.match(summaryPattern);
    return match && match[1] ? PatternMatcher.cleanBioText(match[1].trim()) : null;
  }

  /**
   * Extract profile section specifically
   */
  private static extractProfile(text: string): string | null {
    const profilePattern = /(?:PROFILE|PROFESSIONAL\s+PROFILE|PERSONAL\s+PROFILE)[\s:]*\n+(.+?)(?=\n[A-Z][A-Z\s]*\n|\n\n|$)/is;
    const match = text.match(profilePattern);
    return match && match[1] ? PatternMatcher.cleanBioText(match[1].trim()) : null;
  }

  /**
   * Get parsing statistics
   */
  static getParseStatistics(resume: ParsedResume): {
    extractedFields: number;
    totalFields: number;
    completionRate: number;
  } {
    const fields = ['fullName', 'email', 'phone', 'bio'];
    const extractedFields = fields.filter(field => resume[field as keyof ParsedResume] !== null).length;
    
    return {
      extractedFields,
      totalFields: fields.length,
      completionRate: Math.round((extractedFields / fields.length) * 100)
    };
  }
}
