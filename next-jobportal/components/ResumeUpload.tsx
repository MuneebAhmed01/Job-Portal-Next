'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ParsedResume {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  rawText: string;
}

interface ResumeUploadResponse {
  success: boolean;
  data?: {
    parsedResume: ParsedResume;
    resumeUrl: string;
  };
  error?: string;
  message?: string;
}

interface ResumeUploadProps {
  onResumeParsed?: (data: ParsedResume) => void;
  className?: string;
}

export default function ResumeUpload({ onResumeParsed, className = '' }: ResumeUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<ResumeUploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadResult({
        success: false,
        error: 'Only PDF files are allowed'
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setUploadResult({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ResumeUploadResponse = await response.json();

      if (result.success && result.data) {
        setUploadResult(result);
        onResumeParsed?.(result.data.parsedResume);
      } else {
        setUploadResult(result);
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Failed to upload resume. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadResult?.success 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-gray-600">Processing your resume...</p>
            <p className="text-sm text-gray-500">This may take a few seconds</p>
          </div>
        ) : uploadResult?.success ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-green-700 font-medium">Resume uploaded successfully!</p>
            <button
              onClick={openFileDialog}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Upload a different resume
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Upload your resume to auto-fill your profile
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your PDF file here, or click to browse
              </p>
            </div>
            <button
              onClick={openFileDialog}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose File
            </button>
            <p className="text-xs text-gray-400">
              PDF files only, maximum 5MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadResult?.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">Upload Failed</p>
            <p className="text-red-600 text-sm mt-1">{uploadResult.error}</p>
          </div>
        </div>
      )}

      {/* Parsed Data Preview */}
      {uploadResult?.success && uploadResult.data && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Extracted Information
          </h3>
          <div className="space-y-2 text-sm">
            {uploadResult.data.parsedResume.fullName && (
              <div>
                <span className="font-medium text-gray-600">Name:</span>
                <span className="ml-2 text-gray-800">{uploadResult.data.parsedResume.fullName}</span>
              </div>
            )}
            {uploadResult.data.parsedResume.email && (
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <span className="ml-2 text-gray-800">{uploadResult.data.parsedResume.email}</span>
              </div>
            )}
            {uploadResult.data.parsedResume.phone && (
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <span className="ml-2 text-gray-800">{uploadResult.data.parsedResume.phone}</span>
              </div>
            )}
            {uploadResult.data.parsedResume.bio && (
              <div>
                <span className="font-medium text-gray-600">Bio/Objective:</span>
                <p className="mt-1 text-gray-800 italic">{uploadResult.data.parsedResume.bio}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
