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
      
      // If user is logged in, fetch saved jobs and applied jobs to mark jobs accordingly
      if (user && token) {
        const [savedRes, appliedRes] = await Promise.all([
          fetch(`${apiUrl}/jobs/saved`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${apiUrl}/jobs/my-applications`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);
        
        let savedJobIds: string[] = [];
        let appliedJobIds: string[] = [];
        
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          savedJobIds = savedData.map((savedJob: any) => savedJob.jobId);
        }
        
        if (appliedRes.ok) {
          const appliedData = await appliedRes.json();
          appliedJobIds = appliedData.map((application: any) => application.jobId);
        }
        
        // Mark jobs as saved and applied if they exist in respective lists
        const jobsWithStatus = data.map((job: any) => ({
          ...job,
          saved: savedJobIds.includes(job.id),
          applied: appliedJobIds.includes(job.id)
        }));
        
        setJobs(jobsWithStatus);
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
      <main className="min-h-screen pt-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/20 pb-4">Available Jobs</h1>

          {loading && (
            <p className="text-gray-300">Loading jobs...</p>
          )}
          
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
          
          {!loading && !error && jobs.length === 0 && (
            <p className="text-gray-300">No jobs available.</p>
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
