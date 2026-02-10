'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, FileText, TrendingUp, Calendar, DollarSign, MapPin } from 'lucide-react';
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

  useEffect(() => {
    fetchMyJobs();
    fetchApplicants();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch('http://localhost:3002/jobs', {
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
      const res = await fetch('http://localhost:3002/applications/my-applications', {
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

  const handlePostJob = async (jobData: any) => {
    try {
      const res = await fetch('http://localhost:3002/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(jobData)
      });

      if (res.ok) {
        setShowJobForm(false);
        fetchMyJobs();
      }
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Employer Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
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
                          {job.salary}
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
                    <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                      View Applicants
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                      Edit Job
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
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
            <h2 className="text-2xl font-bold mb-6">Post New Job</h2>
            <JobForm onSubmit={handlePostJob} onCancel={() => setShowJobForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Job Form Component
function JobForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'FULL_TIME',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        <label className="block text-sm font-medium mb-1">Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-1">Salary</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Job Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
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
          Post Job
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
