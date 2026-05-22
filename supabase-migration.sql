-- ============================================
-- Intervox Database Schema — Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor
-- ============================================

-- TABLE 1: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'lecturer', 'head_of_program')),
  phone VARCHAR(20),
  department VARCHAR(100),
  faculty VARCHAR(100),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: student_profiles
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university VARCHAR(120),
  major VARCHAR(100),
  graduation_year VARCHAR(10),
  target_industry VARCHAR(100),
  bio TEXT,
  cv_url TEXT,
  gpa DECIMAL(3,2),
  skills TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: interview_categories
CREATE TABLE interview_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  module_type VARCHAR(50),
  difficulty_level VARCHAR(20) DEFAULT 'medium'
    CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 4: question_banks
CREATE TABLE question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES interview_categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  ideal_keywords TEXT,
  difficulty_level VARCHAR(20) DEFAULT 'medium',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 5: scoring_criteria
CREATE TABLE scoring_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_name VARCHAR(100) NOT NULL,
  description TEXT,
  weight_score DECIMAL(5,2) DEFAULT 0,
  ideal_keywords TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 6: interview_sessions
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES interview_categories(id),
  module_type VARCHAR(50),
  role_target VARCHAR(100),
  company VARCHAR(100),
  language VARCHAR(30) DEFAULT 'Indonesian',
  personality VARCHAR(30),
  difficulty VARCHAR(20),
  status VARCHAR(20) DEFAULT 'in-progress'
    CHECK (status IN ('in-progress', 'analyzing', 'completed')),
  score DECIMAL(5,2),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  transcript JSONB DEFAULT '[]',
  analysis JSONB,
  self_assessment JSONB,
  expression_data JSONB,
  candidate_name VARCHAR(100),
  candidate_email VARCHAR(100),
  job_description TEXT,
  focus_areas TEXT,
  cv_url TEXT,
  education VARCHAR(50),
  years_experience VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 7: conversation_logs
CREATE TABLE conversation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_text TEXT,
  user_answer TEXT,
  answer_type VARCHAR(30),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 8: analysis_results
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  communication_score DECIMAL(5,2) DEFAULT 0,
  technical_score DECIMAL(5,2) DEFAULT 0,
  problem_solving_score DECIMAL(5,2) DEFAULT 0,
  culture_fit_score DECIMAL(5,2) DEFAULT 0,
  expression_score DECIMAL(5,2) DEFAULT 0,
  strengths JSONB DEFAULT '[]',
  weaknesses JSONB DEFAULT '[]',
  overall_feedback TEXT,
  confidence_level VARCHAR(20),
  expression_feedback TEXT,
  dominant_expression VARCHAR(30),
  analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 9: ai_recommendations
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  priority INT DEFAULT 1,
  recommendation_type VARCHAR(50) DEFAULT 'improvement',
  recommendation_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 10: user_feedbacks
CREATE TABLE user_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES interview_sessions(id) ON DELETE SET NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_sessions_user ON interview_sessions(user_id);
CREATE INDEX idx_sessions_status ON interview_sessions(status);
CREATE INDEX idx_sessions_created ON interview_sessions(created_at DESC);
CREATE INDEX idx_logs_session ON conversation_logs(session_id);
CREATE INDEX idx_analysis_session ON analysis_results(session_id);
CREATE INDEX idx_recommendations_session ON ai_recommendations(session_id);
CREATE INDEX idx_questions_category ON question_banks(category_id);
CREATE INDEX idx_feedbacks_user ON user_feedbacks(user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_criteria ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "Users view own or staff views all" ON users
  FOR SELECT USING (auth_id = auth.uid() OR get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Users update own" ON users
  FOR UPDATE USING (auth_id = auth.uid() OR get_user_role() = 'head_of_program');
CREATE POLICY "Users insert own" ON users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

-- student_profiles
CREATE POLICY "Profile select" ON student_profiles
  FOR SELECT USING (user_id = get_user_id() OR get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Profile insert" ON student_profiles
  FOR INSERT WITH CHECK (user_id = get_user_id());
CREATE POLICY "Profile update" ON student_profiles
  FOR UPDATE USING (user_id = get_user_id());

-- interview_sessions
CREATE POLICY "Session select" ON interview_sessions
  FOR SELECT USING (user_id = get_user_id() OR get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Session insert" ON interview_sessions
  FOR INSERT WITH CHECK (user_id = get_user_id());
CREATE POLICY "Session update" ON interview_sessions
  FOR UPDATE USING (user_id = get_user_id() OR get_user_role() IN ('lecturer', 'head_of_program'));

-- reference data
CREATE POLICY "Read categories" ON interview_categories FOR SELECT USING (true);
CREATE POLICY "Manage categories" ON interview_categories
  FOR INSERT WITH CHECK (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Update categories" ON interview_categories
  FOR UPDATE USING (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Delete categories" ON interview_categories
  FOR DELETE USING (get_user_role() IN ('lecturer', 'head_of_program'));

CREATE POLICY "Read questions" ON question_banks FOR SELECT USING (true);
CREATE POLICY "Manage questions" ON question_banks
  FOR INSERT WITH CHECK (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Update questions" ON question_banks
  FOR UPDATE USING (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Delete questions" ON question_banks
  FOR DELETE USING (get_user_role() IN ('lecturer', 'head_of_program'));

CREATE POLICY "Read criteria" ON scoring_criteria FOR SELECT USING (true);
CREATE POLICY "Manage criteria" ON scoring_criteria
  FOR INSERT WITH CHECK (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Update criteria" ON scoring_criteria
  FOR UPDATE USING (get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Delete criteria" ON scoring_criteria
  FOR DELETE USING (get_user_role() IN ('lecturer', 'head_of_program'));

-- conversation_logs
CREATE POLICY "Read own logs" ON conversation_logs
  FOR SELECT USING (
    session_id IN (SELECT id FROM interview_sessions WHERE user_id = get_user_id())
    OR get_user_role() IN ('lecturer', 'head_of_program')
  );
CREATE POLICY "Insert logs" ON conversation_logs FOR INSERT WITH CHECK (true);

-- analysis_results
CREATE POLICY "Read own analysis" ON analysis_results
  FOR SELECT USING (
    session_id IN (SELECT id FROM interview_sessions WHERE user_id = get_user_id())
    OR get_user_role() IN ('lecturer', 'head_of_program')
  );
CREATE POLICY "Insert analysis" ON analysis_results FOR INSERT WITH CHECK (true);

-- ai_recommendations
CREATE POLICY "Read own recs" ON ai_recommendations
  FOR SELECT USING (
    session_id IN (SELECT id FROM interview_sessions WHERE user_id = get_user_id())
    OR get_user_role() IN ('lecturer', 'head_of_program')
  );
CREATE POLICY "Insert recs" ON ai_recommendations FOR INSERT WITH CHECK (true);

-- user_feedbacks
CREATE POLICY "Read own feedback" ON user_feedbacks
  FOR SELECT USING (user_id = get_user_id() OR get_user_role() IN ('lecturer', 'head_of_program'));
CREATE POLICY "Insert own feedback" ON user_feedbacks
  FOR INSERT WITH CHECK (user_id = get_user_id());

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('cv', 'cv', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated upload cv" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cv' AND auth.role() = 'authenticated');
CREATE POLICY "Public read cv" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv');
