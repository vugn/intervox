'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getSessionById } from '@/lib/data-service';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, CheckCircle, AlertTriangle, RefreshCw, Loader2, BarChart2, Activity } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      if (authLoading) return;
      if (!user || !id) {
        setLoading(false);
        return;
      }
      try {
        const sessionData = await getSessionById(id as string);

        if (sessionData) {
          setSession({ ...sessionData, id: (sessionData as any).id || id });
        } else {
          console.error("Session not found");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [user, id, router, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Report Not Found</h2>
          <p className="text-slate-600 mb-6">The interview session you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/dashboard" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const analysis = session.analysis;

  const handleRunAnalysis = async () => {
    if (!session.transcript || session.transcript.length < 2) {
      setAnalysisError('Transcript is too short to analyze. Please complete a longer interview.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const { analyzeInterview } = await import('@/lib/analyze-interview');
      const result = await analyzeInterview({
        sessionId: session.id,
        transcript: session.transcript,
        role: session.jobRole || session.roleTarget || 'General',
        language: session.language || 'English',
        difficulty: session.difficulty || 'medium',
        interviewType: session.moduleType || 'Professional',
        moduleCategory: session.categoryId || 'General',
        expressionData: session.expressionData,
      });

      if (result) {
        // Reload session data to show the new analysis
        const updatedSession = await getSessionById(session.id);
        if (updatedSession) {
          setSession({ ...updatedSession, id: session.id });
        }
      } else {
        setAnalysisError('AI analysis failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      setAnalysisError(error?.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Session needs analysis
  if (!analysis || !analysis.scores || session.status === 'pending_analysis' || session.status === 'analyzing') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          {isAnalyzing ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Analyzing Your Interview...</h2>
              <p className="text-slate-600 mb-2">AI is reviewing your transcript and generating scores.</p>
              <p className="text-sm text-slate-400">This may take up to 60 seconds.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Ready to Run</h2>
              <p className="text-slate-600 mb-6">
                Your interview transcript has been saved. Click below to run the AI analysis and get your scores.
              </p>
              {analysisError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {analysisError}
                </div>
              )}
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRunAnalysis}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                >
                  <BarChart2 className="w-4 h-4" />
                  Run AI Analysis
                </button>
                <Link href="/dashboard" className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                  Later
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const overallScore = session.score || Math.round((analysis.scores.communication + analysis.scores.technical + analysis.scores.problemSolving + analysis.scores.cultureFit) / 4);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4 print:hidden">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Interview Report</h1>
            <p className="text-slate-500 mt-1">
              {session.jobRole} • {new Date(session.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8,"
                  + "Role,Date,Language,Overall Score,Communication,Technical,Problem Solving,Culture Fit\n"
                  + `"${session.jobRole}","${new Date(session.createdAt).toLocaleDateString()}","${session.language}",${overallScore},${analysis.scores.communication},${analysis.scores.technical},${analysis.scores.problemSolving},${analysis.scores.cultureFit}`;
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `interview_report_${session.id}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Overview & Scores */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overall Score Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Overall Score</h3>
            <div className="relative inline-flex items-center justify-center mb-2">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - overallScore / 100)}
                  className={`transition-all duration-1000 ease-out ${overallScore >= 80 ? 'text-emerald-500' :
                      overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                    }`}
                />
              </svg>
              <span className="absolute text-4xl font-black text-slate-900">{overallScore}</span>
            </div>
            <p className="text-slate-600 font-medium mt-2">
              {overallScore >= 80 ? 'Excellent Performance' :
                overallScore >= 60 ? 'Good, needs improvement' : 'Needs significant practice'}
            </p>
          </div>

          {/* Detailed Scores */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Score Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(analysis.scores).map(([key, value]: [string, any]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-slate-900">{value}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${value >= 80 ? 'bg-emerald-500' :
                          value >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Session Details</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-slate-500">Language</span>
                <span className="font-medium text-slate-900">{session.language}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Difficulty</span>
                <span className="font-medium text-slate-900 capitalize">{session.difficulty}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Interviewer Style</span>
                <span className="font-medium text-slate-900 capitalize">{session.interviewerPersonality}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-900">
                  {session.endTime ? Math.round((new Date(session.endTime).getTime() - new Date(session.createdAt).getTime()) / 60000) : '?'} mins
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Feedback & Transcript */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Feedback */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Executive Summary
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {analysis.overallFeedback}
            </p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-emerald-700 text-sm">
                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-amber-700 text-sm">
                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Facial Expression Analysis */}
          {analysis.expressionAnalysis && (
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
              <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Facial Expression & Body Language
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/60 p-4 rounded-xl">
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Confidence Level</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{analysis.expressionAnalysis.confidenceLevel}</p>
                </div>
                <div className="bg-white/60 p-4 rounded-xl">
                  <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Dominant Expression</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{analysis.expressionAnalysis.dominantExpression}</p>
                </div>
              </div>
              <div className="bg-white/80 p-4 rounded-xl text-sm text-slate-700 leading-relaxed">
                <strong className="text-indigo-900 block mb-1">AI Feedback:</strong>
                {analysis.expressionAnalysis.expressionFeedback}
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Interview Transcript</h3>
              <p className="text-sm text-slate-500">Full record of your conversation</p>
            </div>
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {session.transcript && session.transcript.length > 0 ? (
                session.transcript.map((turn: any, i: number) => (
                  <div key={i} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${turn.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                      }`}>
                      <p className="text-xs font-medium opacity-70 mb-1">
                        {turn.role === 'user' ? 'You' : 'Interviewer'}
                      </p>
                      <p className="whitespace-pre-wrap">{turn.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 italic py-8">No transcript available for this session.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
