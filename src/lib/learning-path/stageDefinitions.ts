import { PathStage, StageMasteryStatus } from '../types/learningPath';
import { OFFICIAL_PYTHON_COURSE } from '../curriculum/curriculumRegistry';
import { SavedSubmissionRecord } from '../auth/authManager';
import { ReviewItem } from '../mastery/reviewEngine';
import { LearnerMasteryReport } from '../mastery/masteryEngine';

export interface StageDefinition {
  stageNumber: number;
  title: string;
  description: string;
  targetSkillCategory: string;
  prerequisiteStages: number[];
  chapterSlugs: string[];
}

export const PATH_STAGE_DEFINITIONS: StageDefinition[] = [
  {
    stageNumber: 1,
    title: 'Chặng 1: Khởi động & Cú pháp nền tảng',
    description: 'Làm quen lệnh print, nhập dữ liệu input, biến, kiểu số, toán tử số học và xử lý chuỗi ký tự cơ bản.',
    targetSkillCategory: 'Syntax & Primitive Types',
    prerequisiteStages: [],
    chapterSlugs: [
      'chu-de-01-lam-quen-python',
      'chu-de-02-bien-va-kieu-du-lieu',
      'chu-de-03-so-hoc-va-toan-tu',
      'chu-de-04-chuoi',
    ],
  },
  {
    stageNumber: 2,
    title: 'Chặng 2: Cấu trúc dữ liệu & Điều kiện rẽ nhánh',
    description: 'Thao tác danh sách (List), từ điển (Dictionary), tuple và mệnh đề so sánh if / elif / else linh hoạt.',
    targetSkillCategory: 'Data Structures & Control Flow',
    prerequisiteStages: [1],
    chapterSlugs: [
      'chu-de-05-cau-truc-du-lieu',
      'chu-de-06-cau-truc-dieu-kien',
    ],
  },
  {
    stageNumber: 3,
    title: 'Chặng 3: Vòng lặp & Tư duy hàm mô-đun',
    description: 'Tối ưu luồng lặp for / while, cờ hiệu, định nghĩa hàm def, tham số mặc định và tái sử dụng mã nguồn.',
    targetSkillCategory: 'Iterations & Modular Functions',
    prerequisiteStages: [1, 2],
    chapterSlugs: [
      'chu-de-07-vong-lap',
      'chu-de-08-ham-functions',
    ],
  },
  {
    stageNumber: 4,
    title: 'Chặng 4: Lập trình chuyên sâu & Dự án thực tế',
    description: 'Xử lý ngoại lệ try/except, thao tác tệp tin, lập trình hướng đối tượng (OOP) và kỹ thuật lập trình nâng cao.',
    targetSkillCategory: 'OOP, File I/O & Advanced Projects',
    prerequisiteStages: [1, 2, 3],
    chapterSlugs: [
      'chu-de-09-xu-ly-loi-va-module',
      'chu-de-10-file-va-du-lieu',
      'chu-de-11-huong-doi-tuong-oop',
      'chu-de-12-mo-rong-va-he-sinh-thai',
    ],
  },
];

/**
 * Build rich PathStage objects mapped with actual exercises and empirical progress
 */
export function buildPathStages(
  submissions: SavedSubmissionRecord[],
  skippedStageNumbers: number[] = [],
  reviewQueue: ReviewItem[] = [],
  masteryReport?: LearnerMasteryReport | null
): PathStage[] {
  const completedSlugSet = new Set(
    submissions.filter((s) => s.verdict === 'accepted').map((s) => s.exerciseSlug)
  );

  const pendingReviewSlugs = new Set(
    reviewQueue.filter((r) => r.status === 'pending').map((r) => r.exerciseSlug)
  );

  return PATH_STAGE_DEFINITIONS.map((def) => {
    const isSkipped = skippedStageNumbers.includes(def.stageNumber);

    // Collect chapters and exercises
    const matchedChapters = OFFICIAL_PYTHON_COURSE.topics
      .filter((t) => def.chapterSlugs.includes(t.slug))
      .map((t) => ({
        slug: t.slug,
        title: t.title,
        orderIndex: t.orderIndex,
      }));

    const stageExercises: PathStage['exercises'] = [];
    for (const tSlug of def.chapterSlugs) {
      const topic = OFFICIAL_PYTHON_COURSE.topics.find((t) => t.slug === tSlug);
      if (topic) {
        for (const lesson of topic.lessons) {
          for (const ex of lesson.exercises) {
            stageExercises.push({
              slug: ex.slug,
              title: ex.title,
              difficulty: ex.difficulty,
              points: ex.points,
              skillTags: ex.skillTags || [],
              isKeyMilestone: ex.difficulty === 'hard' || ex.difficulty === 'challenge',
            });
          }
        }
      }
    }

    const totalCount = stageExercises.length;
    const completedCount = isSkipped
      ? totalCount
      : stageExercises.filter((e) => completedSlugSet.has(e.slug)).length;

    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Check if any exercise in this stage needs review
    const hasPendingReview = stageExercises.some((e) => pendingReviewSlugs.has(e.slug));

    // Determine status
    let status: StageMasteryStatus = 'not_started';
    if (isSkipped || progressPercentage >= 100) {
      status = 'mastered';
    } else if (hasPendingReview) {
      status = 'needs_review';
    } else if (progressPercentage > 0) {
      status = 'in_progress';
    } else {
      // Check if prerequisite stages are completed or skipped
      const prereqsMet = def.prerequisiteStages.every((preNum) => {
        const preDef = PATH_STAGE_DEFINITIONS.find((p) => p.stageNumber === preNum);
        if (!preDef) return true;
        if (skippedStageNumbers.includes(preNum)) return true;
        // Count preDef completion
        let preCompleted = 0;
        let preTotal = 0;
        for (const cSlug of preDef.chapterSlugs) {
          const t = OFFICIAL_PYTHON_COURSE.topics.find((top) => top.slug === cSlug);
          if (t) {
            for (const l of t.lessons) {
              for (const ex of l.exercises) {
                preTotal++;
                if (completedSlugSet.has(ex.slug)) preCompleted++;
              }
            }
          }
        }
        return preTotal > 0 && preCompleted / preTotal >= 0.7; // 70% threshold
      });

      status = prereqsMet ? 'not_started' : 'not_started';
    }

    return {
      id: `stage-${def.stageNumber}`,
      stageNumber: def.stageNumber,
      title: def.title,
      description: def.description,
      targetSkillCategory: def.targetSkillCategory,
      prerequisiteStages: def.prerequisiteStages,
      chapters: matchedChapters,
      exercises: stageExercises,
      status,
      progressPercentage,
      completedExercisesCount: completedCount,
      totalExercisesCount: totalCount,
      skipped: isSkipped,
    };
  });
}
