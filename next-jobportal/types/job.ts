export interface Employer {
  id: string;
  name: string;
  companyName: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  salary?: number | null;
  type: 'ONSITE' | 'REMOTE' | 'HYBRID';
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  employerId: string;
  employer?: Employer;
  saved?: boolean;
  applied?: boolean;
  _count?: { applications: number };
}

export type JobType = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type SortBy = 'createdAt' | 'salary' | 'relevance';
export type SortOrder = 'asc' | 'desc';

export interface SearchJobsParams {
  keyword?: string;
  type?: JobType;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface PaginatedJobs {
  data: Job[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio?: string;
  resumePath?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  employeeId: string;
  appliedAt: string;
  job?: Job;
  employee?: Employee;
}
