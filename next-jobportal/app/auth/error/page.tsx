'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('Authentication failed');
  const [description, setDescription] = useState<string>('An unknown error occurred during authentication');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const descriptionParam = searchParams.get('description');

    if (errorParam) {
      setError(errorParam);
    }
    if (descriptionParam) {
      setDescription(descriptionParam);
    }
  }, [searchParams]);

  const getErrorSuggestion = (errorType: string): string => {
    switch (errorType) {
      case 'access_denied':
        return 'You denied access to your LinkedIn profile. Please try again and grant the necessary permissions.';
      case 'authentication_failed':
        return 'There was an issue with the authentication process. Please try again.';
      case 'employer_authentication_failed':
        return 'There was an issue with the employer authentication. Please try again.';
      case 'invalid_state':
        return 'Security validation failed. Please try again.';
      default:
        return 'Please check your LinkedIn credentials and try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          
          <p className="text-gray-600 mb-6">
            {description}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Suggestion:</strong> {getErrorSuggestion(error)}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/linkedin')}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Try LinkedIn Authentication Again
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500">
              If you continue to experience issues, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
