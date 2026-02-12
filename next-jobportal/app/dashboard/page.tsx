'use client';

import { useAuth } from '@/contexts/AuthContext';
import EmployerDashboard from './EmployerDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function DashboardPage() {
  const { user, isLoading, isEmployee, isEmployer } = useAuth();

  if (isLoading) {
    return (
      <>
        <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="relative bg-lienar-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-gray-400">You need to be signed in to access your dashboard.</p>
          </div>
        </div>
      </>
    );
  }

  // User type based rendering
  if (isEmployer) {
    return (
      <>
        <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <EmployerDashboard />
      </>
    );
  }

  if (isEmployee) {
    return (
      <>
        <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <EmployeeDashboard />
      </>
    );
  }

  return (
    <>
      <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid User Type</h1>
          <p className="text-gray-400">Your user type is not recognized.</p>
        </div>
      </div>
    </>
  );
}
