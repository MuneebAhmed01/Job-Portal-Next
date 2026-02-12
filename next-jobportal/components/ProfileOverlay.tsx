'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, LogOut, FileText, Plus, Briefcase, ChevronLeft, MapPin, IndianRupee, Users, Loader2, Edit3, Save, Phone, Mail, Building2, FileUser } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  createdAt: string;
  applicants: any[];
}

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileOverlay({ isOpen, onClose }: ProfileOverlayProps) {
  const router = useRouter();
  const { user, token, logout, isEmployer, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'post-job' | 'my-jobs'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    bio: '',
    companyName: '',
  });
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    type: 'ONSITE' as 'ONSITE' | 'REMOTE' | 'HYBRID'
  });

  // Initialize edit form when user changes or editing starts
  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
      });
    }
  }, [user, isEditing]);

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

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const jobData = {
        title: jobForm.title,
        description: jobForm.description,
        location: jobForm.location,
        salaryRange: `${jobForm.salaryMin}-${jobForm.salaryMax} LPA`,
        type: jobForm.type,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create job');
      }

      setJobForm({ title: '', description: '', location: '', salaryMin: '', salaryMax: '', type: 'ONSITE' });
      fetchMyJobs();
      setActiveTab('my-jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isEmployer 
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/employer/profile`
        : `${process.env.NEXT_PUBLIC_API_URL}/users/employee/profile`;
      
      const updateData = isEmployer 
        ? { name: editForm.name, phone: editForm.phone, bio: editForm.bio, companyName: editForm.companyName }
        : { name: editForm.name, phone: editForm.phone, bio: editForm.bio };

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      
      // Update context
      updateUser({
        name: updatedData.name,
        phone: updatedData.phone,
        bio: updatedData.bio,
        ...(isEmployer && { companyName: updatedData.companyName }),
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    router.push('/');
  };

  const handleDownloadResume = () => {
    if (user?.id) {
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${user.id}/resume`, '_blank');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    // Reset form to current user values
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
      });
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up bg-gray-800 rounded-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            {(activeTab === 'post-job' || activeTab === 'my-jobs') && (
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-gray-400" size={20} />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F54900' }}>
              <User className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'profile' && 'My Profile'}
              {activeTab === 'post-job' && 'Post a New Job'}
              {activeTab === 'my-jobs' && 'My Posted Jobs'}
            </h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Success/Error Messages */}
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                  {success}
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Profile Header */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-500/30" style={{ backgroundColor: '#F54900' }}>
                  <User className="text-white" size={48} />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-xl font-bold text-white bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-center w-full max-w-xs mx-auto"
                    placeholder="Your Name"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                )}
                <span className="glass px-4 py-1.5 rounded-full text-sm text-gray-300 mt-3 inline-block">
                  {isEmployer ? '🏢 Employer' : '👤 Job Seeker'}
                </span>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                {/* Email - Read Only */}
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={18} className="text-orange-400" />
                    <p className="text-sm text-gray-400">Email (cannot be changed)</p>
                  </div>
                  <p className="text-white font-medium">{user.email}</p>
                </div>

                {/* Phone */}
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={18} className="text-blue-400" />
                    <p className="text-sm text-gray-400">Phone</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="text-white font-medium">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Company Name - Employer Only */}
                {isEmployer && (
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 size={18} className="text-orange-400" />
                      <p className="text-sm text-gray-400">Company Name</p>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.companyName}
                        onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Your company name"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.companyName || 'Not provided'}</p>
                    )}
                  </div>
                )}

                {/* Bio */}
                <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FileUser size={18} className="text-green-400" />
                    <p className="text-sm text-gray-400">Bio</p>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-white">{user.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>

              {/* Edit/Save Buttons */}
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                      style={{ backgroundColor: '#F54900' }}
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Edit3 size={20} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              {!isEditing && (
                <div className="space-y-3 pt-4 border-t border-gray-700">
                  {isEmployer ? (
                    <>
                      <button
                        onClick={() => setActiveTab('post-job')}
                        className="w-full py-3 rounded-xl text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#F54900' }}
                      >
                        <Plus size={20} />
                        Post a New Job
                      </button>
                      <button
                        onClick={() => {
                          fetchMyJobs();
                          setActiveTab('my-jobs');
                        }}
                        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                      >
                        <Briefcase size={20} />
                        View My Jobs
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        router.push('/jobs');
                      }}
                      className="w-full py-3 rounded-xl text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#F54900' }}
                    >
                      <Briefcase size={20} />
                      Browse Available Jobs
                    </button>
                  )}

                  {user.resumePath && (
                    <button
                      onClick={handleDownloadResume}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      View My Resume
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
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
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
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
                    className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Mumbai, Remote"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Salary Range (LPA)</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={jobForm.salaryMin}
                      onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={jobForm.salaryMax}
                      onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                      className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Job Type</label>
                <select
                  value={jobForm.type}
                  onChange={(e) => setJobForm({ ...jobForm, type: e.target.value as 'ONSITE' | 'REMOTE' | 'HYBRID' })}
                  className="w-full p-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ONSITE" className="bg-gray-900">Onsite</option>
                  <option value="REMOTE" className="bg-gray-900">Remote</option>
                  <option value="HYBRID" className="bg-gray-900">Hybrid</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90 transition"
                style={{ backgroundColor: '#F54900' }}
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
                    className="mt-4 px-4 py-2 rounded-lg text-sm text-white hover:opacity-90 transition"
                    style={{ backgroundColor: '#F54900' }}
                  >
                    Post your first job
                  </button>
                </div>
              ) : (
                myJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30"
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
                          <span className="bg-gray-600/50 px-2 py-0.5 rounded">{job.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-orange-400">
                        <Users size={16} />
                        <span>{job.applicants?.length || 0} applied</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
