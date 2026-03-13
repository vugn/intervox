import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

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
  category?: string;
  questionText?: string;
  question?: string;
  idealKeywords?: string;
  difficultyLevel?: string;
  difficulty?: string;
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

function cleanUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

export async function getUserByUid(uid: string) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const profileRef = doc(db, "student_profiles", uid);
  const profileSnap = await getDoc(profileRef);

  const userData = userSnap.data();
  const profileData = profileSnap.exists() ? profileSnap.data() : {};

  return {
    ...userData,
    ...profileData,
    uid,
    displayName:
      (userData.fullName as string) || (profileData.fullName as string) || null,
    photoURL: null,
  };
}

export async function upsertUser(uid: string, data: Record<string, unknown>) {
  const userRef = doc(db, "users", uid);
  const userPayload = cleanUndefined({
    email: data.email,
    role: data.role ?? "student",
    fullName: data.displayName ?? data.fullName,
    phone: data.phone,
    department: data.department,
    faculty: data.faculty,
    updatedAt: data.updatedAt ?? new Date().toISOString(),
    createdAt: data.createdAt ?? new Date().toISOString(),
  });

  await setDoc(userRef, userPayload, { merge: true });

  const profilePayload = cleanUndefined({
    userId: uid,
    fullName: data.displayName ?? data.fullName,
    gpa: data.gpa,
    major: data.major,
    skills: data.skills,
    cvPath: data.cvPath,
    phone: data.phone,
    university: data.university,
    graduationYear: data.graduationYear,
    targetIndustry: data.targetIndustry,
    bio: data.bio,
    updatedAt: data.updatedAt ?? new Date().toISOString(),
    createdAt: data.createdAt ?? new Date().toISOString(),
  });

  const hasProfileData = Object.keys(profilePayload).some(
    (k) => !["userId", "updatedAt", "createdAt"].includes(k),
  );

  if (hasProfileData) {
    const profileRef = doc(db, "student_profiles", uid);
    await setDoc(profileRef, profilePayload, { merge: true });
  }
}

export async function createSession(data: Record<string, unknown>) {
  const payload = cleanUndefined({
    userId: data.userId,
    categoryId: data.categoryId ?? data.moduleCategory,
    moduleType: data.moduleType ?? data.interviewType,
    roleTarget: data.jobRole,
    language: data.language,
    personality: data.personality,
    difficulty: data.difficulty,
    status: data.status ?? "in-progress",
    totalScore: data.score,
    score: data.score,
    startTime: data.startedAt ?? new Date().toISOString(),
    endTime: data.completedAt,
    transcript: data.transcript,
    analysis: data.analysis,
    selfAssessment: data.selfAssessment,
    candidateName: data.candidateName,
    candidateEmail: data.candidateEmail,
    company: data.company,
    yearsExperience: data.yearsExperience,
    education: data.education,
    jobDescription: data.jobDescription,
    focusAreas: data.focusAreas,
    cvUrl: data.cvUrl,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  });

  const ref = await addDoc(collection(db, "interview_sessions"), payload);
  return ref.id;
}

export async function updateSession(
  sessionId: string,
  data: Record<string, unknown>,
) {
  const sessionRef = doc(db, "interview_sessions", sessionId);
  const updatePayload = cleanUndefined({
    categoryId: data.categoryId,
    moduleType: data.moduleType,
    roleTarget: data.jobRole,
    language: data.language,
    personality: data.personality,
    difficulty: data.difficulty,
    status: data.status,
    totalScore: data.score,
    score: data.score,
    startTime: data.startedAt,
    endTime: data.completedAt,
    transcript: data.transcript,
    analysis: data.analysis,
    selfAssessment: data.selfAssessment,
    updatedAt: new Date().toISOString(),
  });
  await updateDoc(sessionRef, updatePayload);
}

export async function getSessionById(sessionId: string) {
  const sessionRef = doc(db, "interview_sessions", sessionId);
  const snap = await getDoc(sessionRef);

  if (!snap.exists()) {
    const legacyRef = doc(db, "sessions", sessionId);
    const legacySnap = await getDoc(legacyRef);
    if (!legacySnap.exists()) return null;
    return { id: legacySnap.id, ...legacySnap.data() };
  }

  const session = snap.data();
  return {
    id: snap.id,
    ...session,
    jobRole: session.roleTarget ?? session.jobRole,
    score: session.score ?? session.totalScore,
    createdAt: session.createdAt,
    completedAt: session.endTime ?? session.completedAt,
    startedAt: session.startTime ?? session.startedAt,
  };
}

