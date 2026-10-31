/**
 * CodeCoBUG Auth & Persistence Manager
 * Provides user profile management, session persistence across reloads,
 * submission history, and strict multi-tenant data isolation.
 */

import { createSessionToken } from './sessionToken';
import { getExerciseFromRegistry } from '../curriculum/curriculumRegistry';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'learner' | 'instructor' | 'admin';
  points: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface SavedSubmissionTestCaseResult {
  orderIndex: number;
  inputData?: string;
  expectedOutput?: string;
  actualOutput?: string;
  isPassed: boolean;
  errorMessage?: string;
  executionTimeMs?: number;
  isHidden?: boolean;
}

export interface SavedSubmissionRecord {
  id: string;
  userId: string;
  exerciseSlug: string;
  submittedCode: string;
  verdict: string;
  score: number;
  totalPoints: number;
  passedTestsCount: number;
  totalTestsCount: number;
  executionTimeMs: number;
  submittedAt: string;
  errorDetails?: string;
  testCaseResults?: SavedSubmissionTestCaseResult[];
}

const STORAGE_SESSION_KEY = 'codecobug_active_session';
const STORAGE_TOKEN_KEY = 'codecobug_session_token';
const STORAGE_USERS_KEY = 'codecobug_users_db';
const STORAGE_SUBMISSIONS_KEY = 'codecobug_submissions_db';
const STORAGE_DRAFTS_KEY = 'codecobug_code_drafts';
const STORAGE_PBL_PROGRESS_KEY = 'codecobug_pbl_progress';
const STORAGE_LESSONS_PROGRESS_KEY = 'codecobug_lessons_progress';

// Demo initial user for instant onboarding
const INITIAL_DEFAULT_USER: UserProfile = {
  id: 'usr-default-001',
  email: 'learner@codecobug.dev',
  displayName: 'Học viên CodeCoBUG',
  role: 'learner',
  points: 0,
  createdAt: new Date().toISOString(),
};

class AuthPersistenceManager {
  private static instance: AuthPersistenceManager | null = null;
  private currentUser: UserProfile | null = null;
  private sessionToken: string | null = null;
  private listeners: Set<(user: UserProfile | null) => void> = new Set();

  public static getInstance(): AuthPersistenceManager {
    if (!AuthPersistenceManager.instance) {
      AuthPersistenceManager.instance = new AuthPersistenceManager();
    }
    return AuthPersistenceManager.instance;
  }

  public static resetInstance(): void {
    AuthPersistenceManager.instance = null;
  }

  public reloadSession(): void {
    this.restoreSession();
    this.notify();
  }

  constructor() {
    this.restoreSession();
  }

  public subscribe(listener: (user: UserProfile | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }

  // Restore session from localStorage on startup
  private restoreSession(): void {
    if (typeof window === 'undefined') return;

    try {
      const sessionData = localStorage.getItem(STORAGE_SESSION_KEY);
      if (sessionData) {
        this.currentUser = JSON.parse(sessionData);
      } else {
        // Automatically seed initial learner account if brand new
        this.currentUser = INITIAL_DEFAULT_USER;
        this.saveActiveSession(INITIAL_DEFAULT_USER);
        this.saveUserToRegistry(INITIAL_DEFAULT_USER, 'password123');
      }
      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      if (storedToken) {
        this.sessionToken = storedToken;
      } else if (this.currentUser) {
        this.sessionToken = createSessionToken(this.currentUser);
        localStorage.setItem(STORAGE_TOKEN_KEY, this.sessionToken);
      }
    } catch {
      this.currentUser = INITIAL_DEFAULT_USER;
      this.sessionToken = createSessionToken(INITIAL_DEFAULT_USER);
    }
  }

  private saveActiveSession(user: UserProfile | null): void {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      this.sessionToken = createSessionToken(user);
      localStorage.setItem(STORAGE_TOKEN_KEY, this.sessionToken);
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      this.sessionToken = null;
    }
  }

