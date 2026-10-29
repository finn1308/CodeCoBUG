-- ==============================================================================
-- CodeCoBUG Database Schema Migration 002: Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable Row Level Security on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Curriculum Policies (Read-only for learners)
CREATE POLICY "Published courses are viewable by everyone" 
ON public.courses FOR SELECT USING (is_published = true);

CREATE POLICY "Published topics are viewable by everyone" 
ON public.topics FOR SELECT USING (is_published = true);

CREATE POLICY "Published lessons are viewable by everyone" 
ON public.lessons FOR SELECT USING (is_published = true);

CREATE POLICY "Published exercises are viewable by everyone" 
ON public.exercises FOR SELECT USING (is_published = true);

CREATE POLICY "Examples of published exercises are viewable by everyone" 
ON public.examples FOR SELECT USING (true);

-- 3. Test Cases Security Shield:
-- Ordinary clients CAN ONLY query public test cases!
-- Hidden tests (is_hidden = true) are inaccessible to client-side queries.
CREATE POLICY "Learners can only view public test cases" 
ON public.test_cases FOR SELECT USING (is_hidden = false);

-- 4. Submissions Isolation (Strict Multi-tenant User Isolation)
CREATE POLICY "Users can view own submissions only" 
ON public.submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions only" 
ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Test Results Isolation
CREATE POLICY "Users can view test results of own submissions" 
ON public.test_results FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions s 
        WHERE s.id = test_results.submission_id 
        AND s.user_id = auth.uid()
    )
);

-- 6. Skills & Mastery Isolation
CREATE POLICY "Skills taxonomy is viewable by everyone" 
ON public.skills FOR SELECT USING (true);

CREATE POLICY "Users can view and manage own skill mastery" 
ON public.skill_mastery FOR ALL USING (auth.uid() = user_id);

-- 7. AI Settings (BYOK Credential Isolation)
CREATE POLICY "Users can only view and manage own AI credentials" 
ON public.ai_settings FOR ALL USING (auth.uid() = user_id);
