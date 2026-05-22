import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CategoryItem = {
  id: string;
  categoryName: string;
  description?: string;
  moduleType?: string;
  difficultyLevel?: string;
  isActive?: boolean;
};

export type QuestionItem = {
  id: string;
  categoryId?: string;
  questionText?: string;
  idealKeywords?: string;
  difficultyLevel?: string;
};

export type ScoringCriteriaItem = {
  id: string;
  criteriaName: string;
  weightScore: number;
  idealKeywords?: string;
  description?: string;
  isActive?: boolean;
};

export type LecturerItem = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  faculty?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert snake_case DB row to camelCase app object */
function toCamel(row: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

/** Convert camelCase app object to snake_case for DB */
function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = value;
  }
  return result;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserByUid(uid: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*, student_profiles(*)")
    .eq("auth_id", uid)
    .maybeSingle();

  if (error || !user) return null;

  const profile = Array.isArray(user.student_profiles)
    ? user.student_profiles[0]
    : user.student_profiles;

  return {
    uid: user.auth_id,
    id: user.id,
    email: user.email,
    displayName: user.full_name,
    fullName: user.full_name,
    role: user.role,
    phone: user.phone,
    department: user.department,
    faculty: user.faculty,
    photoURL: user.photo_url,
    // Profile fields
    university: profile?.university,
    major: profile?.major,
    graduationYear: profile?.graduation_year,
    targetIndustry: profile?.target_industry,
    bio: profile?.bio,
    cvPath: profile?.cv_url,
    cvUrl: profile?.cv_url,
    gpa: profile?.gpa,
    skills: profile?.skills,
    linkedinUrl: profile?.linkedin_url,
  };
}

export async function upsertUser(uid: string, data: Record<string, unknown>) {
  // 1. Upsert user record
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", uid)
    .maybeSingle();

  const userPayload = {
    auth_id: uid,
    email: data.email as string,
    full_name: (data.displayName ?? data.fullName ?? "") as string,
    role: (data.role ?? "student") as string,
    phone: data.phone as string | undefined,
    department: data.department as string | undefined,
    faculty: data.faculty as string | undefined,
    photo_url: data.photoURL as string | undefined,
    updated_at: new Date().toISOString(),
  };

  let userId: string;

  if (existing) {
    userId = existing.id;
    await supabase.from("users").update(userPayload).eq("id", userId);
  } else {
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({ ...userPayload, created_at: new Date().toISOString() })
      .select("id")
      .single();

    if (error || !newUser) {
      console.error("Error creating user:", error?.message, error?.details, error?.code, error);
      throw new Error(error?.message || "Failed to create user record");
    }
    userId = newUser.id;
  }

  // 2. Upsert student profile if there's profile data
  const hasProfileData = [
    "university", "major", "graduationYear", "targetIndustry",
    "bio", "cvPath", "cvUrl", "gpa", "skills", "linkedinUrl",
  ].some((key) => data[key] !== undefined);

  if (hasProfileData) {
    const profilePayload = {
      user_id: userId,
      university: data.university as string | undefined,
      major: data.major as string | undefined,
      graduation_year: data.graduationYear as string | undefined,
      target_industry: data.targetIndustry as string | undefined,
      bio: data.bio as string | undefined,
      cv_url: (data.cvPath ?? data.cvUrl) as string | undefined,
      gpa: data.gpa as number | undefined,
      skills: data.skills as string | undefined,
      linkedin_url: data.linkedinUrl as string | undefined,
      updated_at: new Date().toISOString(),
    };

    const { data: existingProfile } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfile) {
      await supabase
        .from("student_profiles")
        .update(profilePayload)
        .eq("user_id", userId);
    } else {
      await supabase
        .from("student_profiles")
        .insert({ ...profilePayload, created_at: new Date().toISOString() });
    }
  }
}