export async function listSessionsByUser(userId: string) {
  const q = query(
    collection(db, "interview_sessions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);

  const rows = snap.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      ...data,
      jobRole: data.roleTarget ?? data.jobRole,
      score: data.score ?? data.totalScore,
    };
  });

  if (rows.length > 0) return rows;

  const legacyQ = query(
    collection(db, "sessions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const legacySnap = await getDocs(legacyQ);
  return legacySnap.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function listAllSessions() {
  const q = query(
    collection(db, "interview_sessions"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      ...data,
      jobRole: data.roleTarget ?? data.jobRole,
      score: data.score ?? data.totalScore,
    };
  });
}

export async function seedSessions(
  userId: string,
  sessions: Record<string, unknown>[],
) {
  for (const session of sessions) {
    await addDoc(collection(db, "interview_sessions"), {
      userId,
      categoryId: session.categoryId ?? session.moduleType ?? null,
      moduleType: session.moduleType ?? null,
      roleTarget: session.roleTarget ?? session.jobRole ?? null,
      language: session.language ?? null,
      personality: session.personality ?? null,
      difficulty: session.difficulty ?? null,
      status: session.status ?? "completed",
      score: session.score ?? session.totalScore ?? null,
      totalScore: session.totalScore ?? session.score ?? null,
      analysis: session.analysis ?? null,
      transcript: session.transcript ?? null,
      selfAssessment: session.selfAssessment ?? null,
      startTime: session.startTime ?? session.startedAt ?? null,
      endTime: session.endTime ?? session.completedAt ?? null,
      createdAt: session.createdAt ?? new Date().toISOString(),
      updatedAt: session.updatedAt ?? new Date().toISOString(),
    });
  }
}

export async function listCategories(): Promise<CategoryItem[]> {
  const q = query(
    collection(db, "interview_categories"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<CategoryItem, "id">),
  }));
}

export async function createCategory(input: Omit<CategoryItem, "id">) {
  const ref = await addDoc(collection(db, "interview_categories"), {
    ...cleanUndefined(input),
    isActive: input.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return {
    id: ref.id,
    ...input,
    isActive: input.isActive ?? true,
  } as CategoryItem;
}

export async function updateCategory(id: string, input: Partial<CategoryItem>) {
  const ref = doc(db, "interview_categories", id);
  await updateDoc(ref, {
    ...cleanUndefined(input),
    updatedAt: new Date().toISOString(),
  });
  const snap = await getDoc(ref);
  return { id: snap.id, ...(snap.data() as Omit<CategoryItem, "id">) };
}

export async function listQuestionsByCategory(categoryId: string) {
  const q = query(
    collection(db, "question_banks"),
    where("categoryId", "==", categoryId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<QuestionItem, "id">),
  }));
}

export async function createQuestion(input: {
  categoryId: string;
  questionText: string;
  idealKeywords?: string;
  expectedAnswer?: string;
  difficultyLevel?: string;
  createdBy?: string;
}) {
  const ref = await addDoc(collection(db, "question_banks"), {
    ...cleanUndefined(input),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return {
    id: ref.id,
    ...input,
  };
}

export async function listScoringCriteria() {
  const q = query(
    collection(db, "scoring_criteria"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<ScoringCriteriaItem, "id">),
  }));
}

export async function createScoringCriteria(
  input: Omit<ScoringCriteriaItem, "id">,
) {
  const ref = await addDoc(collection(db, "scoring_criteria"), {
    ...cleanUndefined(input),
    isActive: input.isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return {
    id: ref.id,
    ...input,
    isActive: input.isActive ?? true,
  };
}

export async function listLecturers(): Promise<LecturerItem[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "lecturer"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((document) => ({
    id: document.id,
    fullName: (document.data().fullName as string) || "-",
    email: (document.data().email as string) || "-",
    phone: document.data().phone as string | undefined,
    department: document.data().department as string | undefined,
    faculty: document.data().faculty as string | undefined,
  }));
}

export async function createLecturer(input: Omit<LecturerItem, "id">) {
  const ref = await addDoc(collection(db, "users"), {
    ...cleanUndefined(input),
    role: "lecturer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: ref.id, ...input };
}

export async function getConversationBySession(sessionId: string) {
  const q = query(
    collection(db, "conversation_logs"),
    where("sessionId", "==", sessionId),
    orderBy("timestamp", "asc"),
  );
  const snap = await getDocs(q);
  const rows = snap.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  if (rows.length > 0) return rows;

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

export async function getAnalysisBySession(sessionId: string) {
  const q = query(
    collection(db, "analysis_results"),
    where("sessionId", "==", sessionId),
    orderBy("analyzedAt", "desc"),
  );
  const snap = await getDocs(q);
  const rows = snap.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  if (rows.length > 0) return rows;

  const session = await getSessionById(sessionId);
  const analysis = (session as any)?.analysis;
  if (!analysis) return [];

  return [
    {
      id: `analysis-${sessionId}`,
      relevanceScore: analysis.scores?.communication ?? null,
      grammarScore: analysis.scores?.technical ?? null,
      sentiment: "neutral",
      communicationScore: analysis.scores?.communication,
      technicalScore: analysis.scores?.technical,
      problemSolvingScore: analysis.scores?.problemSolving,
      cultureFitScore: analysis.scores?.cultureFit,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      overallFeedback: analysis.overallFeedback,
    },
  ];
}

export async function getRecommendationsBySession(sessionId: string) {
  const q = query(
    collection(db, "ai_recommendations"),
    where("sessionId", "==", sessionId),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  const rows = snap.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  if (rows.length > 0) return rows;

  const analysisRows = await getAnalysisBySession(sessionId);
  if (!analysisRows[0]) return [];

  const weaknesses = Array.isArray((analysisRows[0] as any).weaknesses)
    ? ((analysisRows[0] as any).weaknesses as string[])
    : [];
  return weaknesses.map((weakness, idx) => ({
    id: `rec-${idx}`,
    recommendationText: `Perbaiki area berikut: ${weakness}`,
    recommendationType: "improvement",
    priority: idx + 1,
  }));
}
