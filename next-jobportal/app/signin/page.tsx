'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Building2, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signinSchema, getZodErrors } from '@/lib/validations';

type UserType = 'employee' | 'employer';

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [userType, setUserType] = useState<UserType>('employee');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    setFormData({ email: '', password: '' });
    setError('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError('');

    if (isAdminMode) {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Invalid admin credentials');
        }
        login(data.user, data.token);
        router.push('/admin/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = signinSchema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(getZodErrors(result.error));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          ...result.data,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { text: 'Find your dream job or perfect candidate' },
    { text: 'AI-powered resume analysis' },
    { text: 'Smart job matching algorithm' },
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Back Button - Above Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F54900' }}>
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white">JobPortal</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Welcome Back to<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">JobPortal</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            Sign in to continue your journey. Your next opportunity awaits.
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
                <span className="text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 relative">
        {/* Admin Shield - Top Right */}
        <button
          onClick={toggleAdminMode}
          className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-10 transition-opacity ${isAdminMode ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
          title={isAdminMode ? 'Back to user login' : 'Admin'}
        >
          <Image src="/shield.png" alt="Admin" width={24} height={24} />
        </button>
        {/* Back Button - Mobile Only */}
        <div className="p-4 sm:p-6 lg:hidden">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6 pb-6 sm:px-12 sm:pb-12 lg:pt-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAdminMode ? 'Admin Sign In' : 'Sign In'}
            </h2>
            <p className="text-gray-400">
              {isAdminMode ? 'Restricted access — authorized personnel only' : 'Welcome back! Please enter your details'}
            </p>
          </div>
          
          {/* User Type Toggle - Only for non-admin */}
          {!isAdminMode && (
            <div className="flex bg-slate-800 rounded-xl p-1 mb-8">
              <button
                type="button"
                onClick={() => setUserType('employee')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userType === 'employee'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setUserType('employer')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  userType === 'employer'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Employer
              </button>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    isAdminMode ? 'border-red-500/30 focus:border-red-500' : 'border-slate-700 focus:border-orange-500'
                  }`}
                  placeholder={isAdminMode ? 'admin@gmail.com' : 'you@example.com'}
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>}
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    isAdminMode ? 'border-red-500/30 focus:border-red-500' : 'border-slate-700 focus:border-orange-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {fieldErrors.password && <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: isAdminMode ? '#dc2626' : '#F54900' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isAdminMode ? 'Authenticating...' : 'Signing In...'}
                </>
              ) : isAdminMode ? (
                'Sign In as Admin'
              ) : (
                <>Sign In as {userType === 'employee' ? 'Employee' : 'Employer'}</>
              )}
            </button>
          </form>
          
          {/* Sign Up Link - Only for non-admin */}
          {!isAdminMode && (
            <p className="mt-8 text-center text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
          )}

          {/* Back to user login - Only for admin */}
          {isAdminMode && (
            <button
              onClick={toggleAdminMode}
              className="mt-8 w-full text-center text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              ← Back to User Sign In
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
