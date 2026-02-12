'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, FileText, TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  location: string;
  salaryRange: string;
  type: 'ONSITE' | 'REMOTE' | 'HYBRID';
  description: string;
  createdAt: string;
  status: string;
  employer?: {
    companyName: string;
  };
  applicants?: number;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  resumePath?: string;
  appliedAt: string;
}

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingApplicants, setViewingApplicants] = useState<Job | null>(null);

  useEffect(() => {
    fetchMyJobs();
    fetchApplicants();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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

  const fetchApplicants = async () => {
    try {
      const url = viewingApplicants 
        ? `${process.env.NEXT_PUBLIC_API_URL}/jobs/${viewingApplicants.id}/applications`
        : `${process.env.NEXT_PUBLIC_API_URL}/applications/my-applications`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setApplicants(data);
      }
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [viewingApplicants]);

  const handlePostJob = async (jobData: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        setShowJobForm(false);
        setEditingJob(null);
        fetchMyJobs();
      }
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleViewApplicants = (job: Job) => {
    setViewingApplicants(job);
    setActiveTab('applicants');
  };

  const handleBackToJobs = () => {
    setViewingApplicants(null);
    setActiveTab('jobs');
  };

  const handleUpdateJob = async (jobData: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${editingJob?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        setShowJobForm(false);
        setEditingJob(null);
        fetchMyJobs();
      }
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
      {/* Header */}
      <div className="border-b border-white/10" style={{ backgroundColor: '#1a1f2e' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employer Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10" style={{ backgroundColor: '#F54900' }}
            >
              <Plus size={20} />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Jobs</p>
                <p className="text-2xl font-bold mt-1">{jobs.length}</p>
              </div>
              <Briefcase className="text-purple-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Applicants</p>
                <p className="text-2xl font-bold mt-1">{applicants.length}</p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Views Today</p>
                <p className="text-2xl font-bold mt-1">247</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Response Rate</p>
                <p className="text-2xl font-bold mt-1">68%</p>
              </div>
              <FileText className="text-yellow-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-3 px-1 border-b-2 transition-colors ${
              activeTab === 'applicants'
                ? 'border-purple-500 text-purple-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Applicants ({applicants.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'jobs' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-gray-400 mb-6">Post your first job to start finding talent</p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salaryRange}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={16} />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-medium">{job.applicants || 0} Applicants</p>
                      <p className="text-gray-400 text-sm">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 line-clamp-2 mb-4">{job.description}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleViewApplicants(job)}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      View Applicants
                    </button>
                    <button 
                      onClick={() => handleEditJob(job)}
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      Edit Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {viewingApplicants && (
              <div className="mb-6 p-4 glass rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Applicants for: {viewingApplicants.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{viewingApplicants.employer?.companyName || user?.companyName}</p>
                  </div>
                  <button
                    onClick={handleBackToJobs}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                  >
                    ← Back to Jobs
                  </button>
                </div>
              </div>
            )}
            {applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">No applicants yet</h3>
                <p className="text-gray-400">When candidates apply to your jobs, they'll appear here</p>
              </div>
            ) : (
              applicants.map((applicant) => (
                <div key={applicant.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{applicant.name}</h3>
                        <p className="text-gray-400">{applicant.email}</p>
                        <p className="text-gray-400">{applicant.phone}</p>
                        {applicant.bio && (
                          <p className="text-gray-300 mt-2">{applicant.bio}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-2">
                          Applied {new Date(applicant.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {applicant.resumePath && (
                        <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm transition-colors">
                          View Resume
                        </button>
                      )}
                      <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingJob ? 'Edit Job' : 'Post New Job'}
            </h2>
            <JobForm 
              onSubmit={editingJob ? handleUpdateJob : handlePostJob} 
              onCancel={() => {
                setShowJobForm(false);
                setEditingJob(null);
              }}
              initialData={editingJob}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Job Form Component
function JobForm({ onSubmit, onCancel, initialData }: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
  initialData?: Job | null; 
}) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: ''
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Parse salaryRange like "20-30 LPA" into min/max
      const salaryMatch = initialData.salaryRange?.match(/(\d+)-(\d+)/);
      setFormData({
        title: initialData.title || '',
        location: initialData.location || '',
        salaryMin: salaryMatch ? salaryMatch[1] : '',
        salaryMax: salaryMatch ? salaryMatch[2] : '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        description: ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      title: formData.title,
      location: formData.location,
      salaryRange: `${formData.salaryMin}-${formData.salaryMax} LPA`,
      description: formData.description
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Salary Range (LPA)</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Min"
            required
          />
          <input
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
            placeholder="Max"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
        >
          {initialData ? 'Update Job' : 'Post Job'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
