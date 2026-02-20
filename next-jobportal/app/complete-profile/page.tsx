'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface LinkedInUser {
  id: string;
  name: string;
  email?: string;
  provider: string;
  profilePicture?: string;
  bio?: string;
  isProfileComplete: boolean;
  role?: string;
  userType?: 'employee' | 'employer' | 'admin';
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, updateUser, token: authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<LinkedInUser | null>(null);
  const [formData, setFormData] = useState({
    phone: '',
    bio: '',
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      router.push('/auth/linkedin');
      return;
    }

    try {
      const userData: LinkedInUser = JSON.parse(decodeURIComponent(userParam));
      const normalizedUser = {
        ...userData,
        userType: userData.userType || (userData.role as 'employee' | 'employer' | 'admin' | undefined),
      };
      setUser(normalizedUser);

      login(normalizedUser as any, token);
      
      // Pre-fill form data
      setFormData(prev => ({
        ...prev,
        bio: userData.bio || '',
      }));
      
      setIsLoading(false);
    } catch (err) {
      router.push('/auth/linkedin');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = authToken || localStorage.getItem('token');
      
      const profilePayload: Record<string, string> = {};
      if (formData.phone.trim()) {
        profilePayload.phone = formData.phone.trim();
      }
      if (formData.bio.trim()) {
        profilePayload.bio = formData.bio.trim();
      }

      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/employee/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profilePayload),
      });

      if (!profileResponse.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          const errorBody = await profileResponse.json();
          if (errorBody?.message) {
            errorMessage = Array.isArray(errorBody.message)
              ? errorBody.message.join(', ')
              : String(errorBody.message);
          }
        } catch {
        }
        throw new Error(errorMessage);
      }

      // Get updated user data from backend response
      const updatedProfileData = await profileResponse.json();
      console.log('Backend response after profile update:', updatedProfileData);

      if (formData.resume) {
        const resumeData = new FormData();
        resumeData.append('resume', formData.resume);

        const resumeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/employee/resume`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: resumeData,
        });

        if (!resumeResponse.ok) {
          throw new Error('Failed to upload resume');
        }
      }

      // Use backend response data which should have isProfileComplete: true
      console.log('Updating user with data:', updatedProfileData);
      updateUser(updatedProfileData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      const token = authToken || localStorage.getItem('token');
      
      // Mark profile as complete even if user skips
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/employee/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: '0334-3773477', // Use existing phone
          bio: 'Profile completed via skip',
        }),
      });

      if (profileResponse.ok) {
        const updatedProfileData = await profileResponse.json();
        updateUser(updatedProfileData);
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Skip profile error:', error);
      // Still redirect to dashboard even if update fails
      router.push('/dashboard');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="mt-1 text-sm text-gray-600">
              Welcome {user.name}! Please provide a few more details to complete your profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio / Professional Summary
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about your professional experience and career goals..."
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                Resume (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="resume"
                        name="resume"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  {formData.resume && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.resume.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
