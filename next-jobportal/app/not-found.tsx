'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    // Set page title
    document.title = 'Page Not Found - JobForge';
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <AlertCircle className="mx-auto h-16 w-16 text-orange-400 mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <h2 className="text-xl text-gray-300 mb-8">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
          >
            <Home size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
