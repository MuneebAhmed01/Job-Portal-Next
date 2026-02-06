'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import JobForm from '@/components/JobForm';
import { Job } from '@/types/job';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:3001/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Job Portal</h1>
        
        {/* Job Creation Form */}
        <div className="mb-12">
          <JobForm onJobCreated={fetchJobs} />
        </div>

        {/* Job Listings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Jobs</h2>
          
          {loading && (
            <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
          )}
          
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          {!loading && !error && jobs.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">No jobs available. Be the first to post one!</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
