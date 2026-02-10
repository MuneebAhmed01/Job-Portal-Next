'use client';

import { useState } from 'react';
import { X, MapPin, IndianRupee, Building2, Clock, Calendar, Heart } from 'lucide-react';
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
  const [saved, setSaved] = useState(job.saved || false);
  const [error, setError] = useState('');

  const handleSaveJob = async () => {
    if (!user) {
      setError('Please sign in to save jobs');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${job.id}/save`, {
        method: saved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || (saved ? 'Failed to unsave job' : 'Failed to save job'));
      }

      setSaved(!saved);
      setError('');
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
      
      <div className="relative bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{job.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveJob}
              className={`p-2 rounded-lg transition-colors ${
                saved
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-red-400'
              }`}
              title={saved ? 'Unsave job' : 'Save job'}
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="text-gray-400" size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Job Meta */}
          <div className="flex flex-wrap gap-4 mb-6">
            {job.company && (
              <div className="flex items-center gap-2 text-gray-400">
                <Building2 size={18} />
                <span>{job.company}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={18} />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2 text-gray-400">
                 
                <span>{job.salary}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={18} />
                <span>{job.type}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={18} />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Job Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {job.description}
            </p>
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
        <div className="p-6 border-t border-gray-700 bg-gray-900">
          {applied ? (
            <button
              disabled
              className="w-full py-3 bg-linear-to-t600 text-white rounded-xl font-semibold cursor-default"
            >
              Applied Successfully
            </button>
          ) : (
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full py-3 bg-linear-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
          <p className="text-center text-sm text-gray-400 mt-2">
            Your profile and resume will be shared with the employer
          </p>
        </div>
      </div>
    </div>
  );
}