  public getSessionToken(): string | null {
    if (!this.sessionToken && this.currentUser) {
      this.sessionToken = createSessionToken(this.currentUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_TOKEN_KEY, this.sessionToken);
      }
    }
    return this.sessionToken;
  }

  private getUserRegistry(): Record<string, { profile: UserProfile; passwordHash: string }> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveUserToRegistry(user: UserProfile, password: string): void {
    if (typeof window === 'undefined') return;
    const registry = this.getUserRegistry();
    registry[user.email.toLowerCase()] = {
      profile: user,
      passwordHash: password, // In production Supabase this is managed by GoTrue bcrypt
    };
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(registry));
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Sign In
  public async signIn(email: string, password: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();
    const registry = this.getUserRegistry();
    const found = registry[trimmedEmail];

    if (!found || found.passwordHash !== password) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    this.currentUser = found.profile;
    this.saveActiveSession(found.profile);
    this.notify();
    return this.currentUser;
  }

  // Sign Up
  public async signUp(email: string, password: string, displayName: string): Promise<UserProfile> {
    const trimmedEmail = email.trim().toLowerCase();
    const registry = this.getUserRegistry();

    if (registry[trimmedEmail]) {
      throw new Error('Email này đã được đăng ký. Vui lòng chọn email khác.');
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: trimmedEmail,
      displayName: displayName.trim() || trimmedEmail.split('@')[0],
      role: 'learner',
      points: 0,
      createdAt: new Date().toISOString(),
    };

    this.saveUserToRegistry(newUser, password);
    this.currentUser = newUser;
    this.saveActiveSession(newUser);
    this.notify();
    return newUser;
  }

  // Sign Out
  public async signOut(): Promise<void> {
    this.currentUser = null;
    this.saveActiveSession(null);
    this.notify();
  }

  // Save Submission with User Attribution
  public async saveSubmission(record: Omit<SavedSubmissionRecord, 'id' | 'userId' | 'submittedAt'>): Promise<SavedSubmissionRecord> {
    if (!this.currentUser) {
      throw new Error('Bạn cần đăng nhập để lưu kết quả nộp bài.');
    }

    const newRecord: SavedSubmissionRecord = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: this.currentUser.id,
      submittedAt: new Date().toISOString(),
      ...record,
    };

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
        const list: SavedSubmissionRecord[] = raw ? JSON.parse(raw) : [];
        list.unshift(newRecord);
        localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));

        // If accepted, award points to user profile if not already completed
        if (record.verdict === 'accepted') {
          const userSubmissions = list.filter((s) => s.userId === this.currentUser?.id && s.exerciseSlug === record.exerciseSlug && s.verdict === 'accepted');
          // Only add points on first accepted submission
          if (userSubmissions.length <= 1) {
            this.currentUser.points += record.score;
            this.saveActiveSession(this.currentUser);
            // Update in registry
            const reg = this.getUserRegistry();
            if (reg[this.currentUser.email.toLowerCase()]) {
              reg[this.currentUser.email.toLowerCase()].profile = this.currentUser;
              localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(reg));
            }
            this.notify();
          }

          // Auto-sync Project-Based Learning checkpoint progress if accepted
          if (record.exerciseSlug.startsWith('ex-ai-')) {
            const chkNum = record.exerciseSlug.split('-')[2];
            const chkMap: Record<string, string> = {
              '01': 'khoi-tao-pygame-va-cai-dat-cua-so',
              '02': 'cau-truc-game-loop-va-clock',
              '03': 'xu-ly-su-kien-ban-phim-chuot',
              '04': 'tao-nhan-vat-phi-thuyen-ship',
              '05': 'xu-ly-dan-laser-va-sprite-groups',
              '06': 'ham-doi-quai-vat-alien-fleet',
              '07': 'quan-ly-va-cham-hitbox',
              '08': 'tinh-diem-va-trang-thai-game',
            };
            if (chkMap[chkNum]) {
              this.saveProjectCheckpoint('project-alien-invasion', chkMap[chkNum], true);
            }
          } else if (record.exerciseSlug.startsWith('ex-dv-')) {
            const chkNum = record.exerciseSlug.split('-')[2];
            const chkMap: Record<string, string> = {
              '01': 'gioi-thieu-du-lieu-va-cau-truc-du-lieu',
              '02': 'gioi-thieu-matplotlib-va-bieu-do-duong',
              '03': 'bieu-do-phan-tan-va-random-walk',
              '04': 'gioi-thieu-plotly-va-xac-suat-xuc-xac',
              '05': 'doc-va-phan-tich-csv-thoi-tiet',
              '06': 'truc-quan-hoa-geojson-dong-dat',
              '07': 'lam-viec-voi-web-rest-api',
              '08': 'du-an-truc-quan-hoa-hoan-chinh',
            };
            if (chkMap[chkNum]) {
              this.saveProjectCheckpoint('project-data-visualization', chkMap[chkNum], true);
            }
          } else if (record.exerciseSlug.startsWith('ex-web-')) {
            const chkNum = record.exerciseSlug.split('-')[2];
            const chkMap: Record<string, string> = {
              '01': 'gioi-thieu-django-va-khoi-tao-du-an',
              '02': 'mo-hinh-request-response-va-urls',
              '03': 'xay-dung-views-xu-ly-nghiep-vu',
              '04': 'django-templates-ke-thua',
              '05': 'database-va-django-models',
              '06': 'crud-voi-django-forms',
              '07': 'he-thong-authentication-dang-nhap',
              '08': 'phan-quyen-va-bao-mat-du-lieu',
              '09': 'kiem-thu-ung-dung-testing',
              '10': 'quy-chuan-deployment-dam-may',
            };
            if (chkMap[chkNum]) {
              this.saveProjectCheckpoint('project-django-web-app', chkMap[chkNum], true);
            }
          }

          // Auto-sync lesson progress
          try {
            const exMatch = getExerciseFromRegistry(record.exerciseSlug);
            if (exMatch && exMatch.lesson) {
              const lessonExercises = exMatch.lesson.exercises.map((e) => e.slug);
              const userAcceptedSlugs = new Set(
                list
                  .filter((s) => s.userId === this.currentUser?.id && s.verdict === 'accepted')
                  .map((s) => s.exerciseSlug)
              );
              const allLessonSolved = lessonExercises.length > 0 && lessonExercises.every((slug) => userAcceptedSlugs.has(slug));
              if (allLessonSolved) {
                this.saveLessonProgress(exMatch.lesson.slug, 'completed');
              } else {
                this.saveLessonProgress(exMatch.lesson.slug, 'in_progress');
              }
            }
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to save submission to localStorage:', err);
      }
    }

    return newRecord;
  }

  // Get Submissions for current user (Enforces strict user isolation)
  public getSubmissionsForExercise(exerciseSlug: string): SavedSubmissionRecord[] {
    if (!this.currentUser || typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      if (!raw) return [];
      const list: SavedSubmissionRecord[] = JSON.parse(raw);

      // STRICT MULTI-TENANT ISOLATION: User A can only see User A's submissions!
      return list.filter(
        (s) => s.userId === this.currentUser?.id && s.exerciseSlug === exerciseSlug
      );
    } catch {
      return [];
    }
  }

  // Get all submissions for current user across all exercises (Strict multi-tenant isolation)
  public getAllUserSubmissions(): SavedSubmissionRecord[] {
    if (!this.currentUser || typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
      if (!raw) return [];
      const list: SavedSubmissionRecord[] = JSON.parse(raw);

      return list.filter((s) => s.userId === this.currentUser?.id);
    } catch {
      return [];
    }
  }

  // Save Code Draft for Current User and Exercise
  public saveDraft(exerciseSlug: string, code: string): void {
    if (!this.currentUser || typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_DRAFTS_KEY);
      const drafts: Record<string, string> = raw ? JSON.parse(raw) : {};
      const key = `${this.currentUser.id}:${exerciseSlug}`;
      drafts[key] = code;
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(drafts));
    } catch {
      // fallback
    }
  }

  // Restore Code Draft for Current User and Exercise
  public getDraft(exerciseSlug: string): string | null {
    if (!this.currentUser || typeof window === 'undefined') return null;

    try {
      const raw = localStorage.getItem(STORAGE_DRAFTS_KEY);
      if (!raw) return null;
      const drafts: Record<string, string> = JSON.parse(raw);
      const key = `${this.currentUser.id}:${exerciseSlug}`;
      return drafts[key] || null;
    } catch {
      return null;
    }
  }

  // --- PROJECT-BASED LEARNING (PBL) CHECKPOINT PROGRESS PERSISTENCE ---

  public saveProjectCheckpoint(projectId: string, checkpointSlug: string, isCompleted: boolean): void {
    if (!this.currentUser || typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_PBL_PROGRESS_KEY);
      const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
      const key = `${this.currentUser.id}:${projectId}`;
      const currentList: string[] = map[key] || [];

      if (isCompleted) {
        if (!currentList.includes(checkpointSlug)) {
          currentList.push(checkpointSlug);
        }
      } else {
        const idx = currentList.indexOf(checkpointSlug);
        if (idx !== -1) currentList.splice(idx, 1);
      }

      map[key] = currentList;
      localStorage.setItem(STORAGE_PBL_PROGRESS_KEY, JSON.stringify(map));
      this.notify();
    } catch (err) {
      console.warn('Failed to save project checkpoint:', err);
    }
  }

  public getCompletedCheckpoints(projectId: string): string[] {
    if (!this.currentUser || typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_PBL_PROGRESS_KEY);
      if (!raw) return [];
      const map: Record<string, string[]> = JSON.parse(raw);
      const key = `${this.currentUser.id}:${projectId}`;
      return map[key] || [];
    } catch {
      return [];
    }
  }

  public isCheckpointCompleted(projectId: string, checkpointSlug: string): boolean {
    const list = this.getCompletedCheckpoints(projectId);
    return list.includes(checkpointSlug);
  }

  public getProjectProgress(
    projectId: string,
    totalCheckpoints: number
  ): { completedCount: number; percentage: number; isCompleted: boolean } {
    const list = this.getCompletedCheckpoints(projectId);
    const completedCount = list.length;
    const percentage = totalCheckpoints > 0 ? Math.round((completedCount / totalCheckpoints) * 100) : 0;
    return {
      completedCount,
      percentage,
      isCompleted: completedCount >= totalCheckpoints && totalCheckpoints > 0,
    };
  }

  // --- LESSON PROGRESS PERSISTENCE ---

  public saveLessonProgress(lessonSlug: string, status: 'in_progress' | 'completed'): void {
    if (!this.currentUser || typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(STORAGE_LESSONS_PROGRESS_KEY);
      const map: Record<string, Record<string, 'in_progress' | 'completed'>> = raw ? JSON.parse(raw) : {};
      const userMap = map[this.currentUser.id] || {};

      // Do not downgrade completed to in_progress
      if (userMap[lessonSlug] === 'completed' && status === 'in_progress') {
        return;
      }

      userMap[lessonSlug] = status;
      map[this.currentUser.id] = userMap;
      localStorage.setItem(STORAGE_LESSONS_PROGRESS_KEY, JSON.stringify(map));
      this.notify();
    } catch (err) {
      console.warn('Failed to save lesson progress:', err);
    }
  }

  public getLessonProgressMap(): Record<string, 'in_progress' | 'completed'> {
    if (!this.currentUser || typeof window === 'undefined') return {};

    try {
      const raw = localStorage.getItem(STORAGE_LESSONS_PROGRESS_KEY);
      if (!raw) return {};
      const map: Record<string, Record<string, 'in_progress' | 'completed'>> = JSON.parse(raw);
      return map[this.currentUser.id] || {};
    } catch {
      return {};
    }
  }

  public getLessonStatus(
    lessonSlug: string,
    lessonExerciseSlugs: string[] = []
  ): 'not_started' | 'in_progress' | 'completed' {
    if (!this.currentUser) return 'not_started';

    const progressMap = this.getLessonProgressMap();

    // If lesson has exercises, status is strictly derived from actual accepted submissions
    if (lessonExerciseSlugs.length > 0) {
      const userSubmissions = this.getAllUserSubmissions();
      const acceptedSlugs = new Set(
        userSubmissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
      );

      const allSolved = lessonExerciseSlugs.every((slug) => acceptedSlugs.has(slug));
      if (allSolved) {
        return 'completed';
      }

      const anySolved = lessonExerciseSlugs.some((slug) => acceptedSlugs.has(slug));
      if (anySolved) {
        return 'in_progress';
      }
    }

    return progressMap[lessonSlug] || 'not_started';
  }
}

export const authManager = AuthPersistenceManager.getInstance();
