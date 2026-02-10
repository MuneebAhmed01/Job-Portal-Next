'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Heart, ExternalLink, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import JobDetailOverlay from '@/components/JobDetailOverlay';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  createdAt: string;
  saved?: boolean;
  applied?: boolean;
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'applied'>('saved');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);


  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3002/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Saved jobs data:', data);
        // Extract job data from saved jobs
        const jobsData = data.map((savedJob: any) => ({
          ...savedJob.job,
          saved: true,
          savedAt: savedJob.savedAt
        }));
        console.log('Processed saved jobs:', jobsData);
        setSavedJobs(jobsData);
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch('http://localhost:3002/jobs/my-applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Extract job data from applications
        const jobsWithApplicationInfo = data.map((application: any) => ({
          ...application.job,
          appliedAt: application.appliedAt,
          applicationId: application.id,
        }));
        
        // Check which applied jobs are also saved
        const savedRes = await fetch('http://localhost:3002/jobs/saved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          const savedJobIds = savedData.map((savedJob: any) => savedJob.jobId);
          console.log('Saved job IDs:', savedJobIds);
          console.log('Applied jobs before marking:', jobsWithApplicationInfo);
          
          // Mark applied jobs as saved if they exist in saved jobs
          const jobsWithSavedStatus = jobsWithApplicationInfo.map((job: any) => ({
            ...job,
            saved: savedJobIds.includes(job.id)
          }));
          
          console.log('Applied jobs after marking:', jobsWithSavedStatus);
          setAppliedJobs(jobsWithSavedStatus);
        } else {
          setAppliedJobs(jobsWithApplicationInfo);
        }
      }
    } catch (error) {
      console.error('Failed to fetch applied jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    // Saved jobs functionality not implemented yet
    console.log('Save job functionality not implemented');
  };

  const handleApplyJob = async (jobId: string) => {
    try {
      const res = await fetch(`http://localhost:3002/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        fetchAppliedJobs();
      }
    } catch (error) {
      console.error('Failed to apply job:', error);
    }
  };


  const handleSaveChange = (jobId: string, saved: boolean) => {
    console.log('Save state changed:', { jobId, saved });
    
    // Update saved jobs list
    if (saved) {
      // Add to saved jobs if not already there
      setSavedJobs(prev => {
        const jobExists = prev.find(job => job.id === jobId);
        if (!jobExists) {
          // Find the job in applied jobs and add it to saved jobs
          const appliedJob = appliedJobs.find(job => job.id === jobId);
          if (appliedJob) {
            return [...prev, { ...appliedJob, saved: true }];
          }
        }
        return prev;
      });
    } else {
      // Remove from saved jobs
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    }

    // Update applied jobs list to reflect save status
    setAppliedJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, saved } : job
    ));

    // Update the selected job if it's currently open
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, saved } : null);
    }
  };

  const handleViewDetails = (job: Job) => {
    console.log('Opening job details:', job);
    setSelectedJob(job);
    setShowJobDetail(true);
  };

  const handleCloseJobDetail = () => {
    setShowJobDetail(false);
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/resume-analyzer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FileText size={20} />
                Analyze Resume
              </Link>
              <Link 
                href="/career-guidance"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <TrendingUp size={20} />
                Career Guidance
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Saved Jobs</p>
                <p className="text-2xl font-bold mt-1">{savedJobs.length}</p>
              </div>
              <Heart className="text-red-500" size={24} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Applications</p>
                <p className="text-2xl font-bold mt-1">{appliedJobs.length}</p>
              </div>
              <ExternalLink className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'applied'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'saved' ? (
          <div className="space-y-4">
            {savedJobs.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No saved jobs</h3>
                <p className="text-gray-400">Save jobs you're interested in to see them here</p>
              </div>
            ) : (
              savedJobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <p className="text-purple-400 font-medium mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex gap-3">
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                      Apply Now
                    </button>
                    <button 
                      onClick={() => handleViewDetails(job)}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {appliedJobs.length === 0 ? (
              <div className="text-center py-12">
                <ExternalLink className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
                <p className="text-gray-400">Start applying to jobs to track your applications here</p>
              </div>
            ) : (
              appliedJobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <p className="text-purple-400 font-medium mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        Applied
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">
                      Applied {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <button 
                      onClick={() => handleViewDetails(job)}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Job Detail Overlay */}
      {showJobDetail && selectedJob && (
        <JobDetailOverlay 
          job={selectedJob} 
          onClose={handleCloseJobDetail}
          onSaveChange={handleSaveChange}
        />
      )}
    </div>
  );
}
