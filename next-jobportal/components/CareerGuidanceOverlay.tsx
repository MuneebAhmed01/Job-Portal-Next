'use client';

import { useState } from 'react';
import { X, Plus, Sparkles, Briefcase, Target, Award, ChevronRight } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
}

interface CareerAnalysis {
  careerSummary: string;
  primaryCareerTitle: string;
  careerCategory: string;
  recommendedCareerPaths: {
    title: string;
    description: string;
    keyResponsibilities: string[];
    whyItFits: string;
    relevantJobTitles: string[];
  }[];
}

interface CareerGuidanceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CareerGuidanceOverlay({ isOpen, onClose }: CareerGuidanceOverlayProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [error, setError] = useState('');

  const addSkill = () => {
    const trimmed = currentSkill.trim();
    if (trimmed && !skills.some(skill => skill.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { id: Date.now().toString(), name: trimmed }]);
      setCurrentSkill('');
      setError('');
    }
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const analyzeSkills = async () => {
    if (skills.length === 0) {
      setError('Please add at least one skill to analyze');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/career-guidance/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: skills.map(skill => skill.name)
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze skills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSkills([]);
    setCurrentSkill('');
    setError('');
  };

  const closeOverlay = () => {
    onClose();
    setTimeout(resetAnalysis, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOverlay}
      />
      
      {/* Overlay Content */}
      <div className="relative glass-dark rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Career Guidance AI</h2>
              <p className="text-sm text-gray-400">Discover your perfect career path</p>
            </div>
          </div>
          <button
            onClick={closeOverlay}
            className="w-10 h-10 rounded-xl glass hover-lift flex items-center justify-center transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!analysis ? (
            <div className="space-y-6">
              {/* Skills Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Add Your Technical Skills
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="e.g., React, Node.js, Python..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover-lift flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              {/* Skills List */}
              {skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Your Skills ({skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="glass px-3 py-2 rounded-full flex items-center gap-2 hover-lift"
                      >
                        <span className="text-sm text-gray-300">{skill.name}</span>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                        >
                          <X size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyzeSkills}
                disabled={isLoading || skills.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Your Skills...
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    Discover My Career Path
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Career Analysis</h3>
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
                  <Briefcase size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">{analysis.primaryCareerTitle}</span>
                </div>
              </div>

              {/* Career Summary */}
              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3">Career Summary</h4>
                <p className="text-gray-300 leading-relaxed">{analysis.careerSummary}</p>
              </div>

              {/* Career Category */}
              <div className="flex items-center justify-between glass rounded-xl p-4">
                <div>
                  <p className="text-sm text-gray-400">Career Category</p>
                  <p className="text-lg font-bold text-white">{analysis.careerCategory}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="text-white" size={20} />
                </div>
              </div>

              {/* Recommended Career Paths */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Recommended Career Paths</h4>
                <div className="space-y-4">
                  {analysis.recommendedCareerPaths.map((path, index) => (
                    <div key={index} className="glass rounded-xl p-6 hover-lift">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h5 className="text-lg font-bold text-white">{path.title}</h5>
                          <p className="text-gray-400 text-sm mt-1">{path.description}</p>
                        </div>
                        <ChevronRight className="text-purple-400 mt-1" size={20} />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-purple-400 mb-2">Key Responsibilities</p>
                          <ul className="space-y-1">
                            {path.keyResponsibilities.map((responsibility, idx) => (
                              <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                                {responsibility}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-green-400 mb-2">Why This Fits You</p>
                          <p className="text-sm text-gray-300">{path.whyItFits}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-blue-400 mb-2">Common Job Titles</p>
                          <div className="flex flex-wrap gap-2">
                            {path.relevantJobTitles.map((title, idx) => (
                              <span key={idx} className="glass px-2 py-1 rounded-full text-xs text-gray-300">
                                {title}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 py-3 glass border border-white/20 rounded-xl text-white font-medium hover-lift"
                >
                  Analyze Different Skills
                </button>
                <button
                  onClick={closeOverlay}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover-lift"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
