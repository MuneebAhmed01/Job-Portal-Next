'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LinkedInButton } from './components/LinkedInButton';

export default function LinkedInAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const description = searchParams.get('description');
    
    if (error) {
      router.push(`/auth/error?error=${error}&description=${description}`);
    }
  }, [searchParams, router]);

  const handleLinkedInLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/linkedin`;
  };

  const handleLinkedInEmployerLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    window.location.href = `${backendUrl}/auth/linkedin/employer`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Continue with LinkedIn
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to sign in
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Job Seeker</h3>
            <LinkedInButton 
              onClick={handleLinkedInLogin}
              text="Continue with LinkedIn as Job Seeker"
              fullWidth
            />
          </div>
          
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Employer</h3>
            <LinkedInButton 
              onClick={handleLinkedInEmployerLogin}
              text="Continue with LinkedIn as Employer"
              fullWidth
              variant="employer"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
