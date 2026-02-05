import Link from 'next/link';
import Image from 'next/image';
import { Search, Building } from 'lucide-react';
import { CheckCircle } from 'lucide-react';

const stats = [
  { value: '10k+', label: 'Active Jobs' },
  { value: '5k+', label: 'Companies' },
  { value: '50k+', label: 'Job Seekers' },
];

const features = ['Free to use', 'Verified employers', 'Secure platform'];

export default function HeroSection() {
  return (
    <section className="min-h-screen  bg-slate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-purple-600">📈</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">#1 Job Platform </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Find Your Dream Job at{' '}
              <span className="text-blue-600">Hire</span>
              <span className="text-red-500">Heaven</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg">
              Connect with top employers and discover opportunities that match your skills. 
              Whether you&apos;re a job seeker or recruiter, we&apos;ve got you covered with powerful 
              tools and seamless experience.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Search size={18} />
                Browse Jobs
                <span>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <Building size={18} />
                Learn More
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-1">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-[75%] aspect-3/4 rounded-2xl overflow-hidden shadow-2xl ml-auto">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=650&fit=crop"
                alt="Professional man"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
