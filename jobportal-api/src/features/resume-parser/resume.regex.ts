/**
 * Resume Regex Patterns
 * Contains all regex patterns for extracting information from resume text
 */

import { ResumePatterns } from './resume.types';

export const RESUME_PATTERNS: ResumePatterns = {
  /**
   * Email pattern - matches standard email formats
   * Case insensitive to catch emails in any case
   */
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,

  /**
   * Turkish phone number pattern - prioritizes +90 numbers
   * Matches +90 followed by 10 digits with optional spaces and flexible grouping
   */
  phoneTurkey: /\+90\s*\d{1,4}\s*\d{1,6}/,

  /**
   * International phone number pattern - fallback option
   * Matches optional + followed by 10-15 digits
   */
  phoneInternational: /\+?\d{10,15}/,

  /**
   * Name pattern - extracts capitalized words at the beginning
   * Looks for 1-3 consecutive capitalized words (likely name)
   * Excludes words like Resume, CV, Profile, Application, etc.
   * More flexible to handle various resume formats
   */
  namePattern: /(?:^|\n)(?!.*?(RESUME|CV|PROFILE|CURRICULUM|VITAE|APPLICATION|LETTER|COVER|SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|CONTACT|EMAIL|PHONE|LINKEDIN|GITHUB))([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})(?=\s|\n|$)/m,

  /**
   * Bio section pattern - matches "Objective" headings
   * Case insensitive with various formatting options
   */
  objectiveSection: /(?:OBJECTIVE|OBJECTIVES?|CAREER\s+OBJECTIVE|PROFESSIONAL\s+OBJECTIVE)[\s:\-]*\s*\n+(.+?)(?=\n\s*[A-Z][A-Z\s]*\s*\n|\n\s*\n|$)/is,

  /**
   * Summary section pattern - matches "Summary" headings
   * Case insensitive with various formatting options
   */
  summarySection: /(?:SUMMARY|PROFESSIONAL\s+SUMMARY|EXECUTIVE\s+SUMMARY|PERSONAL\s+SUMMARY)[\s:\-]*\s*\n+(.+?)(?=\n\s*[A-Z][A-Z\s]*\s*\n|\n\s*\n|$)/is,

  /**
   * Profile section pattern - matches "Profile" headings
   * Case insensitive with various formatting options
   */
  profileSection: /(?:PROFILE|PROFESSIONAL\s+PROFILE|PERSONAL\s+PROFILE|ABOUT\s+ME|ABOUT)[\s:\-]*\s*\n+(.+?)(?=\n\s*[A-Z][A-Z\s]*\s*\n|\n\s*\n|$)/is,

  /**
   * Additional bio-like sections pattern
   * Matches other common bio section headings
   */
  bioLikeSections: /(?:INTRODUCTION|OVERVIEW|BACKGROUND|QUALIFICATIONS|SUMMARY\s+OF\s+QUALIFICATIONS|KEY\s+QUALIFICATIONS|CAREER\s+SUMMARY|PERSONAL\s+STATEMENT)[\s:\-]*\s*\n+(.+?)(?=\n\s*[A-Z][A-Z\s]*\s*\n|\n\s*\n|$)/is,
};

/**
 * Additional utility patterns for text cleaning and validation
 */
export const UTILITY_PATTERNS = {
  /**
   * Non-printable characters - removes weird symbols
   * Keeps only standard ASCII characters and basic punctuation
   */
  nonPrintable: /[^\x20-\x7E\n\r\t]/g,

  /**
   * Multiple whitespace - normalizes spacing
   * Replaces multiple spaces/tabs/newlines with single space
   */
  multipleWhitespace: /\s+/g,

  /**
   * Excessive newlines - cleans up formatting
   * Replaces 3+ consecutive newlines with 2 newlines
   */
  excessiveNewlines: /\n{3,}/g,

  /**
   * Words to exclude from name extraction
   * Common resume header words that might be confused with names
   */
  excludeFromName: [
    'RESUME', 'CV', 'PROFILE', 'CURRICULUM', 'VITAE', 
    'APPLICATION', 'LETTER', 'COVER', 'PAGE'
  ],

  /**
   * Section heading patterns - identifies different resume sections
   * Used to avoid extracting section headings as bio content
   */
  sectionHeadings: [
    'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS',
    'AWARDS', 'PUBLICATIONS', 'REFERENCES', 'CONTACT', 'PERSONAL',
    'HOBBIES', 'INTERESTS', 'LANGUAGES', 'ACTIVITIES', 'VOLUNTEER'
  ]
};

/**
 * Pattern matching utilities
 */
export class PatternMatcher {
  /**
   * Extract email from text
   */
  static extractEmail(text: string): string | null {
    const match = text.match(RESUME_PATTERNS.email);
    return match ? match[0].trim() : null;
  }

