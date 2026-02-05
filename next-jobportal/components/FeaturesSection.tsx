import Link from 'next/link';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    badge: 'AI-Powered Career Guidance',
    title: 'Discover Your Career Path',
    description: 'Get personalized job recommendations and learning roadmaps based on your skills.',
    buttonText: 'Get Career Guidance',
    href: '/career-guidance',
    bgColor: 'bg-slate-50 dark:bg-gray-900',
  },
  {
    icon: FileText,
    badge: 'AI-Powered ATS Analysis',
    title: 'Optimize Your Resume for ATS',
    description: "Get instant feedback on your resume's compatibility with Applicant Tracking Systems",
    buttonText: 'Analyze My Resume',
    href: '/resume-analyzer',
    bgColor: 'bg-white dark:bg-gray-800',
  },
];

export default function FeaturesSection() {
  return (
    <>
      {features.map(({ icon: Icon, badge, title, description, buttonText, href, bgColor }) => (
        <section key={title} className={`py-20 ${bgColor}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-600 mb-6">
              <Icon size={16} className="text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{badge}</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              {description}
            </p>

            {/* Button */}
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Icon size={18} />
              {buttonText}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      ))}
    </>
  );
}
