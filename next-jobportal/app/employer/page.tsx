'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, DollarSign, FileText, X } from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  description: string;
  skills: string;
  budget: string;
  applicants: any[];
  createdAt: string;
}

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ title: '', description: '', skills: '', budget: '' });
        setShowForm(false);
        fetchJobs();
      }
    } catch (error) {
      console.error('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Employer Dashboard</h1>
          <p className="text-gray-400">Manage your job postings and applicants</p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Post New Job'}
        </button>

        {showForm && (
          <div className="glass-dark rounded-2xl p-6 mb-8 animate-slide-up">
            <h2 className="text-xl font-bold text-white mb-4">Create Job Posting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Senior React Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., React, Node.js, TypeScript"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Budget</label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Post Job'}
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="glass-dark rounded-2xl p-6 hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 glass px-3 py-1 rounded-full">
                  <Users className="text-purple-400" size={16} />
                  <span className="text-sm text-gray-300">{job.applicants?.length || 0} applicants</span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="glass px-3 py-1 rounded-full text-sm text-gray-300">
                    {skill.trim()}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {job.budget && (
                  <div className="flex items-center gap-2 text-green-400">
                    <DollarSign size={18} />
                    <span className="font-medium">{job.budget}</span>
                  </div>
                )}
                <button
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                  className="btn-secondary text-sm"
                >
                  {selectedJob?.id === job.id ? 'Hide Applicants' : 'View Applicants'}
                </button>
              </div>

              {selectedJob?.id === job.id && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Applicants</h4>
                  {job.applicants?.length > 0 ? (
                    <div className="space-y-3">
                      {job.applicants.map((applicant: any) => (
                        <Link
                          key={applicant.id}
                          href={`/applicant/${applicant.id}`}
                          className="flex items-center gap-4 p-4 glass rounded-xl hover-lift"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Users className="text-white" size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{applicant.name}</p>
                            <p className="text-sm text-gray-400">{applicant.email}</p>
                          </div>
                          <FileText className="text-gray-400" size={18} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-4">No applicants yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
