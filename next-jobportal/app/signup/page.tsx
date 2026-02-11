'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthOverlay from '@/components/AuthOverlay';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
      <AuthOverlay 
        isOpen={true} 
        onClose={() => router.push('/')} 
      />
    </div>
  );
}
