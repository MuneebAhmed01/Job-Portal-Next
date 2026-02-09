'use client';

import { useAuth } from '@/contexts/AuthContext';
import EmployerDashboard from './EmployerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400">You need to be signed in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Role-based rendering
  if (user.role === 'HIRE_TALENT') {
    return <EmployerDashboard />;
  }

  if (user.role === 'FIND_JOB') {
    return <EmployeeDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Invalid Role</h1>
        <p className="text-gray-400">Your user role is not recognized.</p>
      </div>
    </div>
  );
}
