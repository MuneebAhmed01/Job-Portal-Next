'use client';

import { useState } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import { ParsedResume } from '@/types/resume';

export default function ResumeUploadDemo() {
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  const handleResumeParsed = (data: ParsedResume) => {
    setParsedData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Auto-Fill Demo
          </h1>
          <p className="text-gray-600">
            Upload your resume to automatically extract and fill your profile information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <ResumeUpload onResumeParsed={handleResumeParsed} />
        </div>

        {parsedData && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎉 Parsed Resume Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Profile Information</h3>
                
                {parsedData.fullName && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <label className="text-sm font-medium text-blue-700">Full Name</label>
                    <p className="text-blue-900 mt-1">{parsedData.fullName}</p>
                  </div>
                )}

                {parsedData.email && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <label className="text-sm font-medium text-green-700">Email</label>
                    <p className="text-green-900 mt-1">{parsedData.email}</p>
                  </div>
                )}

                {parsedData.phone && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <label className="text-sm font-medium text-purple-700">Phone</label>
                    <p className="text-purple-900 mt-1">{parsedData.phone}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Bio / Objective</h3>
                
                {parsedData.bio ? (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <label className="text-sm font-medium text-yellow-700">Professional Summary</label>
                    <p className="text-yellow-900 mt-1 text-sm leading-relaxed">
                      {parsedData.bio}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">
                      No bio/objective section found in the resume
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-gray-700 mb-3">Raw Text Preview</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {parsedData.rawText.substring(0, 500)}
                  {parsedData.rawText.length > 500 && '...'}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setParsedData(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use This Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
