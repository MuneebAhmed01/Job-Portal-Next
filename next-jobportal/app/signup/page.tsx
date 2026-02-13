'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Mail, Lock, Phone, FileText, Building2, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { employeeSignupSchema, employerSignupSchema, getZodErrors } from '@/lib/validations';
import GoogleLoginButton from '@/components/GoogleLoginButton';

type UserType = 'employee' | 'employer';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [userType, setUserType] = useState<UserType>('employee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    bio: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    // Validate with Zod
    const schema = userType === 'employer' ? employerSignupSchema : employeeSignupSchema;
    const dataToValidate = userType === 'employer'
      ? { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, companyName: formData.companyName, bio: formData.bio || undefined }
      : { name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, bio: formData.bio || undefined };
    
    const result = schema.safeParse(dataToValidate);
    if (!result.success) {
      setFieldErrors(getZodErrors(result.error));
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userType', userType);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      
      if (userType === 'employer') {
        formDataToSend.append('companyName', formData.companyName);
      }
      
      if (formData.bio) formDataToSend.append('bio', formData.bio);
      if (resume) formDataToSend.append('resume', resume);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      login(data.user, data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else if (file) {
      setError('Please upload a PDF file');
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
            Your Gateway to<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600">Career Success</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            Connect with opportunities that match your skills and aspirations. Start your journey today.
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
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-900 overflow-y-auto relative">
        {/* Admin Shield - Top Right (goes to signin for admin) */}
        <Link href="/signin" className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 opacity-40 hover:opacity-100 transition-opacity" title="Admin">
          <Image src="/shield.png" alt="Admin" width={24} height={24} />
        </Link>
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
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join our community and get started</p>
          </div>
          
          {/* User Type Toggle */}
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
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              {fieldErrors.name && <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>}
            </div>
            
            {/* Company Name - Employer Only */}
            {userType === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Acme Inc."
                  />
                </div>
                {fieldErrors.companyName && <p className="mt-1 text-sm text-red-400">{fieldErrors.companyName}</p>}
              </div>
            )}
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="+1234567890"
                />
              </div>
              {fieldErrors.phone && <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="you@example.com"
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
                  className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              {fieldErrors.password && <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>}
            </div>
            
            {/* Resume - Employee Only */}
            {userType === 'employee' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF, Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center gap-3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-750 hover:border-slate-600 transition-colors"
                  >
                    <FileText className="text-gray-500" size={18} />
                    <span className="text-gray-400 truncate">
                      {resume ? resume.name : 'Choose PDF file'}
                    </span>
                  </label>
                </div>
              </div>
            )}
            
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio (Optional)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none transition-colors"
                placeholder={userType === 'employee' ? 'Tell us about yourself...' : 'Tell us about your company...'}
                rows={3}
              />
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: '#F54900' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Create {userType === 'employee' ? 'Employee' : 'Employer'} Account</>
              )}
            </button>
          </form>
          
          {/* Google Sign-Up */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-gray-500">or</span>
            </div>
          </div>
          <GoogleLoginButton role={userType} />
          
          {/* Sign In Link */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{' '}
            <Link href="/signin" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
