'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Users, DollarSign, FileText, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { employerJobPostSchema, getZodErrors } from '@/lib/validations';

type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

interface Job {
  id: string;
  title: string;
  description: string;
  skills: string;
  budget: string;
  applicants?: any[];
  applications?: { id: string; status: ApplicationStatus; employeeId: string; employee: { id: string; name: string; email: string } }[];
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
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setError('');
    setFieldErrors({});

    const result = employerJobPostSchema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(getZodErrors(result.error));
      return;
    }

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
      setError('Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId: string, applicationId: string, status: ApplicationStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/applicants/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const ensureReviewedThen = async (
    jobId: string,
    app: { id: string; status?: string; employeeId?: string; employee?: { id: string } },
    then: () => void
  ) => {
    if ((app.status || 'PENDING') === 'PENDING') {
      await handleUpdateStatus(jobId, app.id, 'REVIEWED');
    }
    then();
  };

  return (
    <>
      <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>
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
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    placeholder="e.g., Senior React Developer"
                  />
                  {fieldErrors.title && <p className="mt-1 text-sm text-red-400">{fieldErrors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Describe the role and responsibilities..."
                    rows={4}
                  />
                  {fieldErrors.description && <p className="mt-1 text-sm text-red-400">{fieldErrors.description}</p>}
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
                    />
                    {fieldErrors.skills && <p className="mt-1 text-sm text-red-400">{fieldErrors.skills}</p>}
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
                  className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift disabled:opacity-50"
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
                    <span className="text-sm text-gray-300">{applications(job).length} applicants</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-2">{job.description}</p>

                {(job.skills != null && job.skills !== '') && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(job.skills || '').split(',').map((skill, idx) => (
                      <span key={idx} className="glass px-3 py-1 rounded-full text-sm text-gray-300">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

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
                    {applications(job).length > 0 ? (
                      <div className="space-y-3">
                        {applications(job).map((app: any) => {
                          const emp = app.employee ?? app;
                          const name = emp.name ?? '';
                          const email = emp.email ?? '';
                          const employeeId = emp.id ?? app.employeeId;
                          const status = app.status || 'PENDING';
                          return (
                            <div key={app.id} className="flex items-center gap-4 p-4 glass rounded-xl">
                              <button
                                type="button"
                                onClick={() => ensureReviewedThen(job.id, app, () => { window.location.href = `/applicant/${employeeId}`; })}
                                className="flex items-center gap-4 flex-1 min-w-0 text-left"
                              >
                                <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0">
                                  <Users className="text-white" size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white">{name}</p>
                                  <p className="text-sm text-gray-400">{email}</p>
                                </div>
                              </button>
                              <span className={`shrink-0 px-2 py-0.5 rounded text-xs ${
                                status === 'ACCEPTED' ? 'bg-green-600/30 text-green-400' :
                                status === 'REJECTED' ? 'bg-red-600/30 text-red-400' :
                                status === 'REVIEWED' ? 'bg-blue-600/30 text-blue-400' :
                                'bg-gray-600/30 text-gray-400'
                              }`}>
                                {status}
                              </span>
                              {status !== 'REJECTED' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(job.id, app.id, 'REJECTED')}
                                  className="shrink-0 bg-red-600/80 hover:bg-red-600 px-2 py-1 rounded text-sm text-white"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => ensureReviewedThen(job.id, app, () => { window.location.href = `/applicant/${employeeId}`; })}
                                className="shrink-0 text-gray-400 hover:text-white"
                              >
                                <FileText size={18} />
                              </button>
                              <button
                                type="button"
                                onClick={() => ensureReviewedThen(job.id, app, () => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, '_blank'); })}
                                className="shrink-0 text-sm text-gray-400 hover:text-white"
                              >
                                Contact
                              </button>
                            </div>
                          );
                        })}
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
    </>
  );
}
