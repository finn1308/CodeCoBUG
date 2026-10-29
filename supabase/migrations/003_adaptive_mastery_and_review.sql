-- ==============================================================================
-- CodeCoBUG Database Schema Migration 003: Adaptive Review Queue & Exercise Skills
-- ==============================================================================

-- 1. Exercise Skills Mapping Table
CREATE TABLE IF NOT EXISTS public.exercise_skills (
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    weight INT NOT NULL DEFAULT 1,
    PRIMARY KEY (exercise_id, skill_id)
);

-- 2. Adaptive Review Queue Table
CREATE TABLE IF NOT EXISTS public.review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_slug TEXT NOT NULL,
    skill_code TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('failed_submission', 'periodic_review', 'prerequisite_weakness', 'low_mastery')),
    priority INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed')),
    due_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_review_queue_user_status ON public.review_queue(user_id, status, due_at);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.exercise_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercise skills are viewable by everyone"
ON public.exercise_skills FOR SELECT USING (true);

CREATE POLICY "Users can view and manage own review queue"
ON public.review_queue FOR ALL USING (auth.uid() = user_id);
