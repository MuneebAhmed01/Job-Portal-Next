'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LinkedInUser {
  id: string;
  name: string;
  email?: string;
  provider: string;
  profilePicture?: string;
  bio?: string;
  isProfileComplete: boolean;
  companyName?: string;
  role?: string;
}

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');
    const descriptionParam = searchParams.get('description');

    if (errorParam) {
      setError(descriptionParam || 'Authentication failed');
      setIsLoading(false);
      return;
    }

    if (!token || !userParam) {
      setError('Missing authentication parameters');
      setIsLoading(false);
      return;
    }

    try {
      const user: LinkedInUser = JSON.parse(decodeURIComponent(userParam));
      
      // Store authentication data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      // Redirect based on user role and profile completion
      if (user.role === 'employer') {
        router.push('/employer/dashboard');
      } else if (!user.isProfileComplete) {
        router.push('/complete-profile');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Failed to process authentication data');
      setIsLoading(false);
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing LinkedIn authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/auth/linkedin')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
