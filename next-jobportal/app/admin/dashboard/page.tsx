'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield,
  Users,
  Briefcase,
  Building2,
  FileText,
  LogOut,
  Loader2,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowLeft,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplicants: number;
}

interface JobsOverTimeData {
  date: string;
  count: number;
}

interface ApplicantsPerJobData {
  jobTitle: string;
  applicants: number;
}

interface UserRatioData {
  name: string;
  value: number;
}

const COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, logout, isLoading, isAdmin } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobsOverTime, setJobsOverTime] = useState<JobsOverTimeData[]>([]);
  const [applicantsPerJob, setApplicantsPerJob] = useState<ApplicantsPerJobData[]>([]);
  const [userRatio, setUserRatio] = useState<UserRatioData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/admin/login');
      return;
    }

    if (token && isAdmin) {
      fetchAllData();
    }
  }, [user, token, isLoading, isAdmin]);

  const fetchAllData = async () => {
    setLoadingData(true);
    const headers = { Authorization: `Bearer ${token}` };
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const [statsRes, jobsRes, applicantsRes, ratioRes] = await Promise.all([
        fetch(`${apiUrl}/admin/dashboard-stats`, { headers }),
        fetch(`${apiUrl}/admin/jobs-over-time`, { headers }),
        fetch(`${apiUrl}/admin/applicants-per-job`, { headers }),
        fetch(`${apiUrl}/admin/user-employer-ratio`, { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (jobsRes.ok) setJobsOverTime(await jobsRes.json());
      if (applicantsRes.ok) setApplicantsPerJob(await applicantsRes.json());
      if (ratioRes.ok) setUserRatio(await ratioRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      label: 'Total Employers',
      value: stats?.totalEmployers ?? 0,
      icon: Building2,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Total Jobs',
      value: stats?.totalJobs ?? 0,
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
    {
      label: 'Total Applicants',
      value: stats?.totalApplicants ?? 0,
      icon: FileText,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Shield className="text-red-500" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">JobForge Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-gray-400 hover:text-white transition-all text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`${card.bgColor} border ${card.borderColor} rounded-2xl p-6 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon className="text-gray-400" size={22} />
                <span className={`text-3xl font-bold bg-linear-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs Over Time — Area Chart */}
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-orange-500" size={20} />
              <h2 className="text-lg font-semibold text-white">Jobs Posted Over Time</h2>
            </div>
            {jobsOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={jobsOverTime}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    stroke="#64748b"
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                    }}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#f97316"
                    fillOpacity={1}
                    fill="url(#colorJobs)"
                    strokeWidth={2}
                    name="Jobs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-500">
                No job data available yet
              </div>
            )}
          </div>

          {/* User vs Employer Ratio — Pie Chart */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="text-purple-500" size={20} />
              <h2 className="text-lg font-semibold text-white">User vs Employer</h2>
            </div>
            {userRatio.length > 0 && userRatio.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRatio}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {userRatio.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#f1f5f9',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#94a3b8', fontSize: '14px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-75 flex items-center justify-center text-gray-500">
                No user data available yet
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-cyan-500" size={20} />
            <h2 className="text-lg font-semibold text-white">Applicants Per Job</h2>
          </div>
          {applicantsPerJob.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={applicantsPerJob} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis
                  dataKey="jobTitle"
                  type="category"
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  width={160}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="applicants" fill="#06b6d4" radius={[0, 6, 6, 0]} name="Applicants">
                  {applicantsPerJob.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-88 flex items-center justify-center text-gray-500">
              No application data available yet
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
