import {
  ExamDefinition,
  ExamQuestion,
  ExamSessionState,
  ExamSubmissionResult,
  TopicScoreBreakdown,
} from '../types/exam';
import { EXAM_QUESTION_BANK } from './questionBank';
import { OFFICIAL_PYTHON_COURSE } from '../curriculum/curriculumRegistry';
import { ReviewEngine } from '../mastery/reviewEngine';

export class ExamEngine {
  /**
   * Get sanitized questions for a test session (Hides correct answers & explanations to prevent leaks)
   */
  public static getSanitizedQuestionsForExam(
    exam: ExamDefinition,
    shuffleOptions = true
  ): Array<Omit<ExamQuestion, 'correctOptionId' | 'explanation'>> {
    const rawQuestions = exam.questionIds
      .map((id) => EXAM_QUESTION_BANK.find((q) => q.id === id))
      .filter((q): q is ExamQuestion => !!q);

    return rawQuestions.map((q) => {
      let options = [...q.options];
      // Deterministic option shuffle or order preservation
      if (shuffleOptions) {
        // Keep option IDs consistent but present orderly
        options = [...options].sort((a, b) => a.id.localeCompare(b.id));
      }

      return {
        id: q.id,
        topicSlug: q.topicSlug,
        chapterOrderIndex: q.chapterOrderIndex,
        format: q.format,
        prompt: q.prompt,
        codeSnippet: q.codeSnippet,
        options,
        testedSkillCode: q.testedSkillCode,
        testedSkillName: q.testedSkillName,
        points: q.points,
      };
    });
  }

  /**
   * Authoritative grading of submitted answers against the protected question bank.
   * STRICT SECURITY:
   * 1. Evaluates completely against backend questionBank data.
   * 2. Calculates topic-level breakdown.
   * 3. Identifies weak skills to pipe into Weakness Tracker & Review Queue.
   * 4. Does NOT award standard practice XP (keeps exam score separate).
   */
  public static gradeExamSubmission(
    exam: ExamDefinition,
    userId: string,
    sessionId: string,
    submittedAnswers: Record<string, string>,
    timeSpentSeconds: number
  ): ExamSubmissionResult {
    let earnedPoints = 0;
    let totalMaxPoints = 0;

    const detailedAnswers: ExamSubmissionResult['answers'] = [];
    const topicPointsMap: Record<string, { earned: number; total: number; skills: Set<string> }> = {};
    const skillErrorMap: Record<string, { count: number; name: string }> = {};

    for (const qId of exam.questionIds) {
      const q = EXAM_QUESTION_BANK.find((item) => item.id === qId);
      if (!q) continue;

      totalMaxPoints += q.points;
      const userSelected = submittedAnswers[q.id] || '';
      const isCorrect = userSelected.toLowerCase() === q.correctOptionId.toLowerCase();

      if (isCorrect) {
        earnedPoints += q.points;
      } else {
        // Track error for Weakness Tracker
        if (!skillErrorMap[q.testedSkillCode]) {
          skillErrorMap[q.testedSkillCode] = { count: 0, name: q.testedSkillName };
        }
        skillErrorMap[q.testedSkillCode].count++;
      }

      // Topic tracking
      if (!topicPointsMap[q.topicSlug]) {
        topicPointsMap[q.topicSlug] = { earned: 0, total: 0, skills: new Set() };
      }
      topicPointsMap[q.topicSlug].total += q.points;
      if (isCorrect) {
        topicPointsMap[q.topicSlug].earned += q.points;
      }
      topicPointsMap[q.topicSlug].skills.add(q.testedSkillCode);

      detailedAnswers.push({
        questionId: q.id,
        prompt: q.prompt,
        codeSnippet: q.codeSnippet,
        selectedOptionId: userSelected,
        correctOptionId: q.correctOptionId,
        isCorrect,
        explanation: q.explanation,
        testedSkillCode: q.testedSkillCode,
        testedSkillName: q.testedSkillName,
      });
    }

    const finalScore = totalMaxPoints > 0 ? Math.round((earnedPoints / totalMaxPoints) * 100) : 0;
    const isPassed = finalScore >= exam.passingScore;

    // Build topic breakdowns
    const topicBreakdowns: TopicScoreBreakdown[] = Object.entries(topicPointsMap).map(
      ([tSlug, val]) => {
        const topic = OFFICIAL_PYTHON_COURSE.topics.find((t) => t.slug === tSlug);
        const percentage = val.total > 0 ? Math.round((val.earned / val.total) * 100) : 0;
        return {
          topicSlug: tSlug,
          topicTitle: topic?.title || tSlug,
          earnedPoints: val.earned,
          totalPoints: val.total,
          percentage,
          skillCodes: Array.from(val.skills),
          needsReview: percentage < 70, // Flag for targeted relearning
        };
      }
    );

    const weakSkillsIdentified = Object.entries(skillErrorMap).map(([code, val]) => ({
      skillCode: code,
      skillName: val.name,
      errorCount: val.count,
    }));

    return {
      submissionId: `exam-sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sessionId,
      userId,
      examId: exam.id,
      examSlug: exam.slug,
      examTitle: exam.title,
      score: finalScore,
      totalScore: totalMaxPoints,
      isPassed,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      answers: detailedAnswers,
      topicBreakdowns,
      weakSkillsIdentified,
    };
  }
}
