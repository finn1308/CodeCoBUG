import { MasteryEngine, SkillMasteryRecord } from './masteryEngine';
import { SKILLS_TAXONOMY, EXERCISE_SKILLS_MAP } from './skillsTaxonomy';
import { SavedSubmissionRecord } from '../auth/authManager';
import { getExerciseBySlug } from '../fixtures/sampleCurriculum';

export interface ReviewItem {
  id: string;
  userId: string;
  exerciseSlug: string;
  exerciseTitle: string;
  targetSkillCode: string;
  targetSkillName: string;
  reason: 'failed_submission' | 'low_mastery' | 'periodic_review';
  reasonDescription: string;
  priority: 1 | 2 | 3; // 1: High (Immediate repair), 2: Medium, 3: Routine
  status: 'pending' | 'completed' | 'dismissed';
  createdAt: string;
  completedAt?: string;
}

const STORAGE_REVIEW_QUEUE_KEY = 'codecobug_review_queue';

const EXERCISE_TITLES_MAP: Record<string, string> = {
  'in-loi-chao-codecobug': 'In lời chào CodeCoBUG',
  'nhap-ten-va-tuoi': 'Nhập tên và tuổi',
  'hoan-doi-hai-bien': 'Hoán đổi hai biến',
  'swap-two-variables': 'Hoán đổi hai biến',
};

function resolveExerciseTitle(slug: string): string {
  const match = getExerciseBySlug(slug);
  return match?.exercise.title || EXERCISE_TITLES_MAP[slug] || slug;
}

function resolveExerciseSkill(slug: string): { code: string; name: string } {
  if (EXERCISE_SKILLS_MAP[slug] && EXERCISE_SKILLS_MAP[slug].length > 0) {
    const code = EXERCISE_SKILLS_MAP[slug][0];
    return { code, name: SKILLS_TAXONOMY[code]?.name || code };
  }
  const match = getExerciseBySlug(slug);
  if (match?.exercise.skillTags && match.exercise.skillTags.length > 0) {
    const tag = match.exercise.skillTags[0];
    return { code: tag, name: SKILLS_TAXONOMY[tag]?.name || tag.replace(/_/g, ' ') };
  }
  return { code: 'python_core', name: 'Kỹ năng Python cơ bản' };
}

export class ReviewEngine {
  /**
   * Generate or synchronize actionable review recommendations from submission evidence
   */
  public static syncReviewQueue(
    userId: string,
    submissions: SavedSubmissionRecord[]
  ): ReviewItem[] {
    const existingQueue = this.getStoredQueue(userId);
    const masteryReport = MasteryEngine.computeMastery(submissions);

    const updatedQueue: ReviewItem[] = [...existingQueue];

    // 1. Identify Failed Submissions -> Create High Priority Review Items
    const failedSubs = submissions.filter((s) => s.verdict !== 'accepted');
    for (const fail of failedSubs) {
      const alreadyQueued = updatedQueue.some(
        (q) => q.exerciseSlug === fail.exerciseSlug && q.status === 'pending'
      );

      // Check if user has subsequently solved it
      const hasSolvedLater = submissions.some(
        (s) =>
          s.exerciseSlug === fail.exerciseSlug &&
          s.verdict === 'accepted' &&
          new Date(s.submittedAt) > new Date(fail.submittedAt)
      );

      if (!alreadyQueued && !hasSolvedLater) {
        const skillInfo = resolveExerciseSkill(fail.exerciseSlug);

        updatedQueue.unshift({
          id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId,
          exerciseSlug: fail.exerciseSlug,
          exerciseTitle: resolveExerciseTitle(fail.exerciseSlug),
          targetSkillCode: skillInfo.code,
          targetSkillName: skillInfo.name,
          reason: 'failed_submission',
          reasonDescription: `Nộp bài chưa đạt (${fail.verdict.toUpperCase()}). Cần ôn tập và hoàn thiện.`,
          priority: 1,
          status: 'pending',
          createdAt: fail.submittedAt || new Date().toISOString(),
        });
      }
    }

    // 2. Identify Weak Skills -> Recommend Related Exercises
    const weakSkills = masteryReport.skills.filter((s) => s.status === 'weak');
    for (const weak of weakSkills) {
      for (const exSlug of weak.relatedExerciseSlugs) {
        const alreadyInQueue = updatedQueue.some(
          (q) => q.exerciseSlug === exSlug && q.status === 'pending'
        );

        if (!alreadyInQueue) {
          updatedQueue.push({
            id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            userId,
            exerciseSlug: exSlug,
            exerciseTitle: resolveExerciseTitle(exSlug),
            targetSkillCode: weak.skillCode,
            targetSkillName: weak.skillName,
            reason: 'low_mastery',
            reasonDescription: `Kỹ năng [${weak.skillName}] có mức thành thạo thấp (${weak.masteryScore}%). Đề xuất ôn luyện củng cố.`,
            priority: 2,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    // 3. Re-assessment: If user has passed an exercise or skill is no longer weak, mark review item as COMPLETED!
    for (const item of updatedQueue) {
      if (item.status === 'pending') {
        const latestForExercise = submissions
          .filter((s) => s.exerciseSlug === item.exerciseSlug)
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

        const hasPassedExercise = latestForExercise && latestForExercise.verdict === 'accepted';
        const targetSkill = masteryReport.skills.find((s) => s.skillCode === item.targetSkillCode);
        const skillRecovered = item.reason === 'low_mastery' && targetSkill && targetSkill.status !== 'weak';

        if (hasPassedExercise || skillRecovered) {
          item.status = 'completed';
          item.completedAt = new Date().toISOString();
        }
      }
    }

    this.saveQueue(userId, updatedQueue);
    return updatedQueue;
  }

  /**
   * Get pending actionable review items for learner
   */
  public static getPendingReviews(userId: string): ReviewItem[] {
    const queue = this.getStoredQueue(userId);
    return queue
      .filter((q) => q.status === 'pending')
      .sort((a, b) => a.priority - b.priority || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get completed review items for learner (Audit history)
   */
  public static getCompletedReviews(userId: string): ReviewItem[] {
    const queue = this.getStoredQueue(userId);
    return queue.filter((q) => q.status === 'completed');
  }

  private static getStoredQueue(userId: string): ReviewItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(`${STORAGE_REVIEW_QUEUE_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private static saveQueue(userId: string, queue: ReviewItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_REVIEW_QUEUE_KEY}_${userId}`, JSON.stringify(queue));
    } catch {
      // fallback
    }
  }
}
