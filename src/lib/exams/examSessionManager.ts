import { ExamSessionState, ExamSubmissionResult } from '../types/exam';

const STORAGE_ACTIVE_SESSION_KEY = 'codecobug_active_exam_session';
const STORAGE_EXAM_RESULTS_KEY = 'codecobug_exam_results_history';

// Server-side memory fallback
const serverSessionMap: Map<string, ExamSessionState> = new Map();
const serverResultsMap: Map<string, ExamSubmissionResult[]> = new Map();

export class ExamSessionManager {
  /**
   * Start a new exam session or recover an active, non-expired session
   */
  public static startOrResumeSession(
    userId: string,
    examId: string,
    examSlug: string,
    examTitle: string,
    durationMinutes: number
  ): ExamSessionState {
    const existing = this.getActiveSession(userId);

    // If existing session matches current exam and has not expired, resume it!
    if (existing && existing.examId === examId && !existing.isSubmitted) {
      const now = new Date().getTime();
      const expiry = new Date(existing.expiresAt).getTime();
      if (now < expiry) {
        return existing;
      }
    }

    // Otherwise create a fresh session
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const newSession: ExamSessionState = {
      sessionId: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      examId,
      examSlug,
      examTitle,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      answers: {},
      isSubmitted: false,
    };

    this.saveActiveSession(newSession);
    return newSession;
  }

  /**
   * Update user's in-progress answers (auto-saved on every selection)
   */
  public static saveAnswer(
    userId: string,
    questionId: string,
    selectedOptionId: string
  ): ExamSessionState | null {
    const session = this.getActiveSession(userId);
    if (!session || session.isSubmitted) return null;

    session.answers[questionId] = selectedOptionId;
    this.saveActiveSession(session);
    return session;
  }

  /**
   * Mark session as submitted and archive result
   */
  public static finalizeSession(
    userId: string,
    result: ExamSubmissionResult
  ): void {
    const session = this.getActiveSession(userId);
    if (session) {
      session.isSubmitted = true;
      session.submittedAt = result.submittedAt;
      this.saveActiveSession(session);
    }

    // Save result to history
    this.saveResultToHistory(userId, result);
    // Clear active session pointer
    this.clearActiveSession(userId);
  }

  public static getActiveSession(userId: string): ExamSessionState | null {
    if (typeof window === 'undefined') {
      return serverSessionMap.get(userId) || null;
    }
    try {
      const stored = localStorage.getItem(`${STORAGE_ACTIVE_SESSION_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  public static saveActiveSession(session: ExamSessionState): void {
    if (typeof window === 'undefined') {
      serverSessionMap.set(session.userId, session);
      return;
    }
    try {
      localStorage.setItem(`${STORAGE_ACTIVE_SESSION_KEY}_${session.userId}`, JSON.stringify(session));
    } catch (e) {
      console.warn('Failed to save active exam session:', e);
    }
  }

  public static clearActiveSession(userId: string): void {
    if (typeof window === 'undefined') {
      serverSessionMap.delete(userId);
      return;
    }
    try {
      localStorage.removeItem(`${STORAGE_ACTIVE_SESSION_KEY}_${userId}`);
    } catch {}
  }

  public static getUserResults(userId: string): ExamSubmissionResult[] {
    if (typeof window === 'undefined') {
      return serverResultsMap.get(userId) || [];
    }
    try {
      const stored = localStorage.getItem(`${STORAGE_EXAM_RESULTS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public static getResultById(userId: string, submissionId: string): ExamSubmissionResult | null {
    const history = this.getUserResults(userId);
    return history.find((r) => r.submissionId === submissionId) || null;
  }

  private static saveResultToHistory(userId: string, result: ExamSubmissionResult): void {
    const history = this.getUserResults(userId);
    const updated = [result, ...history];

    if (typeof window === 'undefined') {
      serverResultsMap.set(userId, updated);
      return;
    }
    try {
      localStorage.setItem(`${STORAGE_EXAM_RESULTS_KEY}_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save exam result history:', e);
    }
  }
}
