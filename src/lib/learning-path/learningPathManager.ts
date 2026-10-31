import { PersonalizedPathState, LearningGoalType, LearningPace, DiagnosticResult } from '../types/learningPath';
import { PathRecommendationEngine } from './recommendationEngine';
import { authManager } from '../auth/authManager';
import { ReviewEngine } from '../mastery/reviewEngine';
import { MasteryEngine } from '../mastery/masteryEngine';

const STORAGE_PATH_STATE_KEY = 'codecobug_personalized_path';

export class LearningPathManager {
  /**
   * Get current persisted path state for a user, or generate an initial one
   */
  public static getPathState(userId?: string): PersonalizedPathState {
    const activeUserId = userId || authManager.getCurrentUser()?.id || 'usr-default-001';

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`${STORAGE_PATH_STATE_KEY}_${activeUserId}`);
        if (stored) {
          const parsed: PersonalizedPathState = JSON.parse(stored);
          // Sync with latest submissions and review queue
          return this.syncWithLatestData(parsed);
        }
      } catch (err) {
        console.warn('Failed to parse stored learning path:', err);
      }
    }

    // Default initial generation
    const submissions = authManager.getAllUserSubmissions();
    const reviews = ReviewEngine.getStoredQueue(activeUserId);
    const masteryReport = MasteryEngine.computeMastery(submissions);

    const fresh = PathRecommendationEngine.generatePathState(
      activeUserId,
      'start_from_scratch',
      'standard',
      null,
      submissions,
      reviews,
      masteryReport
    );

    this.savePathState(fresh);
    return fresh;
  }

  /**
   * Persist path state to LocalStorage
   */
  public static savePathState(state: PersonalizedPathState): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          `${STORAGE_PATH_STATE_KEY}_${state.userId}`,
          JSON.stringify(state)
        );
      } catch (err) {
        console.error('Failed to save learning path to localStorage:', err);
      }
    }
  }

  /**
   * Update goal or pace preferences and recompute recommendations
   */
  public static updatePreferences(
    userId: string,
    goal: LearningGoalType,
    pace: LearningPace
  ): PersonalizedPathState {
    const current = this.getPathState(userId);
    current.goal = goal;
    current.pace = pace;
    return this.syncWithLatestData(current);
  }

  /**
   * Apply diagnostic assessment result and unlock eligible stages
   */
  public static applyDiagnostic(
    userId: string,
    diagnostic: DiagnosticResult
  ): PersonalizedPathState {
    const current = this.getPathState(userId);
    current.diagnostic = diagnostic;
    return this.syncWithLatestData(current);
  }

  /**
   * Skip a specific stage manually after passing a stage assessment
   */
  public static skipStage(userId: string, stageNumber: number): PersonalizedPathState {
    const current = this.getPathState(userId);
    const existingSkipped = current.diagnostic?.skippedStages || [];
    if (!existingSkipped.includes(stageNumber)) {
      const updatedSkipped = [...existingSkipped, stageNumber];
      if (!current.diagnostic) {
        current.diagnostic = {
          completedAt: new Date().toISOString(),
          score: 100,
          totalQuestions: 0,
          correctCount: 0,
          assessedLevel: 'intermediate',
          answers: {},
          skippedStages: updatedSkipped,
        };
      } else {
        current.diagnostic.skippedStages = updatedSkipped;
      }
    }
    return this.syncWithLatestData(current);
  }

  /**
   * Reset path state (e.g. to retake diagnostic test)
   */
  public static resetPath(userId: string): PersonalizedPathState {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${STORAGE_PATH_STATE_KEY}_${userId}`);
    }
    return this.getPathState(userId);
  }

  /**
   * Synchronize an existing state with authoritative real-time submissions & review queue
   */
  public static syncWithLatestData(state: PersonalizedPathState): PersonalizedPathState {
    const submissions = authManager.getAllUserSubmissions();
    const reviews = ReviewEngine.getStoredQueue(state.userId);
    const masteryReport = MasteryEngine.computeMastery(submissions);

    const recomputed = PathRecommendationEngine.generatePathState(
      state.userId,
      state.goal,
      state.pace,
      state.diagnostic,
      submissions,
      reviews,
      masteryReport
    );

    this.savePathState(recomputed);
    return recomputed;
  }
}

