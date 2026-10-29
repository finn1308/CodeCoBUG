import { SKILLS_TAXONOMY, EXERCISE_SKILLS_MAP, SkillDefinition } from './skillsTaxonomy';
import { ErrorClassifier, ErrorCategory } from './errorClassifier';
import { SavedSubmissionRecord } from '../auth/authManager';

export interface MasteryPolicyConfig {
  masteryThreshold: number; // Score to be considered Mastered (default: 80%)
  basePointsPerSuccess: number; // Base points awarded on accepted submission (default: 35)
  consecutiveBonus: number; // Multiplier bonus for consecutive streaks (default: 15)
  penaltyPerFailure: number; // Penalty deducted on failed submission (default: 20)
  minimumAttemptsRequired: number; // Minimum attempts before marking mastered (default: 1)
}

export const DEFAULT_MASTERY_POLICY: MasteryPolicyConfig = {
  masteryThreshold: 80,
  basePointsPerSuccess: 35,
  consecutiveBonus: 15,
  penaltyPerFailure: 20,
  minimumAttemptsRequired: 1,
};

export interface RecurringErrorStat {
  category: ErrorCategory;
  title: string;
  count: number;
  lastOccurred: string;
}

export interface SkillMasteryRecord {
  skillCode: string;
  skillName: string;
  category: string;
  description: string;
  masteryScore: number; // 0 to 100
  status: 'mastered' | 'in_progress' | 'weak' | 'untested';
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  consecutiveSuccesses: number;
  recurringErrors: RecurringErrorStat[];
  lastPracticedAt: string | null;
  relatedExerciseSlugs: string[];
}

export interface LearnerMasteryReport {
  overallMasteryPercentage: number;
  masteredCount: number;
  inProgressCount: number;
  weakCount: number;
  untestedCount: number;
  skills: SkillMasteryRecord[];
  recurringWeaknesses: RecurringErrorStat[];
  totalSubmissionsAnalyzed: number;
}

export class MasteryEngine {
  /**
   * Compute comprehensive skill mastery report for a user based on empirical submissions
   */
  public static computeMastery(
    submissions: SavedSubmissionRecord[],
    policy: MasteryPolicyConfig = DEFAULT_MASTERY_POLICY
  ): LearnerMasteryReport {
    // Sort submissions chronologically ascending (oldest to newest) to track progression
    const sorted = [...submissions].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );

    // Initialize map for all cataloged skills
    const masteryMap: Record<string, SkillMasteryRecord> = {};

    for (const [code, def] of Object.entries(SKILLS_TAXONOMY)) {
      // Find all exercises testing this skill
      const relatedSlugs = Object.entries(EXERCISE_SKILLS_MAP)
        .filter(([_, skills]) => skills.includes(code))
        .map(([slug]) => slug);

      masteryMap[code] = {
        skillCode: code,
        skillName: def.name,
        category: def.category,
        description: def.description,
        masteryScore: 0,
        status: 'untested',
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        consecutiveSuccesses: 0,
        recurringErrors: [],
        lastPracticedAt: null,
        relatedExerciseSlugs: relatedSlugs,
      };
    }

    // Process each empirical submission and attribute to tested skills
    for (const sub of sorted) {
      const testedSkillCodes = EXERCISE_SKILLS_MAP[sub.exerciseSlug] || ['python_print_syntax'];
      const isAccepted = sub.verdict === 'accepted';

      for (const skillCode of testedSkillCodes) {
        const record = masteryMap[skillCode];
        if (!record) continue;

        record.totalAttempts++;
        record.lastPracticedAt = sub.submittedAt;

        if (isAccepted) {
          record.successfulAttempts++;
          record.consecutiveSuccesses++;

          // Mastery progression formula with streak bonus
          const gain =
            policy.basePointsPerSuccess +
            Math.min(record.consecutiveSuccesses - 1, 3) * policy.consecutiveBonus;

          record.masteryScore = Math.min(100, record.masteryScore + gain);
        } else {
          record.failedAttempts++;
          record.consecutiveSuccesses = 0;

          // Penalty for failed submission
          record.masteryScore = Math.max(0, record.masteryScore - policy.penaltyPerFailure);

          // Classify failure error category
          const rawSignal =
            sub.errorDetails ||
            (sub.verdict === 'compile_error' ? 'RuleViolationError: ' + sub.verdict : undefined);
          const classified = ErrorClassifier.classify(
            rawSignal,
            sub.verdict
          );

          // Track recurring error categories
          const existingErr = record.recurringErrors.find(
            (e) => e.category === classified.category
          );

          if (existingErr) {
            existingErr.count++;
            existingErr.lastOccurred = sub.submittedAt;
          } else {
            record.recurringErrors.push({
              category: classified.category,
              title: classified.title,
              count: 1,
              lastOccurred: sub.submittedAt,
            });
          }
        }

        // Determine Mastery Status based on configurable policy
        if (record.totalAttempts === 0) {
          record.status = 'untested';
        } else if (
          record.masteryScore >= policy.masteryThreshold &&
          record.successfulAttempts >= policy.minimumAttemptsRequired
        ) {
          record.status = 'mastered';
        } else if (record.consecutiveSuccesses > 0 && record.masteryScore >= 30) {
          record.status = 'in_progress';
        } else if (record.failedAttempts >= 1 && (record.consecutiveSuccesses === 0 || record.masteryScore < 40)) {
          record.status = 'weak';
        } else {
          record.status = 'in_progress';
        }
      }
    }

    const skillRecords = Object.values(masteryMap);
    const masteredCount = skillRecords.filter((s) => s.status === 'mastered').length;
    const inProgressCount = skillRecords.filter((s) => s.status === 'in_progress').length;
    const weakCount = skillRecords.filter((s) => s.status === 'weak').length;
    const untestedCount = skillRecords.filter((s) => s.status === 'untested').length;

    // Aggregate recurring weaknesses across all skills (errors occurring >= 2 times)
    const errorAggregation: Record<string, RecurringErrorStat> = {};
    for (const s of skillRecords) {
      for (const err of s.recurringErrors) {
        if (!errorAggregation[err.category]) {
          errorAggregation[err.category] = { ...err };
        } else {
          errorAggregation[err.category].count += err.count;
          if (new Date(err.lastOccurred) > new Date(errorAggregation[err.category].lastOccurred)) {
            errorAggregation[err.category].lastOccurred = err.lastOccurred;
          }
        }
      }
    }

    const recurringWeaknesses = Object.values(errorAggregation)
      .filter((e) => e.count >= 2)
      .sort((a, b) => b.count - a.count);

    const totalCalculated = skillRecords.reduce((acc, s) => acc + s.masteryScore, 0);
    const overallMasteryPercentage =
      skillRecords.length > 0 ? Math.round(totalCalculated / skillRecords.length) : 0;

    return {
      overallMasteryPercentage,
      masteredCount,
      inProgressCount,
      weakCount,
      untestedCount,
      skills: skillRecords,
      recurringWeaknesses,
      totalSubmissionsAnalyzed: submissions.length,
    };
  }
}