export async function getInternalUserId(authUid: string): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", authUid)
    .maybeSingle();
  return data?.id ?? null;
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function createSession(data: Record<string, unknown>) {
  const authUid = data.userId as string;
  let internalId = await getInternalUserId(authUid);
  
  // Auto-create user record if not found (safety net for first login after email confirm)
  if (!internalId) {
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      await upsertUser(authData.user.id, {
        email: authData.user.email,
        displayName: authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || '',
        role: 'student',
      });
      internalId = await getInternalUserId(authUid);
    }
  }

  if (!internalId) throw new Error("User not found. Please log out and log in again.");

  const payload = {
    user_id: internalId,
    category_id: (data.categoryId || data.moduleCategory || null) as string | null,
    module_type: (data.moduleType ?? data.interviewType ?? null) as string | null,
    role_target: (data.jobRole ?? null) as string | null,
    company: (data.company ?? null) as string | null,
    language: (data.language ?? null) as string | null,
    personality: (data.personality ?? null) as string | null,
    difficulty: (data.difficulty ?? null) as string | null,
    status: (data.status ?? "in-progress") as string,
    score: (data.score ?? null) as number | null,
    start_time: (data.startedAt ?? new Date().toISOString()) as string,
    end_time: (data.completedAt ?? null) as string | null,
    transcript: (data.transcript ?? []) as unknown,
    analysis: (data.analysis ?? null) as unknown,
    self_assessment: (data.selfAssessment ?? null) as unknown,
    candidate_name: (data.candidateName ?? null) as string | null,
    candidate_email: (data.candidateEmail ?? null) as string | null,
    job_description: (data.jobDescription ?? null) as string | null,
    focus_areas: (data.focusAreas ?? null) as string | null,
    cv_url: (data.cvUrl ?? null) as string | null,
    education: (data.education ?? null) as string | null,
    years_experience: (data.yearsExperience ?? null) as string | null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: session, error } = await supabase
    .from("interview_sessions")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw error;
  return session.id;
}

export async function updateSession(
  sessionId: string,
  data: Record<string, unknown>,
) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.status !== undefined) payload.status = data.status;
  if (data.score !== undefined) payload.score = data.score;
  if (data.transcript !== undefined) payload.transcript = data.transcript;
  if (data.analysis !== undefined) payload.analysis = data.analysis;
  if (data.selfAssessment !== undefined) payload.self_assessment = data.selfAssessment;
  if (data.completedAt !== undefined) payload.end_time = data.completedAt;
  if (data.expressionData !== undefined) payload.expression_data = data.expressionData;

  const { error } = await supabase
    .from("interview_sessions")
    .update(payload)
    .eq("id", sessionId);

  if (error) {
    console.error("updateSession error:", error.message, error.code, error.details);
    throw new Error(`Failed to update session: ${error.message}`);
  }
}

export async function getSessionById(sessionId: string) {
  const { data: session, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) return null;

  return {
    id: session.id,
    userId: session.user_id,
    categoryId: session.category_id,
    moduleType: session.module_type,
    jobRole: session.role_target,
    roleTarget: session.role_target,
    company: session.company,
    language: session.language,
    personality: session.personality,
    difficulty: session.difficulty,
    status: session.status,
    score: session.score,
    totalScore: session.score,
    startedAt: session.start_time,
    completedAt: session.end_time,
    startTime: session.start_time,
    endTime: session.end_time,
    transcript: session.transcript,
    analysis: session.analysis,
    selfAssessment: session.self_assessment,
    expressionData: session.expression_data,
    candidateName: session.candidate_name,
    candidateEmail: session.candidate_email,
    jobDescription: session.job_description,
    focusAreas: session.focus_areas,
    cvUrl: session.cv_url,
    education: session.education,
    yearsExperience: session.years_experience,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
  };
}

export async function listSessionsByUser(userId: string) {
  // userId here is auth UID — need internal id
  const internalId = await getInternalUserId(userId);
  if (!internalId) return [];

  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", internalId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((session) => ({
    id: session.id,
    userId: session.user_id,
    categoryId: session.category_id,
    moduleType: session.module_type,
    jobRole: session.role_target,
    roleTarget: session.role_target,
    language: session.language,
    difficulty: session.difficulty,
    status: session.status,
    score: session.score,
    totalScore: session.score,
    candidateName: session.candidate_name,
    createdAt: session.created_at,
    completedAt: session.end_time,
    analysis: session.analysis,
    transcript: session.transcript,
  }));
}

