'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, FileText, Download, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  resumePath: string;
  role: string;
}

export default function ApplicantBioPage() {
  const params = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicant();
  }, [params.id]);

  const fetchApplicant = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setApplicant(data);
      }
    } catch (error) {
      console.error('Failed to fetch applicant');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${params.id}/resume`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${applicant?.name || 'applicant'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Resume not available');
      }
    } catch (error) {
      console.error('Failed to download resume');
      alert('Failed to download resume');
    }
  };

  if (loading) {
    return (
      <>
        <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </>
    );
  }

  if (!applicant) {
    return (
      <>
        <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
          <Navbar />
        </div>
        <div className="min-h-screen pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white">Applicant Not Found</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative bg-linear-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark rounded-2xl p-8">
            <button
              onClick={() => router.back()}
              className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F54900' }}>
                <User className="text-white" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{applicant.name}</h1>
              <span className="glass px-4 py-1 rounded-full text-sm text-gray-300">
                {applicant.role === 'USER' ? 'Job Seeker' : 'Employer'}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <Mail className="text-orange-400" size={24} />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{applicant.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <Phone className="text-orange-400" size={24} />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{applicant.phone}</p>
                </div>
              </div>

              {applicant.bio && (
                <div className="p-4 glass rounded-xl">
                  <p className="text-sm text-gray-400 mb-2">Bio</p>
                  <p className="text-white">{applicant.bio}</p>
                </div>
              )}

              <button
                onClick={downloadResume}
                className="w-full py-4 rounded-xl text-white font-bold hover-lift flex items-center justify-center gap-3"
                style={{ backgroundColor: '#F54900' }}
              >
                <Download size={20} />
                Download Resume
                <FileText size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
