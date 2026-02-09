import Link from 'next/link';
import Image from 'next/image';
import { Search, Building, Sparkles, TrendingUp, Users, Briefcase } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const stats = [
  { value: '10k+', label: 'Active Jobs', icon: Briefcase },
  { value: '5k+', label: 'Companies', icon: Building },
  { value: '50k+', label: 'Job Seekers', icon: Users },
];

const features = ['Free to use', 'Verified employers', 'Secure platform'];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Dark Gradient Background - Matching App Theme */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-purple-900/20 to-slate-900">
        {/* Animated Background Elements - Darker Theme */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full hover-lift mt-4">
              <Sparkles className="text-purple-500 animate-pulse" size={20} />
              <span className="text-sm font-semibold text-gradient-primary">#1 Job Platform</span>
              <TrendingUp className="text-green-500" size={16} />
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="block text-white mb-2">Find Your</span>
              <span className="block text-gradient-primary">Dream Job</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2">
                at <span className="text-gradient-accent">HireHeaven</span>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Connect with top employers and discover opportunities that match your skills. 
              Whether you&apos;re a job seeker or recruiter, we&apos;ve got you covered with powerful 
              AI-powered tools and a seamless experience that transforms your career journey.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center group">
                  <div className="glass-dark rounded-xl p-4 hover-lift">
                    <Icon className="mx-auto mb-2 text-purple-500 group-hover:text-purple-600 transition-colors" size={20} />
                    <div className="text-xl font-black text-gradient-primary">{value}</div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="btn-primary group flex items-center gap-2 text-base px-6 py-3"
              >
                <Search size={18} className="group-hover:rotate-12 transition-transform" />
                Browse Jobs
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/about"
                className="btn-secondary group flex items-center gap-2 text-base px-6 py-3"
              >
                <Building size={18} className="group-hover:scale-110 transition-transform" />
                Learn More
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 pt-2">
              {features.map((feature, index) => (
                <div key={feature} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover-lift text-sm" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CheckCircle size={16} className="text-green-500 animate-pulse" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-[75%] aspect-4/5 rounded-2xl overflow-hidden shadow-2xl ml-auto animate-float hover-lift">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop"
                alt="Professional man"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute top-8 -left-6 glass-dark rounded-xl p-3 animate-pulse-glow hover-lift">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold">Live Jobs</span>
              </div>
            </div>
            
            <div className="absolute bottom-16 -right-6 glass rounded-xl p-3 animate-slide-up hover-lift" style={{ animationDelay: '0.5s' }}>
              <div className="text-center">
                <div className="text-lg font-black text-gradient-primary">98%</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
