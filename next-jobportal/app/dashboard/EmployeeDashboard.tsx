'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter, Heart, ExternalLink, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'applied'>('browse');
  const [selectedJobType, setSelectedJobType] = useState('all');

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:3002/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('http://localhost:3002/jobs/saved', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch('http://localhost:3002/applications/my-applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAppliedJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch applied jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      const res = await fetch(`http://localhost:3002/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, saved: !job.saved } : job
        ));
        fetchSavedJobs();
      }
    } catch (error) {
      console.error('Failed to save job:', error);
    }
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
        setJobs(jobs.map(job => 
          job.id === jobId ? { ...job, applied: true } : job
        ));
        fetchAppliedJobs();
      }
    } catch (error) {
      console.error('Failed to apply job:', error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedJobType === 'all' || job.type === selectedJobType;
    return matchesSearch && matchesType;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Jobs</p>
                <p className="text-2xl font-bold mt-1">{jobs.length}</p>
              </div>
              <Briefcase className="text-purple-500" size={24} />
            </div>
          </div>
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
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Profile Views</p>
                <p className="text-2xl font-bold mt-1">47</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'browse'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Browse Jobs ({filteredJobs.length})
          </button>
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
        {activeTab === 'browse' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
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
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          job.saved 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <Heart size={20} fill={job.saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 text-sm">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3">
                      {job.applied ? (
                        <button className="bg-green-600 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                          Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                        >
                          Apply Now
                        </button>
                      )}
                      <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : activeTab === 'saved' ? (
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
                    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
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
                    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
