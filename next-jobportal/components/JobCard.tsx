'use client';

import { useState } from 'react';
import { Job } from '@/types/job';
import JobDetailOverlay from './JobDetailOverlay';

interface JobCardProps {
  job: Job;
  onSaveChange?: (jobId: string, saved: boolean) => void;
}

export default function JobCard({ job, onSaveChange }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-linear-to-b rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {job.title}
          </h3>
          <p className="text-blue-400 font-medium">
            {job.company}
          </p>
        </div>
        <span className="bg-linear-to-t900 text-green-200 text-sm px-3 py-1 rounded-full">
          {job.salary}
        </span>
      </div>
      
      <div className="flex items-center text-gray-400 mb-4">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {job.location}
      </div>
      
      <p className="text-gray-300 text-sm line-clamp-3">
        {job.description}
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => setShowDetails(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>

    {showDetails && (
      <JobDetailOverlay 
        job={job} 
        onClose={() => setShowDetails(false)}
        onSaveChange={onSaveChange}
      />
    )}
  </>
);
}
