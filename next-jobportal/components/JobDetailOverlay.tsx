'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Building2, Clock, Calendar, Heart, FileText, Briefcase } from 'lucide-react';
import { Job } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';

interface JobDetailOverlayProps {
  job: Job;
  onClose: () => void;
  onSaveChange?: (jobId: string, saved: boolean) => void;
  onApplyChange?: (jobId: string, applied: boolean) => void;
}

export default function JobDetailOverlay({ job, onClose, onSaveChange, onApplyChange }: JobDetailOverlayProps) {
  const { user, token } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(job.saved || false);
  const [error, setError] = useState('');

  // Sync saved state with job prop when it changes
  useEffect(() => {
    setSaved(job.saved || false);
  }, [job.saved]);

  // Sync applied state with job prop when it changes
  useEffect(() => {
    setApplied(job.applied || false);
  }, [job.applied]);

  const handleSaveJob = async () => {
    if (!user) {
      setError('Please sign in to save jobs');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/jobs/${job.id}/save`, {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Clear the invalid token from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        
        throw new Error(data.message || (saved ? 'Failed to unsave job' : 'Failed to save job'));
      }

      setSaved(!saved);
      setError('');
      // Notify parent component of save state change
      if (onSaveChange) {
        onSaveChange(job.id, !saved);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (saved ? 'Failed to unsave job' : 'Failed to save job'));
    }
  };

  const handleApply = async () => {
    if (!user) {
      setError('Please sign in to apply');
      return;
    }

    setApplying(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3002/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          setError('Your session has expired. Please log in again.');
          // Clear the invalid token from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        
        // Handle "already applied" case gracefully
        if (response.status === 403 && data.message === 'You have already applied for this job') {
          setApplied(true);
          setError('');
          if (onApplyChange) {
            onApplyChange(job.id, true);
          }
          return;
        }
        
        throw new Error(data.message || 'Failed to apply');
      }

      setApplied(true);
      setError('');
      // Notify parent component of apply state change
      if (onApplyChange) {
        onApplyChange(job.id, true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="relative bg-linear-to-b from-gray-800 to-gray-700 p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
              {job.employer?.companyName && (
                <p className="text-base text-purple-400 font-medium">{job.employer.companyName}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveJob}
                className="p-2 rounded-lg transition-all bg-gray-600/50 hover:bg-gray-600/80 border border-gray-500/30"
                title={saved ? 'Unsave job' : 'Save job'}
              >
                <Heart 
                  size={20} 
                  fill={saved ? 'currentColor' : 'none'}
                  className={saved ? 'text-red-500' : 'text-gray-400 hover:text-red-400 transition-colors'}
                />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-600/50 rounded-lg transition-all border border-gray-500/30"
              >
                <X className="text-gray-400 hover:text-white transition-colors" size={22} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Company Info Section */}
          {job.employer?.companyName && (
            <div className="mb-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-3 mb-2">
                <Building2 size={20} className="text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Company</h3>
              </div>
              <p className="text-gray-200 text-lg">{job.employer.companyName}</p>
            </div>
          )}

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Location Section */}
            {job.location && (
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-blue-400" />
                  <h4 className="font-semibold text-white">Location</h4>
                </div>
                <p className="text-gray-200">{job.location}</p>
              </div>
            )}

            {/* Salary Section */}
            {job.salaryRange && (
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} className="text-green-400" />
                  <h4 className="font-semibold text-white">Salary Range</h4>
                </div>
                <p className="text-gray-200 text-lg font-medium">{job.salaryRange}</p>
              </div>
            )}

            {/* Job Status Section */}
            {job.status && (
              <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-orange-400" />
                  <h4 className="font-semibold text-white">Status</h4>
                </div>
                <p className="text-gray-200">{job.status}</p>
              </div>
            )}

            {/* Posted Date Section */}
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={18} className="text-purple-400" />
                <h4 className="font-semibold text-white">Posted</h4>
              </div>
              <p className="text-gray-200">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Job Description</h3>
            </div>
            <div className="p-4 bg-gray-700/20 rounded-lg border border-gray-600/20">
              <p className="text-gray-200 leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Additional Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-600/20">
                <p className="text-gray-400 text-sm mb-1">Application Status</p>
                <p className="text-white font-medium">
                  {applied ? '✅ Applied' : '📝 Not Applied'}
                </p>
              </div>
              <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-600/20">
                <p className="text-gray-400 text-sm mb-1">Saved Status</p>
                <p className="text-white font-medium">
                  {saved ? '❤️ Saved' : '🤍 Not Saved'}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {applied && (
            <div className="mb-4 p-3 bg-linear-to-t900 text-green-200 rounded-lg">
              You have successfully applied for this job! Your resume has been sent to the employer.
            </div>
          )}
        </div>

        {/* Footer with Apply Button */}
        <div className="p-6 border-t border-gray-700 bg-linear-to-b from-gray-800 to-gray-900">
          <div className="space-y-4">
            {applied ? (
              <div className="text-center">
                <button
                  disabled
                  className="w-full py-4 bg-green-600/20 border border-green-500/30 text-green-400 rounded-xl font-semibold cursor-default flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Applied Successfully
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  Application sent! Employer will review your profile.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full py-4 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <Briefcase size={20} />
                      Apply Now
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-400 mt-3 flex items-center justify-center gap-2 leading-relaxed">
                  <span className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-400 text-xs">i</span>
                  </span>
                  <span className="text-center">Your profile and resume will be shared with the employer</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