export async function listAllSessions() {
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((session) => ({
    id: session.id,
    userId: session.user_id,
    categoryId: session.category_id,
    moduleType: session.module_type,
    jobRole: session.role_target,
    roleTarget: session.role_target,
    language: session.language,
    difficulty: session.difficulty,
    status: session.status,
    score: session.score,
    totalScore: session.score,
    candidateName: session.candidate_name,
    createdAt: session.created_at,
    completedAt: session.end_time,
    analysis: session.analysis,
    transcript: session.transcript,
  }));
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function listCategories(): Promise<CategoryItem[]> {
  const { data, error } = await supabase
    .from("interview_categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    categoryName: row.category_name,
    description: row.description,
    moduleType: row.module_type,
    difficultyLevel: row.difficulty_level,
    isActive: row.is_active,
  }));
}

export async function createCategory(input: Omit<CategoryItem, "id">) {
  const { data, error } = await supabase
    .from("interview_categories")
    .insert({
      category_name: input.categoryName,
      description: input.description,
      module_type: input.moduleType,
      difficulty_level: input.difficultyLevel,
      is_active: input.isActive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    categoryName: data.category_name,
    description: data.description,
    moduleType: data.module_type,
    difficultyLevel: data.difficulty_level,
    isActive: data.is_active,
  } as CategoryItem;
}

export async function updateCategory(id: string, input: Partial<CategoryItem>) {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.categoryName !== undefined) payload.category_name = input.categoryName;
  if (input.description !== undefined) payload.description = input.description;
  if (input.moduleType !== undefined) payload.module_type = input.moduleType;
  if (input.difficultyLevel !== undefined) payload.difficulty_level = input.difficultyLevel;
  if (input.isActive !== undefined) payload.is_active = input.isActive;

  const { data, error } = await supabase
    .from("interview_categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    categoryName: data.category_name,
    description: data.description,
    moduleType: data.module_type,
    difficultyLevel: data.difficulty_level,
    isActive: data.is_active,
  } as CategoryItem;
}

// ─── Questions ───────────────────────────────────────────────────────────────

export async function listQuestionsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from("question_banks")
    .select("*")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    questionText: row.question_text,
    idealKeywords: row.ideal_keywords,
    difficultyLevel: row.difficulty_level,
  }));
}

export async function createQuestion(input: {
  categoryId: string;
  questionText: string;
  idealKeywords?: string;
  difficultyLevel?: string;
  createdBy?: string;
}) {
  const { data, error } = await supabase
    .from("question_banks")
    .insert({
      category_id: input.categoryId,
      question_text: input.questionText,
      ideal_keywords: input.idealKeywords,
      difficulty_level: input.difficultyLevel,
      created_by: input.createdBy,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    categoryId: data.category_id,
    questionText: data.question_text,
    idealKeywords: data.ideal_keywords,
    difficultyLevel: data.difficulty_level,
  };
}

// ─── Scoring Criteria ────────────────────────────────────────────────────────

export async function listScoringCriteria() {
  const { data, error } = await supabase
    .from("scoring_criteria")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    criteriaName: row.criteria_name,
    weightScore: row.weight_score,
    idealKeywords: row.ideal_keywords,
    description: row.description,
    isActive: row.is_active,
  }));
}

export async function createScoringCriteria(input: Omit<ScoringCriteriaItem, "id">) {
  const { data, error } = await supabase
    .from("scoring_criteria")
    .insert({
      criteria_name: input.criteriaName,
      description: input.description,
      weight_score: input.weightScore,
      ideal_keywords: input.idealKeywords,
      is_active: input.isActive ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    criteriaName: data.criteria_name,
    weightScore: data.weight_score,
    idealKeywords: data.ideal_keywords,
    description: data.description,
    isActive: data.is_active,
  };
}

// ─── Lecturers ───────────────────────────────────────────────────────────────

export async function listLecturers(): Promise<LecturerItem[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "lecturer")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name || "-",
    email: row.email || "-",
    phone: row.phone,
    department: row.department,
    faculty: row.faculty,
  }));
}

