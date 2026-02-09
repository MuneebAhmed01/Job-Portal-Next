'use client';

import { useState } from 'react';
import { X, MapPin, IndianRupee, Building2, Clock, Calendar } from 'lucide-react';
import { Job } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';

interface JobDetailOverlayProps {
  job: Job;
  onClose: () => void;
}

export default function JobDetailOverlay({ job, onClose }: JobDetailOverlayProps) {
  const { user, token } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!user) {
      setError('Please sign in to apply');
      return;
    }

    setApplying(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to apply');
      }

      setApplied(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="text-gray-500 dark:text-gray-400" size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Job Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            {job.company && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Building2 size={18} />
                <span>{job.company}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MapPin size={18} />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <IndianRupee size={18} />
                <span>{job.salary}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Clock size={18} />
                <span>{job.type}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar size={18} />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {applied && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg">
              You have successfully applied for this job! Your resume has been sent to the employer.
            </div>
          )}
        </div>

        {/* Footer with Apply Button */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {applied ? (
            <button
              disabled
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold cursor-default"
            >
              Applied Successfully
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your profile and resume will be shared with the employer
          </p>
        </div>
      </div>
    </div>
  );
}