  /**
   * Extract phone number with Pakistani and Turkish priority
   */
  static extractPhone(text: string): string | null {
    // Try Pakistani phone patterns first (+92 and 03)
    const pakistaniPatterns = [
      /\+92\s*\d{2,4}\s*\d{6,8}/,    // +92 300 1234567, +92 30 12345678
      /\+92\s*\d{10}/,                // +92 3001234567
      /\+92\d{10}/,                    // +923001234567
      /03\d{2}\s*\d{7,8}/,            // 0300 1234567, 0312 12345678
      /03\d{9}/,                       // 03001234567
    ];

    for (const pattern of pakistaniPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].replace(/\s+/g, '').trim();
      }
    }

    // Try Turkish phone patterns
    const turkishPatterns = [
      /\+90\s*\d{3}\s*\d{3}\s*\d{4}/,  // +90 332 4440269
      /\+90\s*\d{10}/,                    // +90 3324440269
      /\+90\d{10}/,                      // +903324440269
      /\+90\s*\d{1,3}\s*\d{3,4}/,   // +90 532 4440269
      /\+90\s*\d{2,3}\s*\d{2,4}/,   // +90 53 2440269
    ];

    for (const pattern of turkishPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].replace(/\s+/g, '').trim();
      }
    }

    // Fallback to international format
    const internationalMatch = text.match(RESUME_PATTERNS.phoneInternational);
    if (internationalMatch) {
      return internationalMatch[0].replace(/\s+/g, '').trim();
    }

    return null;
  }

  /**
   * Extract full name from the beginning of resume
   */
  static extractName(text: string): string | null {
    const lines = text.split('\n').slice(0, 10); // Check first 10 lines
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Skip if line contains excluded words
      const hasExcludedWord = UTILITY_PATTERNS.excludeFromName.some(word => 
        trimmedLine.toUpperCase().includes(word)
      );
      
      if (hasExcludedWord) continue;

      // Try to match name pattern - look for 1-3 capitalized words
      // More flexible pattern to handle various formats
      const nameMatch = trimmedLine.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})(?:\s+|$)/);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }

    // Fallback: try to extract from the very beginning of text
    const textBeginning = text.substring(0, 100);
    const fallbackMatch = textBeginning.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/);
    if (fallbackMatch) {
      const potentialName = fallbackMatch[1];
      // Make sure it's not a common resume header
      if (!UTILITY_PATTERNS.excludeFromName.some(word => 
        potentialName.toUpperCase().includes(word)
      )) {
        return potentialName;
      }
    }

    return null;
  }

  /**
   * Extract bio/objective/summary from resume sections
   */
  static extractBio(text: string): string | null {
    // Try each section pattern in order of preference
    const patterns = [
      RESUME_PATTERNS.objectiveSection,
      RESUME_PATTERNS.summarySection,
      RESUME_PATTERNS.profileSection,
      RESUME_PATTERNS.bioLikeSections
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        let bio = match[1].trim();
        
        // Clean up the bio text
        bio = bio.replace(/\n{3,}/g, ' ') // Replace multiple newlines with space
               .replace(/\s+/g, ' ')     // Normalize whitespace
               .trim();
        
        // Ensure it's not too short (likely a heading)
        if (bio.length > 20) {
          return bio;
        }
      }
    }

    // Fallback: try to extract first paragraph that looks like a bio
    // Look for text at the beginning that might be a summary/intro
    const lines = text.split('\n');
    let potentialBio = '';
    
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and obvious headers
      if (!line || this.isSectionHeader(line)) {
        continue;
      }
      
      // Stop if we hit experience/education sections
      if (this.isMainSection(line)) {
        break;
      }
      
      potentialBio += line + ' ';
      
      // Stop if we have a substantial paragraph
      if (potentialBio.length > 100) {
        break;
      }
    }
    
    potentialBio = potentialBio.trim();
    if (potentialBio.length > 30) {
      return potentialBio;
    }

    return null;
  }

  /**
   * Check if a line is a section header
   */
  private static isSectionHeader(line: string): boolean {
    const upperLine = line.toUpperCase().trim();
    const headers = [
      'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS',
      'AWARDS', 'PUBLICATIONS', 'REFERENCES', 'CONTACT', 'PERSONAL',
      'HOBBIES', 'INTERESTS', 'LANGUAGES', 'ACTIVITIES', 'VOLUNTEER',
      'OBJECTIVE', 'SUMMARY', 'PROFILE', 'INTRODUCTION', 'OVERVIEW'
    ];
    return headers.some(header => upperLine.includes(header));
  }

  /**
   * Check if a line is a main section (should stop bio extraction)
   */
  private static isMainSection(line: string): boolean {
    const upperLine = line.toUpperCase().trim();
    const mainSections = [
      'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE',
      'EDUCATION', 'ACADEMIC', 'QUALIFICATIONS',
      'SKILLS', 'TECHNICAL SKILLS', 'PROJECTS'
    ];
    return mainSections.some(section => upperLine.includes(section));
  }

  /**
   * Clean extracted bio text
   */
  static cleanBioText(text: string): string {
    return text.replace(/\n{3,}/g, ' ') // Replace multiple newlines with space
               .replace(/\s+/g, ' ')     // Normalize whitespace
               .trim();
  }

  /**
   * Clean raw text from PDF
   */
  static cleanRawText(text: string): string {
    // Remove non-printable characters but preserve digits for phone extraction
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters (0-31)
               .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2 newlines
               .replace(/[ \t]+/g, ' ')     // Normalize spaces and tabs but preserve newlines
               .trim();
  }

  }
