"use client";
import Link from 'next/link';
import { Sparkles, FileText, ArrowRight, Brain, Target, Zap } from 'lucide-react';
import { useState } from 'react';
import CareerGuidanceOverlay from './CareerGuidanceOverlay';
import ResumeAnalyzerOverlay from './ResumeAnalyzerOverlay';

const features = [
  {
    icon: Sparkles,
    badge: 'AI-Powered Career Guidance',
    title: 'Discover Your Perfect Career Path',
    description: 'Get hyper-personalized job recommendations and learning roadmaps based on your unique skills, interests, and career goals using advanced AI algorithms.',
    buttonText: 'Get Career Guidance',
    href: '/career-guidance',
    gradient: 'from-purple-500 to-pink-500',
    bgPattern: 'radial-linear-to-tle at 20% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
  },
  {
    icon: FileText,
    badge: 'AI-Powered ATS Analysis',
    title: 'Optimize Your Resume for Success',
    description: "Get instant, detailed feedback on your resume's compatibility with Applicant Tracking Systems and increase your interview chances by 10x.",
    buttonText: 'Analyze My Resume',
    href: '/resume-analyzer',
    gradient: 'from-blue-500 to-cyan-500',
    bgPattern: 'radial-linear-to-tle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
  },
];

export default function FeaturesSection() {
  const [isCareerOverlayOpen, setIsCareerOverlayOpen] = useState(false);
  const [isResumeOverlayOpen, setIsResumeOverlayOpen] = useState(false);

  return (
    <>
      <div className="relative mt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {features.map(({ icon: Icon, badge, title, description, buttonText, href, gradient, bgPattern }, index) => (
          <section 
            key={title} 
            className={`py-24 relative overflow-hidden ${index % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-900/50'}`}
            style={{ background: bgPattern }}
          >
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-lg animate-float"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-lg animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''} animate-slide-up`}>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full hover-lift group">
                    <div className={`w-8 h-8 bg-linear-to-br ${gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-linear-to-primary">{badge}</span>
                    <Zap className="text-yellow-500 animate-pulse" size={16} />
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    <span className="block text-gray-900 dark:text-white mb-2">{title.split(' ').slice(0, -2).join(' ')}</span>
                    <span className={`block text-transparent bg-clip-text bg-linear-to-r ${gradient}`}>
                      {title.split(' ').slice(-2).join(' ')}
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                    {description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-4">
                    {[
                      { icon: Brain, text: 'Advanced AI algorithms' },
                      { icon: Target, text: 'Personalized recommendations' },
                      { icon: Zap, text: 'Instant results' }
                    ].map(({ icon: FeatureIcon, text }) => (
                      <div key={text} className="flex items-center gap-3 group">
                        <div className={`w-10 h-10 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <FeatureIcon size={18} className="text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  {index === 0 ? (
                    <button
                      onClick={() => setIsCareerOverlayOpen(true)}
                      className={`btn-primary group inline-flex items-center gap-3 text-base px-6 py-3 bg-linear-to-r ${gradient}`}
                    >
                      <Icon size={18} className="group-hover:rotate-12 transition-transform" />
                      {buttonText}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : index === 1 ? (
                    <button
                      onClick={() => setIsResumeOverlayOpen(true)}
                      className={`btn-primary group inline-flex items-center gap-3 text-base px-6 py-3 bg-linear-to-r ${gradient}`}
                    >
                      <Icon size={18} className="group-hover:rotate-12 transition-transform" />
                      {buttonText}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      href={href}
                      className={`btn-primary group inline-flex items-center gap-3 text-base px-6 py-3 bg-linear-to-r ${gradient}`}
                    >
                      <Icon size={18} className="group-hover:rotate-12 transition-transform" />
                      {buttonText}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Visual Element */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="relative">
                    {/* Main Card */}
                    <div className="glass-dark rounded-3xl p-8 hover-lift animate-float">
                      <div className={`w-24 h-24 bg-linear-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow`}>
                        <Icon size={48} className="text-white" />
                      </div>
                      
                      <div className="text-center space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Ready to get started?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Join thousands of professionals who have transformed their careers with our AI-powered tools.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                          <div className="glass rounded-xl p-4">
                            <div className="text-2xl font-black text-linear-to-primary">95%</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                          </div>
                          <div className="glass rounded-xl p-4">
                            <div className="text-2xl font-black text-linear-to-accent">24/7</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Availability</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Decorations */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-linear-to-br from-purple-400 to-pink-400 rounded-full opacity-30 blur-lg animate-float"></div>
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full opacity-30 blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
    
    {/* Career Guidance Overlay */}
    <CareerGuidanceOverlay 
      isOpen={isCareerOverlayOpen} 
      onClose={() => setIsCareerOverlayOpen(false)} 
    />
    
    {/* Resume Analyzer Overlay */}
    <ResumeAnalyzerOverlay 
      isOpen={isResumeOverlayOpen} 
      onClose={() => setIsResumeOverlayOpen(false)} 
    />
    </>
  );
}
