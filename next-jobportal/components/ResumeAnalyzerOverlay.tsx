'use client';

import { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Award, RefreshCw } from 'lucide-react';

interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  scoreBreakdown: {
    formatting: number;
    keywords: number;
    structure: number;
    readability: number;
    jobMatch: number;
  };
  strengths: string[];
  improvements: {
    structure: string[];
    content: string[];
    keywords: string[];
  };
  jobMatchAnalysis?: {
    skillMatches: string[];
    experienceMatches: string[];
    qualificationMatches: string[];
    missingKeywords: string[];
    matchPercentage: number;
  };
}

interface ResumeAnalyzerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeAnalyzerOverlay({ isOpen, onClose }: ResumeAnalyzerOverlayProps) {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const analyzeResume = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }
    
    if (jobTitle.trim()) {
      formData.append('jobTitle', jobTitle);
    }

    try {
      setUploadState('analyzing');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume-analyzer/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result.data);
      setUploadState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      setUploadState('idle');
    }
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setSelectedFile(null);
    setJobDescription('');
    setJobTitle('');
    setUploadState('idle');
    setError('');
  };

  const closeOverlay = () => {
    onClose();
    setTimeout(resetAnalysis, 300);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F54900' }}>
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Resume Analyzer</h2>
              <p className="text-sm text-gray-400">ATS Compatibility Analysis</p>
            </div>
          </div>
          <button
            onClick={closeOverlay}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!analysis ? (
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resume-upload"
                  disabled={uploadState !== 'idle'}
                />
                <label 
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-linear-to-tbr from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Upload className="text-white" size={32} />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-gray-400 text-sm">PDF files only, up to 5MB</p>
                  </div>
                </label>
              </div>

              {/* Job Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors"
                    disabled={uploadState !== 'idle'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Description (Optional - for better ATS matching)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get a more accurate ATS score based on specific requirements..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                    disabled={uploadState !== 'idle'}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Including job description helps match your resume to specific requirements and provides a more accurate ATS score.
                  </p>
                </div>
              </div>

              {error && (
                <div className="glass rounded-xl p-4 flex items-center gap-3 text-red-400">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyzeResume}
                disabled={!selectedFile || uploadState !== 'idle'}
                className="w-full py-4 bg-linear-to-tr from-blue-500 to-cyan-500 rounded-xl text-white font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {uploadState === 'uploading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading resume...
                  </>
                ) : uploadState === 'analyzing' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing your resume...
                  </>
                ) : (
                  <>
                    <Target size={20} />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Results Header */}
              <div className="text-center">
                <div className={`w-24 h-24 bg-linear-to-tbr ${getScoreBgColor(analysis.atsScore)} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl font-black text-white">{analysis.atsScore}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">ATS Compatibility Score</h3>
                <div className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full`}>
                  <TrendingUp className={getScoreColor(analysis.atsScore)} size={16} />
                  <span className={`text-sm font-medium ${getScoreColor(analysis.atsScore)}`}>
                    {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="text-orange-400" size={20} />
                  Analysis Summary
                </h4>
                <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Score Breakdown */}
              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Score Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scoreBreakdown.formatting)}`}>
                      {analysis.scoreBreakdown.formatting}
                    </div>
                    <div className="text-sm text-gray-400">Formatting</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scoreBreakdown.keywords)}`}>
                      {analysis.scoreBreakdown.keywords}
                    </div>
                    <div className="text-sm text-gray-400">Keywords</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scoreBreakdown.structure)}`}>
                      {analysis.scoreBreakdown.structure}
                    </div>
                    <div className="text-sm text-gray-400">Structure</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scoreBreakdown.readability)}`}>
                      {analysis.scoreBreakdown.readability}
                    </div>
                    <div className="text-sm text-gray-400">Readability</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scoreBreakdown.jobMatch)}`}>
                      {analysis.scoreBreakdown.jobMatch}
                    </div>
                    <div className="text-sm text-gray-400">Job Match</div>
                  </div>
                </div>
              </div>

              {/* Job Match Analysis */}
              {analysis.jobMatchAnalysis && (
                <div className="glass rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="text-blue-400" size={20} />
                    Job Description Match Analysis
                  </h4>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Overall Match</span>
                      <span className={`text-sm font-bold ${getScoreColor(analysis.jobMatchAnalysis.matchPercentage)}`}>
                        {analysis.jobMatchAnalysis.matchPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          analysis.jobMatchAnalysis.matchPercentage >= 80 ? 'bg-green-500' :
                          analysis.jobMatchAnalysis.matchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.jobMatchAnalysis.matchPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.jobMatchAnalysis.skillMatches.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-400 mb-2">Matching Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.jobMatchAnalysis.skillMatches.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.jobMatchAnalysis.experienceMatches.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-blue-400 mb-2">Matching Experience</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.jobMatchAnalysis.experienceMatches.map((exp, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.jobMatchAnalysis.qualificationMatches.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-400 mb-2">Matching Qualifications</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.jobMatchAnalysis.qualificationMatches.map((qual, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                              {qual}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.jobMatchAnalysis.missingKeywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-400 mb-2">Missing Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.jobMatchAnalysis.missingKeywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {analysis.strengths.length > 0 && (
                <div className="glass rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    What Your Resume Does Well
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              <div className="glass rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="text-yellow-400" size={20} />
                  Recommendations for Improvement
                </h4>
                
                {(analysis.improvements.structure.length > 0 || 
                  analysis.improvements.content.length > 0 || 
                  analysis.improvements.keywords.length > 0) && (
                  <div className="space-y-4">
                    {analysis.improvements.structure.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-400 mb-2">Structure</p>
                        <ul className="space-y-1">
                          {analysis.improvements.structure.map((item, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.improvements.content.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-400 mb-2">Content</p>
                        <ul className="space-y-1">
                          {analysis.improvements.content.map((item, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {analysis.improvements.keywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-orange-400 mb-2">Keywords</p>
                        <ul className="space-y-1">
                          {analysis.improvements.keywords.map((item, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="w-1 h-1 bg-orange-400 rounded-full mt-1.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 py-3 glass border border-white/20 rounded-xl text-white font-medium hover-lift flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Analyze Another Resume
                </button>
                <button
                  onClick={closeOverlay}
                  className="flex-1 py-3 bg-linear-to-tr from-blue-500 to-cyan-500 rounded-xl text-white font-medium hover-lift"
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