export async function createLecturer(input: Omit<LecturerItem, "id">) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email: input.email,
      full_name: input.fullName,
      role: "lecturer",
      phone: input.phone,
      department: input.department,
      faculty: input.faculty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    department: data.department,
    faculty: data.faculty,
  } as LecturerItem;
}

// ─── Conversation Logs ──────────────────────────────────────────────────────

export async function getConversationBySession(sessionId: string) {
  const { data, error } = await supabase
    .from("conversation_logs")
    .select("*")
    .eq("session_id", sessionId)
    .order("timestamp", { ascending: true });

  if (data && data.length > 0) {
    return data.map((row) => ({
      id: row.id,
      sessionId: row.session_id,
      questionText: row.question_text,
      userAnswer: row.user_answer,
      answerType: row.answer_type,
      timestamp: row.timestamp,
    }));
  }

  // Fallback: read from session transcript
  const session = await getSessionById(sessionId);
  const transcript = Array.isArray((session as any)?.transcript)
    ? ((session as any).transcript as Array<any>)
    : [];
  return transcript.map((entry, index) => ({
    id: `tr-${index}`,
    questionText: entry.role === "ai" ? entry.text : "",
    userAnswer: entry.role === "user" ? entry.text : "",
    answerType: "transcript",
    timestamp: entry.timestamp ?? index,
  }));
}

export async function saveConversationLogs(
  sessionId: string,
  transcript: Array<{
    role: string;
    text: string;
    timestamp?: number | string;
  }>,
) {
  const logs = transcript
    .map((entry, index) => ({
      session_id: sessionId,
      question_text: entry.role === "ai" ? entry.text : "",
      user_answer: entry.role === "user" ? entry.text : "",
      answer_type: entry.role,
      timestamp: new Date(
        typeof entry.timestamp === "number" ? entry.timestamp : Date.now() + index,
      ).toISOString(),
      created_at: new Date().toISOString(),
    }))
    .filter((item) => item.question_text || item.user_answer);

  if (logs.length > 0) {
    const { error } = await supabase.from("conversation_logs").insert(logs);
    if (error) {
      console.error("saveConversationLogs error:", error.message, error.code);
    }
  }
}

// ─── Analysis Results ────────────────────────────────────────────────────────

export async function getAnalysisBySession(sessionId: string) {
  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("session_id", sessionId)
    .order("analyzed_at", { ascending: false });

  if (data && data.length > 0) {
    return data.map((row) => ({
      id: row.id,
      communicationScore: row.communication_score,
      technicalScore: row.technical_score,
      problemSolvingScore: row.problem_solving_score,
      cultureFitScore: row.culture_fit_score,
      expressionScore: row.expression_score,
      strengths: row.strengths,
      weaknesses: row.weaknesses,
      overallFeedback: row.overall_feedback,
      confidenceLevel: row.confidence_level,
      expressionFeedback: row.expression_feedback,
      dominantExpression: row.dominant_expression,
    }));
  }

  // Fallback: read from session analysis
  const session = await getSessionById(sessionId);
  const analysis = (session as any)?.analysis;
  if (!analysis) return [];

  return [
    {
      id: `analysis-${sessionId}`,
      communicationScore: analysis.scores?.communication,
      technicalScore: analysis.scores?.technical,
      problemSolvingScore: analysis.scores?.problemSolving,
      cultureFitScore: analysis.scores?.cultureFit,
      expressionScore: analysis.scores?.expression ?? null,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      overallFeedback: analysis.overallFeedback,
      confidenceLevel: analysis.expressionAnalysis?.confidenceLevel ?? null,
      expressionFeedback: analysis.expressionAnalysis?.expressionFeedback ?? null,
      dominantExpression: analysis.expressionAnalysis?.dominantExpression ?? null,
    },
  ];
}

