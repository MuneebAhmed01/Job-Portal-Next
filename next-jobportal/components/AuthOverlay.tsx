'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { X, User, Lock, Mail, Phone, FileText, Briefcase, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthOverlay({ isOpen, onClose }: AuthOverlayProps) {
  const router = useRouter();
  const { login } = useAuth();
  const pathname = usePathname();
  
  // Determine if user should see signup or signin form based on current route
  const getInitialSignupState = () => {
    if (pathname?.includes('signup')) return true;
    if (pathname?.includes('signin')) return false;
    return true; // Default to signup
  };
  
  const [isSignup, setIsSignup] = useState(getInitialSignupState);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'FIND_JOB' as 'FIND_JOB' | 'HIRE_TALENT',
    bio: ''
  });
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        if (!resume) {
          setError('Resume is required');
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('role', formData.role);
        if (formData.bio) formDataToSend.append('bio', formData.bio);
        formDataToSend.append('resume', resume);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Signup failed');
        }

        // Store auth data
        login(data.user, data.token);
        onClose();
        
        // Redirect to dashboard (role-based rendering will handle UI)
        router.push('/dashboard');
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Signin failed');
        }

        // Store auth data
        login(data.user, data.token);
        onClose();
        
        // Redirect to dashboard (role-based rendering will handle UI)
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F54900' }}>
              <User className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              <p className="text-sm text-gray-400">{isSignup ? 'Join our community' : 'Sign in to continue'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">I want to</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'FIND_JOB' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.role === 'FIND_JOB'
                          ? 'border-orange-500 bg-orange-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Search className="mx-auto mb-2 text-orange-400" size={20} />
                      <span className="text-sm text-white">Find Job</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'HIRE_TALENT' })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.role === 'HIRE_TALENT'
                          ? 'border-orange-500 bg-orange-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Briefcase className="mx-auto mb-2 text-orange-400" size={20} />
                      <span className="text-sm text-white">Hire Talent</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resume (PDF required)</label>
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
                      className="flex items-center gap-3 p-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <FileText className="text-gray-400" size={18} />
                      <span className="text-gray-300 truncate">
                        {resume ? resume.name : 'Upload PDF Resume'}
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio (Optional)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email (Gmail only)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  placeholder="you@gmail.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" style={{ backgroundColor: '#F54900' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>{isSignup ? 'Create Account' : 'Sign In'}</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <Link 
                href={isSignup ? "/signin" : "/signup"}
                className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
