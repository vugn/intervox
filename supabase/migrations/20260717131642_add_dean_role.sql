-- 1. Update the role constraint to include 'dean'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'administrator', 'lecturer', 'dean'));

-- 2. Add Read-Only Policies for Dean across all relevant tables
-- We use get_user_role() which is defined as: SELECT role FROM users WHERE auth_id = auth.uid();

-- users table
CREATE POLICY "Dean read access to users" ON users 
  FOR SELECT USING (get_user_role() = 'dean');

-- student_profiles table
CREATE POLICY "Dean read access to student_profiles" ON student_profiles 
  FOR SELECT USING (get_user_role() = 'dean');

-- interview_sessions table
CREATE POLICY "Dean read access to interview_sessions" ON interview_sessions 
  FOR SELECT USING (get_user_role() = 'dean');

-- conversation_logs table
CREATE POLICY "Dean read access to conversation_logs" ON conversation_logs 
  FOR SELECT USING (get_user_role() = 'dean');

-- analysis_results table
CREATE POLICY "Dean read access to analysis_results" ON analysis_results 
  FOR SELECT USING (get_user_role() = 'dean');

-- ai_recommendations table
CREATE POLICY "Dean read access to ai_recommendations" ON ai_recommendations 
  FOR SELECT USING (get_user_role() = 'dean');

-- user_feedbacks table
CREATE POLICY "Dean read access to user_feedbacks" ON user_feedbacks 
  FOR SELECT USING (get_user_role() = 'dean');
