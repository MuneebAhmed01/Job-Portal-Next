'use client';

import { useState, useEffect } from 'react';
import JobCard from '@/components/JobCard';
import { Job } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function JobsPage() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      const res = await fetch(`${apiUrl}/jobs/all`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      
      // If user is logged in, fetch saved jobs to mark jobs as saved
      if (user && token) {
        const savedRes = await fetch(`${apiUrl}/jobs/saved`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          const savedJobIds = savedData.map((savedJob: any) => savedJob.jobId);
          
          // Mark jobs as saved if they exist in saved jobs
          const jobsWithSavedStatus = data.map((job: any) => ({
            ...job,
            saved: savedJobIds.includes(job.id)
          }));
          
          setJobs(jobsWithSavedStatus);
        } else {
          setJobs(data);
        }
      } else {
        setJobs(data);
      }
    } catch (err) {
      setError('Failed to load jobs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, token]);

  const handleSaveChange = (jobId: string, saved: boolean) => {
    // Update the jobs list to reflect save status
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved } : job
    ));
  };

  const handleApplyChange = (jobId: string, applied: boolean) => {
    // Update the jobs list to reflect apply status
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, applied } : job
    ));
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>
      <main className="min-h-screen pt-20 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Available Jobs</h1>

          {loading && (
            <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
          )}
          
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          {!loading && !error && jobs.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">No jobs available.</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onSaveChange={handleSaveChange}
                onApplyChange={handleApplyChange}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
