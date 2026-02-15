'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import JobCard from '@/components/JobCard';
import { Job, SearchJobsParams, PaginatedJobs, JobType, SortBy } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'ONSITE', label: 'Onsite' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'createdAt', label: 'Newest' },
  { value: 'salary_desc', label: 'Salary (High first)' },
  { value: 'salary_asc', label: 'Salary (Low first)' },
  { value: 'relevance', label: 'Relevance' },
];

/** Parse salary input: strip commas/spaces, return number or undefined if invalid */
function parseSalaryInput(value: string): number | undefined {
  if (!value || !value.trim()) return undefined;
  const num = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(num) && num >= 0 ? num : undefined;
}

/** Build query string from non-empty params */
function toQueryString(params: SearchJobsParams): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '' && v !== null,
  );
  return new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export default function JobsPage() {
  const { user, token } = useAuth();

  // --- filter state ---
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<JobType | ''>('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  // --- applied filters state (for actual search) ---
  const [appliedFilters, setAppliedFilters] = useState({
    keyword: '',
    type: '' as JobType | '',
    location: '',
    minSalary: '',
    maxSalary: '',
    sortBy: 'createdAt' as SortBy
  });

  // Initialize appliedFilters on mount
  useEffect(() => {
    setAppliedFilters({
      keyword,
      type,
      location,
      minSalary,
      maxSalary,
      sortBy
    });
  }, []); // Only run once on mount

  // --- data state ---
  const [result, setResult] = useState<PaginatedJobs>({ data: [], total: 0, totalPages: 0, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build params object from applied filters
  const buildParams = useCallback((): SearchJobsParams => {
    const sortBy = appliedFilters.sortBy;
    const params: SearchJobsParams = { page, limit: LIMIT };
    if (appliedFilters.keyword.trim()) params.keyword = appliedFilters.keyword.trim();
    if (appliedFilters.type) params.type = appliedFilters.type;
    if (appliedFilters.location.trim()) params.location = appliedFilters.location.trim();
    const min = parseSalaryInput(appliedFilters.minSalary);
    const max = parseSalaryInput(appliedFilters.maxSalary);
    if (min !== undefined) params.minSalary = min;
    if (max !== undefined) params.maxSalary = max;
    if (sortBy === 'salary_desc' || sortBy === 'salary_asc') {
      params.sortBy = 'salary';
      params.sortOrder = sortBy === 'salary_desc' ? 'desc' : 'asc';
    } else if (sortBy === 'relevance' && !appliedFilters.keyword.trim()) {
      params.sortBy = 'createdAt';
    } else {
      params.sortBy = sortBy === 'relevance' ? 'relevance' : sortBy;
    }
    return params;
  }, [appliedFilters, page]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = toQueryString(buildParams());
      const res = await fetch(`${API_URL}/jobs/search?${qs}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const json: PaginatedJobs = await res.json();

      // Enrich with saved/applied status when logged in
      if (user && token) {
        const [savedRes, appliedRes] = await Promise.all([
          fetch(`${API_URL}/jobs/employee/saved`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/jobs/employee/applications`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const savedIds: string[] = savedRes.ok
          ? (await savedRes.json()).map((s: any) => s.jobId)
          : [];
        const appliedIds: string[] = appliedRes.ok
          ? (await appliedRes.json()).map((a: any) => a.jobId)
          : [];

        json.data = json.data.map((job) => ({
          ...job,
          saved: savedIds.includes(job.id),
          applied: appliedIds.includes(job.id),
        }));
      }

      setResult(json);
    } catch {
      setError('Failed to load jobs. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [buildParams, user, token]);

  // Fetch whenever appliedFilters or page changes
  useEffect(() => {
    fetchJobs();
  }, [appliedFilters.keyword, appliedFilters.type, appliedFilters.location, appliedFilters.minSalary, appliedFilters.maxSalary, appliedFilters.sortBy, page]);

  // Apply filters function
  const applyFilters = () => {
    setAppliedFilters({
      keyword,
      type,
      location,
      minSalary,
      maxSalary,
      sortBy
    });
    setPage(1); // reset to page 1 when applying filters
    setFiltersOpen(false); // close filter panel after applying
  };

  // Clear all filters
  const clearFilters = () => {
    setKeyword('');
    setType('');
    setLocation('');
    setMinSalary('');
    setMaxSalary('');
    setSortBy('createdAt');
    setAppliedFilters({
      keyword: '',
      type: '',
      location: '',
      minSalary: '',
      maxSalary: '',
      sortBy: 'createdAt'
    });
    setPage(1);
  };

  const hasActiveFilters = appliedFilters.keyword || appliedFilters.type || appliedFilters.location || appliedFilters.minSalary || appliedFilters.maxSalary;
  const hasUnappliedChanges = keyword !== appliedFilters.keyword || type !== appliedFilters.type || location !== appliedFilters.location || minSalary !== appliedFilters.minSalary || maxSalary !== appliedFilters.maxSalary || sortBy !== appliedFilters.sortBy;

  const handleSaveChange = (jobId: string, saved: boolean) => {
    setResult((prev) => ({
      ...prev,
      data: prev.data.map((j) => (j.id === jobId ? { ...j, saved } : j)),
    }));
  };

  const handleApplyChange = (jobId: string, applied: boolean) => {
    setResult((prev) => ({
      ...prev,
      data: prev.data.map((j) => (j.id === jobId ? { ...j, applied } : j)),
    }));
  };

  return (
    <>
      <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>

      <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ── Header + inline search ── */}
          {/* ── Header row: title + search + filters + sort ── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 border-b border-white/20 pb-4">
            <h1 className="text-4xl font-bold text-white shrink-0">
              Find Jobs
            </h1>

            <div className="flex items-center gap-3 ml-auto">
              {/* Search */}
              <div className="relative w-48 sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search jobs…"
                  className="w-full pl-9 pr-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/60 transition"
                />
              </div>

              {/* Filters */}
              <div className="relative">
                <button
                  onClick={() => setFiltersOpen((o) => !o)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-medium text-sm whitespace-nowrap ${
                    filtersOpen
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </button>

                {/* Dropdown filter panel */}
                {filtersOpen && (
                  <>
                    {/* Invisible backdrop to close on outside click */}
                    <div className="fixed inset-0 z-10" onClick={() => setFiltersOpen(false)} />

                    <div className="absolute right-0 top-full mt-2 z-20 w-85 rounded-xl bg-[#0b1120] border border-white/10 shadow-2xl animate-slide-up">
                      {/* Panel header with close */}
                      <div className="flex items-center justify-between px-4 pt-3 pb-2">
                        <span className="text-sm font-medium text-gray-300">Filter by</span>
                        <button
                          onClick={() => setFiltersOpen(false)}
                          className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition"
                          aria-label="Close filters"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                        {/* Type */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Job Type</label>
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value as JobType | '')}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm focus:outline-none focus:border-orange-500/60 [&>option]:bg-[#0f172a] [&>option]:text-gray-300"
                          >
                            <option value="">All Types</option>
                            {JOB_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Location */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Location</label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g. New York"
                            className="w-full px-3 py-2 rounded-lg bg-[#181f2a] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60"
                          />
                        </div>

                        {/* Min Salary — accepts numbers with or without commas */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Min Salary</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={minSalary}
                            onChange={(e) => setMinSalary(e.target.value)}
                            placeholder="e.g. 100000 or 100,000"
                            className="w-full px-3 py-2 rounded-lg bg-[#181f2a] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60"
                          />
                        </div>

                        {/* Max Salary — accepts numbers with or without commas */}
                        <div>
                          <label className="block text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">Max Salary</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={maxSalary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                            placeholder="e.g. 500000 or 500,000"
                            className="w-full px-3 py-2 rounded-lg bg-[#181f2a] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-500/60"
                          />
                        </div>

                        {/* Apply Filter and Clear buttons */}
                        <div className="col-span-2 flex gap-2 pt-2">
                          <button
                            onClick={applyFilters}
                            disabled={!hasUnappliedChanges}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                              hasUnappliedChanges
                                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                : 'bg-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Apply Filters
                          </button>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white transition"
                            >
                              <X className="w-3.5 h-3.5" /> Clear all
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sort — applies immediately (updates appliedFilters so fetch runs) */}
              <select
                value={sortBy}
                onChange={(e) => {
                  const value = e.target.value as SortBy;
                  setSortBy(value);
                  setAppliedFilters((prev) => ({ ...prev, sortBy: value }));
                  setPage(1);
                }}
                className="px-4 py-2 rounded-full bg-[#181f2a] border border-white/10 text-gray-300 text-sm focus:outline-none focus:border-orange-500/60 transition appearance-none cursor-pointer"
                style={{ backgroundColor: '#181f2a', color: '#e5e7eb' }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} style={{ backgroundColor: '#181f2a', color: '#e5e7eb' }}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Results summary (only if filters applied) ── */}
          {!loading && !error && hasActiveFilters && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-400">
                {result.total === 0
                  ? 'No jobs found'
                  : `Showing ${(result.currentPage - 1) * LIMIT + 1}–${Math.min(result.currentPage * LIMIT, result.total)} of ${result.total} jobs`}
              </p>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && result.data.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No jobs match your filters.</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-orange-400 hover:text-orange-300 text-sm font-medium transition">
                  Clear filters &amp; try again
                </button>
              )}
            </div>
          )}

          {/* ── Job cards grid ── */}
          {!loading && !error && result.data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {result.data.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveChange={handleSaveChange}
                  onApplyChange={handleApplyChange}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ── */}
          {result.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {generatePageNumbers(page, result.totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-500">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`min-w-10 h-10 rounded-lg text-sm font-medium transition ${
                      page === p
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                disabled={page >= result.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/** Generate a compact page number array with ellipsis */
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
}
