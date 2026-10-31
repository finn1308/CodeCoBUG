import { createServerSupabaseClient } from '../supabase/server';
import { createAdminSupabaseClient } from '../supabase/admin';
import { Verdict } from '../types/runtime';
import { getExerciseFromRegistry, getAllExercisesFromRegistry } from '../curriculum/curriculumRegistry';

export interface AuthoritativeSubmissionRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseSlug: string;
  submittedCode: string;
  verdict: Verdict;
  score: number;
  totalPoints: number;
  passedTestsCount: number;
  totalTestsCount: number;
  executionTimeMs: number;
  submittedAt: string;
  errorDetails?: string;
  completionState: 'completed' | 'in_progress';
  testResults: Array<{
    testCaseId: string;
    orderIndex: number;
    isPassed: boolean;
    inputData?: string;
    expectedOutput?: string;
    errorMessage?: string;
  }>;
}

// In-memory server fallback storage when running in local development mode without cloud Supabase
const memorySubmissionsStore: AuthoritativeSubmissionRecord[] = [];

export function clearMemorySubmissionsStore(): void {
  memorySubmissionsStore.length = 0;
}

/**
 * Persist submission to authoritative database (Supabase PostgreSQL with fallback to server store).
 * STRICT MULTI-TENANT RULE:
 * userId MUST be verified from the server authenticated session, NEVER from client body!
 */
export async function saveAuthoritativeSubmission(
  record: Omit<AuthoritativeSubmissionRecord, 'id' | 'submittedAt' | 'completionState'>
): Promise<AuthoritativeSubmissionRecord> {
  const isAccepted = record.verdict === 'accepted';
  const newSubmission: AuthoritativeSubmissionRecord = {
    ...record,
    id: `sub-auth-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    completionState: isAccepted ? 'completed' : 'in_progress',
  };

  // 1. Try Supabase Cloud persistence if configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    try {
      let supabaseClient;
      try {
        supabaseClient = createAdminSupabaseClient();
      } catch {
        supabaseClient = await createServerSupabaseClient();
      }

      const { data, error } = await supabaseClient
        .from('submissions')
        .insert({
          user_id: newSubmission.userId,
          exercise_id: newSubmission.exerciseId,
          submitted_code: newSubmission.submittedCode,
          verdict: newSubmission.verdict,
          score: newSubmission.score,
          passed_tests_count: newSubmission.passedTestsCount,
          total_tests_count: newSubmission.totalTestsCount,
          execution_time_ms: newSubmission.executionTimeMs,
          created_at: newSubmission.submittedAt,
        })
        .select()
        .single();

      if (!error && data) {
        newSubmission.id = data.id;

        // Also insert test_results
        if (newSubmission.testResults && newSubmission.testResults.length > 0) {
          const testResultsRows = newSubmission.testResults.map((tr) => ({
            submission_id: data.id,
            test_case_id: tr.testCaseId,
            is_passed: tr.isPassed,
            actual_output: tr.expectedOutput || null,
            error_message: tr.errorMessage || null,
          }));

          await supabaseClient.from('test_results').insert(testResultsRows);
        }
      }
    } catch (dbErr) {
      console.warn('[Supabase Cloud Submission Insert Failed, using local fallback]:', dbErr);
    }
  }

  // 2. Always persist into local authoritative server store
  memorySubmissionsStore.unshift(newSubmission);

  return newSubmission;
}

/**
 * Get authoritative submissions for a user with strict multi-tenant isolation.
 * User A CANNOT view User B's submissions!
 */
export async function getAuthoritativeSubmissions(
  userId: string,
  exerciseSlug?: string
): Promise<AuthoritativeSubmissionRecord[]> {
  if (!userId) return [];

  // 1. Try Supabase Cloud if active
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  ) {
    try {
      const supabase = await createServerSupabaseClient();
      let query = supabase
        .from('submissions')
        .select('*, test_results(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (exerciseSlug) {
        const meta = getExerciseFromRegistry(exerciseSlug);
        if (meta?.exercise?.id) {
          query = query.eq('exercise_id', meta.exercise.id);
        }
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const allExercises = getAllExercisesFromRegistry();
        const idToSlugMap = new Map(allExercises.map((e) => [e.exercise.id, e.exercise.slug]));
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          exerciseId: d.exercise_id,
          exerciseSlug: exerciseSlug || idToSlugMap.get(d.exercise_id) || '',
          submittedCode: d.submitted_code,
          verdict: d.verdict,
          score: d.score,
          totalPoints: 10,
          passedTestsCount: d.passed_tests_count,
          totalTestsCount: d.total_tests_count,
          executionTimeMs: d.execution_time_ms,
          submittedAt: d.created_at,
          completionState: d.verdict === 'accepted' ? 'completed' : 'in_progress',
          testResults: (d.test_results || []).map((tr: any) => ({
            testCaseId: tr.test_case_id,
            orderIndex: 0,
            isPassed: tr.is_passed,
            errorMessage: tr.error_message,
          })),
        }));
      }
    } catch {
      // fallback to memory
    }
  }

  // 2. Local authoritative server store
  return memorySubmissionsStore.filter((s) => {
    if (s.userId !== userId) return false;
    if (exerciseSlug && s.exerciseSlug !== exerciseSlug) return false;
    return true;
  });
}
