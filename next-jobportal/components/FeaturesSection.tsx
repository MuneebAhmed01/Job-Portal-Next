"use client";

import Link from "next/link";
import { Sparkles, FileText, ArrowRight, Brain, Target, Zap } from "lucide-react";
import { useState } from "react";
import CareerGuidanceOverlay from "./CareerGuidanceOverlay";
import ResumeAnalyzerOverlay from "./ResumeAnalyzerOverlay";

const features = [
  {
    icon: Sparkles,
    badge: "AI-Powered Career Guidance",
    title: "Discover Your Perfect Career Path",
    description:
      "Get hyper-personalized job recommendations and learning roadmaps based on your unique skills, interests, and career goals using advanced AI algorithms.",
    buttonText: "Get Career Guidance",
    href: "/career-guidance",
  },
  {
    icon: FileText,
    badge: "AI-Powered ATS Analysis",
    title: "Optimize Your Resume for Success",
    description:
      "Get instant, detailed feedback on your resume's compatibility with Applicant Tracking Systems and increase your interview chances by 10x.",
    buttonText: "Analyze My Resume",
    href: "/resume-analyzer",
  },
];

export default function FeaturesSection() {
  const [isCareerOverlayOpen, setIsCareerOverlayOpen] = useState(false);
  const [isResumeOverlayOpen, setIsResumeOverlayOpen] = useState(false);

  return (
    <>
      <div className="relative bg-[#020617] text-white">

        {features.map(({ icon: Icon, badge, title, description, buttonText, href }, index) => (
          <section
            key={title}
            className={`py-28 relative ${
              index % 2 === 1
                ? "bg-linear-to-b from-transparent via-white/[0.02] to-transparent"
                : ""
            }`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                {/* content */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""} space-y-8`}>

                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-gray-300">
                    <Icon size={16} />
                    {badge}
                  </div>

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                    {title}
                  </h2>

                  <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                    {description}
                  </p>

                  <div className="space-y-4">
                    {[
                      { icon: Brain, text: "Advanced AI algorithms" },
                      { icon: Target, text: "Personalized recommendations" },
                      { icon: Zap, text: "Instant results" },
                    ].map(({ icon: FeatureIcon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-gray-300">
                        <FeatureIcon size={18} />
                        {text}
                      </div>
                    ))}
                  </div>

                  {/* buttons */}
                  {index === 0 ? (
                    <button
                      onClick={() => setIsCareerOverlayOpen(true)}
                      className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-full font-semibold"
                    >
                      <Icon size={18} />
                      {buttonText}
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsResumeOverlayOpen(true)}
                      className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-full font-semibold"
                    >
                      <Icon size={18} />
                      {buttonText}
                      <ArrowRight size={18} />
                    </button>
                  )}
                </div>

                {/* visual */}
                <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur p-10 text-center">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-orange-500 flex items-center justify-center mb-6">
                      <Icon size={48} />
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      Ready to get started?
                    </h3>

                    <p className="text-gray-400 mb-6">
                      Join thousands of professionals transforming their careers with AI tools.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-2xl font-black text-orange-400">95%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-2xl font-black text-orange-400">24/7</div>
                        <div className="text-sm text-gray-400">Availability</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>

      <CareerGuidanceOverlay
        isOpen={isCareerOverlayOpen}
        onClose={() => setIsCareerOverlayOpen(false)}
      />

      <ResumeAnalyzerOverlay
        isOpen={isResumeOverlayOpen}
        onClose={() => setIsResumeOverlayOpen(false)}
      />
    </>
  );
}
