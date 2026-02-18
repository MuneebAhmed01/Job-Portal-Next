export interface ParsedResume {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  rawText: string;
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
