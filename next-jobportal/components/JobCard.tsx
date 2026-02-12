'use client';

import { useState } from 'react';
import { Job } from '@/types/job';
import JobDetailOverlay from './JobDetailOverlay';

interface JobCardProps {
  job: Job;
  onSaveChange?: (jobId: string, saved: boolean) => void;
  onApplyChange?: (jobId: string, applied: boolean) => void;
}

export default function JobCard({ job, onSaveChange, onApplyChange }: JobCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="bg-linear-to-b rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-xl font-semibold text-white min-h-[3.5rem] line-clamp-2" title={job.title}>
            {job.title}
          </h3>
          <p className="text-gray-400 font-medium">
            {job.employer?.companyName || 'Company'}
          </p>
        </div>
        <span className="bg-linear-to-t900 text-green-200 text-sm px-3 py-1 rounded-full whitespace-nowrap shrink-0">
          {job.salaryRange}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-gray-400 mb-4">
        {job.type !== 'REMOTE' && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        )}
        <span 
          className={`text-xs px-2 py-1 rounded-full ${
            job.type === 'HYBRID' ? 'bg-amber-900/50 text-amber-300' :
            job.type === 'ONSITE' ? 'bg-gray-700 text-gray-300' : 'text-white'
          }`}
          style={job.type === 'REMOTE' ? { backgroundColor: '#364153' } : {}}
        >
          {job.type}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm line-clamp-3 flex-1">
        {job.description}
      </p>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => setShowDetails(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-white/10"
          style={{ backgroundColor: '#F54900' }}
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
        onApplyChange={onApplyChange}
      />
    )}
  </>
);
}
