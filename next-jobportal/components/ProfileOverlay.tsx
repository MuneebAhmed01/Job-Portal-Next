'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, LogOut, Briefcase, FileText, MapPin, IndianRupee, Users, ChevronLeft, Download, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  resumePath?: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  createdAt: string;
  applicants: Applicant[];
}

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileOverlay({ isOpen, onClose }: ProfileOverlayProps) {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'FULL_TIME'
  });

  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'post-job' | 'my-jobs' | 'jobs' | 'applicants' | 'applicant-detail'>('profile');

  useEffect(() => {
    if (isOpen && user) {
      if (user.role === 'HIRE_TALENT') {
        fetchMyJobs();
      } else {
        fetchAvailableJobs();
      }
    }
  }, [isOpen, user]);

  const fetchMyJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs');
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`);
      if (response.ok) {
        const data = await response.json();
        setAvailableJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs');
    }
  };

  const fetchApplicants = async (jobId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}/applicants`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const applicants = await response.json();
        const updatedJob = myJobs.find(j => j.id === jobId);
        if (updatedJob) {
          setSelectedJob({ ...updatedJob, applicants });
          setActiveTab('applicants');
        }
      }
    } catch (err) {
      console.error('Failed to fetch applicants');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create job');
      }

      setJobForm({ title: '', description: '', location: '', salary: '', type: 'FULL_TIME' });
      fetchMyJobs();
      setActiveTab('my-jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  const handleDownloadResume = (applicantId: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${applicantId}/resume`, '_blank');
  };

  if (!isOpen || !user) return null;

  const isEmployer = user?.role === 'HIRE_TALENT';
  
  console.log('ProfileOverlay - User:', user);
  console.log('ProfileOverlay - isEmployer:', isEmployer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            {(activeTab === 'post-job' || activeTab === 'my-jobs' || activeTab === 'jobs') && (
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-400" size={20} />
              </button>
            )}
            {activeTab === 'applicants' && (
              <button 
                onClick={() => setActiveTab('my-jobs')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-400" size={20} />
              </button>
            )}
            {activeTab === 'applicant-detail' && (
              <button 
                onClick={() => setActiveTab('applicants')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-400" size={20} />
              </button>
            )}
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'post-job' && 'Post a New Job'}
              {activeTab === 'my-jobs' && 'My Posted Jobs'}
              {activeTab === 'jobs' && 'Available Jobs'}
              {activeTab === 'applicants' && `Applicants: ${selectedJob?.title}`}
              {activeTab === 'applicant-detail' && 'Applicant Profile'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl glass hover-lift flex items-center justify-center">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                <span className="glass px-3 py-1 rounded-full text-sm text-gray-300 mt-2 inline-block">
                  {isEmployer ? 'Employer' : 'Job Seeker'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 glass rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>
                <div className="p-4 glass rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-white">{user.phone}</p>
                </div>
                {user.bio && (
                  <div className="p-4 glass rounded-xl md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Bio</p>
                    <p className="text-white">{user.bio}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {isEmployer ? (
                  <>
                    <button
                      onClick={() => setActiveTab('post-job')}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Post a New Job
                    </button>
                    <button
                      onClick={() => setActiveTab('my-jobs')}
                      className="w-full py-3 glass rounded-xl text-white font-medium hover-lift flex items-center justify-center gap-2"
                    >
                      <Briefcase size={20} />
                      View My Jobs ({myJobs.length})
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift flex items-center justify-center gap-2"
                  >
                    <Briefcase size={20} />
                    Browse Available Jobs ({availableJobs.length})
                  </button>
                )}

                {user.resumePath && (
                  <button
                    onClick={() => handleDownloadResume(user.id)}
                    className="w-full py-3 glass rounded-xl text-white font-medium hover-lift flex items-center justify-center gap-2"
                  >
                    <FileText size={20} />
                    View My Resume
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {activeTab === 'post-job' && isEmployer && (
            <form onSubmit={handleCreateJob} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-400 text-sm mb-2">Job Title *</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full p-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Mumbai, Remote"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Salary</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full p-3 rounded-xl glass text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 15-25 LPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Job Type</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                  className="w-full p-3 rounded-xl glass text-white focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent"
                >
                  <option value="FULL_TIME" className="bg-gray-900">Full Time</option>
                  <option value="PART_TIME" className="bg-gray-900">Part Time</option>
                  <option value="CONTRACT" className="bg-gray-900">Contract</option>
                  <option value="INTERNSHIP" className="bg-gray-900">Internship</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Job...
                  </>
                ) : (
                  'Post Job'
                )}
              </button>
            </form>
          )}

          {activeTab === 'my-jobs' && isEmployer && (
            <div className="space-y-4">
              {myJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No jobs posted yet</p>
                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm"
                  >
                    Post your first job
                  </button>
                </div>
              ) : (
                myJobs.map((job) => (
                  <div 
                    key={job.id} 
                    onClick={() => fetchApplicants(job.id)}
                    className="p-4 glass rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white">{job.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{job.description.slice(0, 100)}...</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <IndianRupee size={14} />
                              {job.salary}
                            </span>
                          )}
                          <span className="glass px-2 py-0.5 rounded">{job.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-purple-400">
                        <Users size={16} />
                        <span>{job.applicants?.length || 0} applied</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'jobs' && !isEmployer && (
            <div className="space-y-4">
              {availableJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No jobs available at the moment</p>
                </div>
              ) : (
                availableJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-4 glass rounded-xl"
                  >
                    <h3 className="font-bold text-white">{job.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{job.description.slice(0, 100)}...</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <IndianRupee size={14} />
                          {job.salary}
                        </span>
                      )}
                      <span className="glass px-2 py-0.5 rounded">{job.type}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'applicants' && selectedJob && (
            <div className="space-y-4">
              {selectedJob.applicants?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No applicants yet</p>
                </div>
              ) : (
                selectedJob.applicants?.map((applicant) => (
                  <div 
                    key={applicant.id}
                    onClick={() => {
                      setSelectedApplicant(applicant);
                      setActiveTab('applicant-detail');
                    }}
                    className="p-4 glass rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="text-white" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{applicant.name}</h3>
                        <p className="text-gray-400 text-sm">{applicant.email}</p>
                      </div>
                      <button className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'applicant-detail' && selectedApplicant && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-bold text-white">{selectedApplicant.name}</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 glass rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-white">{selectedApplicant.email}</p>
                </div>
                <div className="p-4 glass rounded-xl">
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-white">{selectedApplicant.phone}</p>
                </div>
                {selectedApplicant.bio && (
                  <div className="p-4 glass rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Bio</p>
                    <p className="text-white">{selectedApplicant.bio}</p>
                  </div>
                )}
              </div>

              {selectedApplicant.resumePath && (
                <button
                  onClick={() => handleDownloadResume(selectedApplicant.id)}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Resume
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
