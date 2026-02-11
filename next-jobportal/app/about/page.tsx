import { 
  Target, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  Building2,
  Briefcase,
  TrendingUp,
  Heart
} from 'lucide-react';
import Testimonials from '@/components/Testimonials';
import Navbar from '@/components/Navbar';

const stats = [
  { value: '10K+', label: 'Active Jobs', icon: Briefcase },
  { value: '5K+', label: 'Companies', icon: Building2 },
  { value: '50K+', label: 'Job Seekers', icon: Users },
  { value: '95%', label: 'Success Rate', icon: TrendingUp },
];

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We\'re committed to democratizing access to career opportunities for everyone.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your data is protected with enterprise-grade security and privacy standards.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'AI-powered tools that give you an edge in today\'s competitive job market.',
  },
  {
    icon: Heart,
    title: 'User-Centric',
    description: 'Every feature is designed with your success and experience in mind.',
  },
];

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with employers from around the world and find remote opportunities.',
  },
  {
    icon: Award,
    title: 'Verified Employers',
    description: 'All companies on our platform are verified for authenticity and credibility.',
  },
  {
    icon: Zap,
    title: 'AI Resume Analysis',
    description: 'Get instant feedback on your resume\'s ATS compatibility and suggestions.',
  },
  {
    icon: Target,
    title: 'Smart Matching',
    description: 'Our AI matches you with jobs that align with your skills and aspirations.',
  },
];

const team = [
  {
    name: 'Arjun Mehta',
    role: 'CEO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
  },
  {
    name: 'Sneha Kapoor',
    role: 'CTO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
  },
  {
    name: 'Rohan Das',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  },
  {
    name: 'Meera Iyer',
    role: 'Head of AI',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="relative bg-gradient-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
        <Navbar />
      </div>
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-blue-200">Job</span><span className="text-red-300">Forge</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              We&apos;re on a mission to revolutionize how people find jobs and how companies find talent. 
              Our AI-powered platform connects dreams with opportunities.
            </p>
          </div>
        </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8" style={{ backgroundColor: '#1a1f2e' }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#F54900' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-gray-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Founded in 2024, JobForge started with a simple observation: the job search process was broken. 
                  Talented individuals were getting lost in the noise, and great companies were struggling to find the right fit.
                </p>
                <p>
                  We built JobForge to bridge this gap using cutting-edge AI technology. Our platform doesn&apos;t just list jobs — 
                  it understands your skills, aspirations, and potential, matching you with opportunities where you can truly thrive.
                </p>
                <p>
                  Today, we&apos;re proud to have helped over 50,000 job seekers find meaningful employment and partnered with 
                  5,000+ companies across India and beyond.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#1a1f2e' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F54900' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-gray-300">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose JobForge?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We combine technology with human insight to deliver the best job search experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center p-6 rounded-xl hover:bg-white/5 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{ backgroundColor: '#F54900' }}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-300">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Passionate individuals dedicated to transforming careers
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(({ name, role, image }) => (
              <div key={name} className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow" style={{ backgroundColor: '#1a1f2e' }}>
                <div className="aspect-square relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-white">{name}</h3>
                  <p className="text-sm" style={{ color: '#F54900' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(to bottom right, #020617, #0b0f19, #0f172a)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who&apos;ve transformed their careers with JobForge
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-colors text-white"
              style={{ backgroundColor: '#F54900' }}
            >
              Browse Jobs
            </a>
            <a
              href="/resume-analyzer"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Analyze Your Resume
            </a>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