export async function saveAnalysisResult(
  sessionId: string,
  analysis: {
    strengths?: string[];
    weaknesses?: string[];
    overallFeedback?: string;
    scores?: {
      communication?: number;
      technical?: number;
      problemSolving?: number;
      cultureFit?: number;
      expression?: number;
    };
    expressionAnalysis?: {
      confidenceLevel?: string;
      expressionFeedback?: string;
      dominantExpression?: string;
    };
  },
) {
  const { error } = await supabase.from("analysis_results").insert({
    session_id: sessionId,
    communication_score: analysis.scores?.communication ?? 0,
    technical_score: analysis.scores?.technical ?? 0,
    problem_solving_score: analysis.scores?.problemSolving ?? 0,
    culture_fit_score: analysis.scores?.cultureFit ?? 0,
    expression_score: analysis.scores?.expression ?? 0,
    strengths: analysis.strengths ?? [],
    weaknesses: analysis.weaknesses ?? [],
    overall_feedback: analysis.overallFeedback ?? "",
    confidence_level: analysis.expressionAnalysis?.confidenceLevel ?? null,
    expression_feedback: analysis.expressionAnalysis?.expressionFeedback ?? null,
    dominant_expression: analysis.expressionAnalysis?.dominantExpression ?? null,
    analyzed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("saveAnalysisResult error:", error.message, error.code);
  }
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export async function getRecommendationsBySession(sessionId: string) {
  const { data, error } = await supabase
    .from("ai_recommendations")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (data && data.length > 0) {
    return data.map((row) => ({
      id: row.id,
      recommendationText: row.recommendation_text,
      recommendationType: row.recommendation_type,
      priority: row.priority,
    }));
  }

  // Fallback: generate from analysis weaknesses
  const analysisRows = await getAnalysisBySession(sessionId);
  if (!analysisRows[0]) return [];

  const weaknesses = Array.isArray((analysisRows[0] as any).weaknesses)
    ? ((analysisRows[0] as any).weaknesses as string[])
    : [];
  return weaknesses.map((weakness, idx) => ({
    id: `rec-${idx}`,
    recommendationText: `Focus on improving: ${weakness}`,
    recommendationType: "improvement",
    priority: idx + 1,
  }));
}

export async function saveRecommendations(
  sessionId: string,
  recommendations: Array<{
    recommendationText: string;
    recommendationType?: string;
    priority?: number;
  }>,
) {
  const rows = recommendations.map((rec, index) => ({
    session_id: sessionId,
    recommendation_text: rec.recommendationText,
    recommendation_type: rec.recommendationType ?? "improvement",
    priority: rec.priority ?? index + 1,
    created_at: new Date().toISOString(),
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from("ai_recommendations").insert(rows);
    if (error) {
      console.error("saveRecommendations error:", error.message, error.code);
    }
  }
}

// ─── User Feedbacks ──────────────────────────────────────────────────────────

export async function createUserFeedback(input: {
  userId: string;
  sessionId: string;
  rating: number;
  comments?: string;
  selfAssessment?: Record<string, unknown>;
}) {
  const internalId = await getInternalUserId(input.userId);
  if (!internalId) throw new Error("User not found");

  const { data, error } = await supabase
    .from("user_feedbacks")
    .insert({
      user_id: internalId,
      session_id: input.sessionId,
      rating: input.rating,
      comments: input.comments ?? "",
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;

  // Also save self-assessment to session if provided
  if (input.selfAssessment) {
    await updateSession(input.sessionId, {
      selfAssessment: input.selfAssessment,
    });
  }

  return data.id;
}

// ─── Seed / Bulk ─────────────────────────────────────────────────────────────

export async function seedSessions(
  userId: string,
  sessions: Record<string, unknown>[],
) {
  for (const session of sessions) {
    await createSession({
      userId,
      ...session,
    });
  }
}
