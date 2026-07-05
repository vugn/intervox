'use client';

import { GoogleGenAI, Type } from '@google/genai';
import { updateSession, saveAnalysisResult, saveRecommendations } from '@/lib/data-service';

export interface AnalysisResult {
  strengths: string[];
  weaknesses: string[];
  overallFeedback: string;
  scores: {
    communication: number;
    technical: number;
    problemSolving: number;
    cultureFit: number;
    expression?: number;
  };
  expressionAnalysis?: {
    confidenceLevel: string;
    expressionFeedback: string;
    dominantExpression: string;
  };
}

export interface AnalyzeSessionParams {
  sessionId: string;
  transcript: Array<{ role: string; text: string }>;
  role: string;
  language: string;
  difficulty: string;
  interviewType: string;
  moduleCategory: string;
  scoringGuide?: string;
  expressionData?: any;
}

/**
 * Run AI analysis on a saved interview transcript.
 * Updates the session with analysis results and scores.
 * Returns the analysis result or null on failure.
 */
export async function analyzeInterview(params: AnalyzeSessionParams): Promise<AnalysisResult | null> {
  const {
    sessionId,
    transcript,
    role,
    language,
    difficulty,
    interviewType,
    moduleCategory,
    scoringGuide,
    expressionData,
  } = params;

  const analysisModel = process.env.NEXT_PUBLIC_GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
  const clientGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!clientGeminiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not set.');
  }

  // Mark session as analyzing
  try {
    await updateSession(sessionId, { status: 'analyzing' });
  } catch (e) {
    console.error('Failed to set analyzing status:', e);
  }

  const ai = new GoogleGenAI({ apiKey: clientGeminiKey });
  const transcriptText = transcript
    .map(t => `${t.role === 'user' ? 'Candidate' : 'Interviewer'}: ${t.text}`)
    .join('\n');

  const analysisPrompt = `Analyze the following interview transcript for a ${role} position.
Language: ${language}
Difficulty: ${difficulty}
Interview type: ${interviewType}
Category: ${moduleCategory}

Scoring criteria reference:
${scoringGuide || 'Use balanced criteria for communication, technical depth, problem solving, and culture fit.'}

Transcript:
${transcriptText}

${expressionData && expressionData.totalFramesAnalyzed > 0 ? `
Facial Expression Data from Webcam (analyzed every 500ms):
- Dominant Expression: ${expressionData.dominantExpression}
- Confidence Score: ${expressionData.confidenceScore}/100
- Nervousness Indicator: ${expressionData.nervousnessIndicator}/100
- Expression Distribution: ${JSON.stringify(expressionData.expressionDistribution)}

Please incorporate the facial expression data to provide feedback on the candidate's body language and non-verbal communication.
` : `Note: No facial expression data was provided for this session.`}

Provide a detailed analysis including:
1. Key Strengths (list of 3-5 points)
2. Areas for Improvement (list of 2-4 points)
3. Overall Feedback (a short paragraph)
4. Scores (0-100) for: Communication, Technical Skills, Problem Solving, Culture Fit, and Expression.

Return ONLY a valid JSON object matching this schema:
{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "overallFeedback": "...",
  "scores": {
    "communication": 85,
    "technical": 70,
    "problemSolving": 80,
    "cultureFit": 90,
    "expression": 75
  },
  "expressionAnalysis": {
    "confidenceLevel": "tinggi/sedang/rendah",
    "expressionFeedback": "...",
    "dominantExpression": "neutral"
  }
}`;

  // 60 second timeout
  const aiPromise = ai.models.generateContent({
    model: analysisModel,
    contents: analysisPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallFeedback: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              communication: { type: Type.NUMBER },
              technical: { type: Type.NUMBER },
              problemSolving: { type: Type.NUMBER },
              cultureFit: { type: Type.NUMBER },
              expression: { type: Type.NUMBER },
            },
            required: ['communication', 'technical', 'problemSolving', 'cultureFit', 'expression'],
          },
          expressionAnalysis: {
            type: Type.OBJECT,
            properties: {
              confidenceLevel: { type: Type.STRING },
              expressionFeedback: { type: Type.STRING },
              dominantExpression: { type: Type.STRING },
            },
            required: ['confidenceLevel', 'expressionFeedback', 'dominantExpression'],
          },
        },
        required: ['strengths', 'weaknesses', 'overallFeedback', 'scores', 'expressionAnalysis'],
      },
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('AI analysis timed out after 60 seconds')), 60000),
  );

  try {
    const response = await Promise.race([aiPromise, timeoutPromise]);
    const analysisResult: AnalysisResult = JSON.parse(response.text || '{}');
    const overallScore = Math.round(
      (analysisResult.scores.communication +
        analysisResult.scores.technical +
        analysisResult.scores.problemSolving +
        analysisResult.scores.cultureFit +
        (analysisResult.scores.expression || 0)) / 5,
    );

    // Save to database
    await updateSession(sessionId, {
      status: 'completed',
      analysis: analysisResult,
      score: overallScore,
    });

    try {
      await saveAnalysisResult(sessionId, analysisResult);
    } catch (e) {
      console.error('Failed to save analysis_results row:', e);
    }

    const recommendations = (analysisResult.weaknesses || []).map((item, index) => ({
      recommendationText: `Focus on improving: ${item}`,
      recommendationType: 'improvement',
      priority: index + 1,
    }));

    if (recommendations.length > 0) {
      try {
        await saveRecommendations(sessionId, recommendations);
      } catch (e) {
        console.error('Failed to save recommendations:', e);
      }
    }

    return analysisResult;
  } catch (error) {
    console.error('AI analysis failed:', error);

    // Mark as pending so user can retry
    try {
      await updateSession(sessionId, { status: 'pending_analysis' });
    } catch (e) {
      console.error('Failed to reset status:', e);
    }

    return null;
  }
}
