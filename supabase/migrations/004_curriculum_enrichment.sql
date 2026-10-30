-- ==============================================================================
-- CodeCoBUG Database Schema Migration 004: Curriculum Enrichment
-- Supports comprehensive structured lessons (W3Schools-aligned learning sequence)
-- and enhanced exercise metadata (skills, hints, learning outcomes)
-- ==============================================================================

-- 1. Topics Table Enhancements
ALTER TABLE public.topics 
    ADD COLUMN IF NOT EXISTS category TEXT,
    ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT 'mint';

-- 2. Lessons Table Enhancements
ALTER TABLE public.lessons 
    ADD COLUMN IF NOT EXISTS learning_objectives JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS prerequisites JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS examples JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS common_mistakes JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS guided_task JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS recap JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS reference_links JSONB DEFAULT '[]'::jsonb;

-- 3. Exercises Table Enhancements
ALTER TABLE public.exercises 
    ADD COLUMN IF NOT EXISTS skill_tags JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS learning_outcome TEXT,
    ADD COLUMN IF NOT EXISTS hints JSONB DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_exercises_topic ON public.exercises(topic_id);

