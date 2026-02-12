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
  type: 'ONSITE' | 'REMOTE' | 'HYBRID';
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  employerId: string;
  employer?: Employer;
  saved?: boolean;
  applied?: boolean;
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
