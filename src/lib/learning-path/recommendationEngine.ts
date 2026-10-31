import {
  PersonalizedPathState,
  LearningGoalType,
  LearningPace,
  DiagnosticResult,
  PathStage,
} from '../types/learningPath';
import { DIAGNOSTIC_QUESTIONS } from './diagnosticQuestions';
import { buildPathStages, PATH_STAGE_DEFINITIONS } from './stageDefinitions';
import { SavedSubmissionRecord } from '../auth/authManager';
import { ReviewItem, ReviewEngine } from '../mastery/reviewEngine';
import { MasteryEngine, LearnerMasteryReport } from '../mastery/masteryEngine';
import { getExerciseFromRegistry, OFFICIAL_PYTHON_COURSE } from '../curriculum/curriculumRegistry';

export class PathRecommendationEngine {
  /**
   * Evaluate diagnostic quiz results and determine initial skill level & eligible skipped stages
   */
  public static evaluateDiagnostic(answers: Record<string, string>): DiagnosticResult {
    let correctCount = 0;
    const stageCorrectMap: Record<number, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
      4: { correct: 0, total: 0 },
    };

    for (const q of DIAGNOSTIC_QUESTIONS) {
      const weight = q.stageWeight;
      stageCorrectMap[weight].total++;
      if (answers[q.id] === q.correctOptionId) {
        correctCount++;
        stageCorrectMap[weight].correct++;
      }
    }

    const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    let assessedLevel: DiagnosticResult['assessedLevel'] = 'beginner';
    if (score >= 85) assessedLevel = 'advanced';
    else if (score >= 60) assessedLevel = 'intermediate';
    else if (score >= 35) assessedLevel = 'elementary';

    // A stage can be skipped if student got 100% of questions in that stage correct
    // and all preceding stages were also mastered
    const skippedStages: number[] = [];
    if (stageCorrectMap[1].correct === stageCorrectMap[1].total && stageCorrectMap[1].total > 0) {
      skippedStages.push(1);
      if (stageCorrectMap[2].correct === stageCorrectMap[2].total && stageCorrectMap[2].total > 0) {
        skippedStages.push(2);
        if (stageCorrectMap[3].correct === stageCorrectMap[3].total && stageCorrectMap[3].total > 0) {
          skippedStages.push(3);
        }
      }
    }

    return {
      completedAt: new Date().toISOString(),
      score,
      totalQuestions,
      correctCount,
      assessedLevel,
      answers,
      skippedStages,
    };
  }

  /**
   * Deterministic Rule-Based Recommendation Algorithm
   * 1. Priority 1: High priority repair from Adaptive Review Queue (failed tests)
   * 2. Priority 2: In-progress stage with lowest uncompleted exercise adhering to prerequisite order
   * 3. Priority 3: Goal-adjusted recommendations:
   *    - 'prepare_projects': Fast-tracks toward OOP, File I/O, and data structure milestones
   *    - 'practice_mastery': Focuses on challenge/medium exercises
   *    - 'reinforce_basics': Reinforces unmastered skills from MasteryEngine report
   *    - 'start_from_scratch': Sequential linear progression from Chapter 1
   */
  public static recommendNextExercise(
    stages: PathStage[],
    submissions: SavedSubmissionRecord[],
    reviewQueue: ReviewItem[],
    goal: LearningGoalType,
    masteryReport: LearnerMasteryReport | null
  ): PersonalizedPathState['recommendedNextExercise'] {
    // 1. High Priority Repair Check from Review Queue
    const activeReview = reviewQueue.find((r) => r.status === 'pending');
    if (activeReview) {
      const match = getExerciseFromRegistry(activeReview.exerciseSlug);
      return {
        slug: activeReview.exerciseSlug,
        title: activeReview.exerciseTitle,
        chapterTitle: match?.topic.title || 'Ôn tập lỗi sai',
        reason: `Cần ôn tập gấp: ${activeReview.reasonDescription || 'Bạn từng gặp lỗi kiểm thử ở bài này.'}`,
        difficulty: match?.exercise.difficulty || 'medium',
        isReview: true,
      };
    }

    // 2. Weakness repair from MasteryEngine if any weak skill exists
    if (masteryReport && masteryReport.weakCount > 0 && goal === 'reinforce_basics') {
      const weakestSkill = masteryReport.skills.find((s) => s.status === 'weak');
      if (weakestSkill && weakestSkill.relatedExerciseSlugs.length > 0) {
        const acceptedSlugs = new Set(
          submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
        );
        const uncompletedWeakSlug = weakestSkill.relatedExerciseSlugs.find(
          (slug) => !acceptedSlugs.has(slug)
        );
        if (uncompletedWeakSlug) {
          const match = getExerciseFromRegistry(uncompletedWeakSlug);
          if (match) {
            return {
              slug: match.exercise.slug,
              title: match.exercise.title,
              chapterTitle: match.topic.title,
              reason: `Củng cố kỹ năng "${weakestSkill.skillName}" (Điểm kỹ năng hiện tại: ${weakestSkill.masteryScore}%)`,
              difficulty: match.exercise.difficulty,
              isReview: true,
            };
          }
        }
      }
    }

    // 3. Goal: Prepare Projects - check readiness for projects
    if (goal === 'prepare_projects') {
      // Find milestone exercises in Stage 2, 3, 4
      const acceptedSlugs = new Set(
        submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
      );
      for (const stage of stages) {
        if (stage.skipped) continue;
        const milestone = stage.exercises.find((e) => e.isKeyMilestone && !acceptedSlugs.has(e.slug));
        if (milestone) {
          const match = getExerciseFromRegistry(milestone.slug);
          return {
            slug: milestone.slug,
            title: milestone.title,
            chapterTitle: match?.topic.title || stage.title,
            reason: `Bài tập trọng điểm để mở khóa Dự án thực chiến (${stage.title})`,
            difficulty: milestone.difficulty,
          };
        }
      }
    }

    // 4. Standard Sequential Progression along stages
    const acceptedSlugs = new Set(
      submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
    );

    for (const stage of stages) {
      if (stage.skipped || stage.status === 'mastered') continue;

      // Find first uncompleted exercise in this stage
      const nextUncompleted = stage.exercises.find((e) => !acceptedSlugs.has(e.slug));
      if (nextUncompleted) {
        const match = getExerciseFromRegistry(nextUncompleted.slug);
        return {
          slug: nextUncompleted.slug,
          title: nextUncompleted.title,
          chapterTitle: match?.topic.title || stage.title,
          reason: `Bài học kế tiếp trong ${stage.title}`,
          difficulty: nextUncompleted.difficulty,
        };
      }
    }

    // If everything is completed, return first challenge or null
    return null;
  }

  /**
   * Generate complete personalized path state for a user
   */
  public static generatePathState(
    userId: string,
    goal: LearningGoalType = 'start_from_scratch',
    pace: LearningPace = 'standard',
    diagnostic: DiagnosticResult | null = null,
    submissions: SavedSubmissionRecord[] = [],
    reviewQueue: ReviewItem[] = [],
    masteryReport: LearnerMasteryReport | null = null
  ): PersonalizedPathState {
    const skippedStages = diagnostic?.skippedStages || [];
    const stages = buildPathStages(submissions, skippedStages, reviewQueue, masteryReport);
    const recommendedNextExercise = this.recommendNextExercise(
      stages,
      submissions,
      reviewQueue,
      goal,
      masteryReport
    );

    return {
      userId,
      goal,
      pace,
      diagnostic,
      stages,
      recommendedNextExercise,
      updatedAt: new Date().toISOString(),
    };
  }
}

