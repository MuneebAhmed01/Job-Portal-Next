/**
 * Resume Parser Types
 * Defines interfaces for resume parsing functionality
 */

export interface ParsedResume {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  rawText: string;
}

export interface ResumeParseResult {
  success: boolean;
  data?: ParsedResume;
  error?: string;
  message?: string;
}

export interface ResumeUploadResponse {
  success: boolean;
  data?: {
    parsedResume: ParsedResume;
    resumeUrl: string;
  };
  error?: string;
  message?: string;
}

export interface PdfExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export interface ResumeFileInfo {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}

export interface ResumeValidationResult {
  isValid: boolean;
  error?: string;
  maxSize: number;
  allowedTypes: string[];
}

// Regex patterns for extraction
export interface ResumePatterns {
  email: RegExp;
  phoneTurkey: RegExp;
  phoneInternational: RegExp;
  namePattern: RegExp;
  objectiveSection: RegExp;
  summarySection: RegExp;
  profileSection: RegExp;
  bioLikeSections: RegExp;
}

// Section types for bio extraction
export type BioSectionType = 'objective' | 'summary' | 'profile';

// Error types
export enum ResumeParseError {
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  PDF_EXTRACTION_FAILED = 'PDF_EXTRACTION_FAILED',
  ENCRYPTED_PDF = 'ENCRYPTED_PDF',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
  NO_EXTRACTABLE_TEXT = 'NO_EXTRACTABLE_TEXT',
  PARSING_FAILED = 'PARSING_FAILED'
}

// Configuration interface
export interface ResumeParserConfig {
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  uploadPath: string;
  enableFileCleanup: boolean;
}
