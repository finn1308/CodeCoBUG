export type LearningGoalType =
  | 'start_from_scratch' // Bắt đầu từ đầu (học sinh chưa biết gì về lập trình)
  | 'reinforce_basics'   // Củng cố nền tảng (đã biết sơ sài, hổng kiến thức)
  | 'practice_mastery'   // Luyện bài tập & tư duy thuật toán (tăng cường thử thách)
  | 'prepare_projects';  // Chuẩn bị làm 3 dự án thực chiến (Pygame, Data, Web)

export type LearningPace =
  | 'relaxed'  // 1-2 bài/ngày
  | 'standard' // 3-5 bài/ngày
  | 'intensive'; // 6+ bài/ngày (cường độ cao)

export type StageMasteryStatus =
  | 'not_started' // Chưa học (đang khóa hoặc chưa chạm tới)
  | 'in_progress' // Đang học
  | 'needs_review'// Cần ôn tập (gặp lỗi sai nhiều hoặc có trong review queue)
  | 'mastered';   // Đã thành thạo (đạt điểm cao, vượt qua test cases)

export interface DiagnosticQuestion {
  id: string;
  question: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  testedSkill: string; // e.g. 'python_syntax_intro', 'data_types_variables', 'control_flow_loops', 'functions_modular'
  stageWeight: number; // Tương ứng chặng 1, 2, 3 hay 4
}

export interface DiagnosticResult {
  completedAt: string;
  score: number; // 0 - 100
  totalQuestions: number;
  correctCount: number;
  assessedLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  answers: Record<string, string>; // questionId -> selectedOptionId
  skippedStages: number[]; // Danh sách các chặng đủ điều kiện bỏ qua
}

export interface PathStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  targetSkillCategory: string;
  prerequisiteStages: number[];
  chapters: {
    slug: string;
    title: string;
    orderIndex: number;
  }[];
  exercises: {
    slug: string;
    title: string;
    difficulty: string;
    points: number;
    skillTags: string[];
    isKeyMilestone?: boolean;
  }[];
  status: StageMasteryStatus;
  progressPercentage: number;
  completedExercisesCount: number;
  totalExercisesCount: number;
  skipped: boolean;
}

export interface PersonalizedPathState {
  userId: string;
  goal: LearningGoalType;
  pace: LearningPace;
  diagnostic: DiagnosticResult | null;
  stages: PathStage[];
  recommendedNextExercise: {
    slug: string;
    title: string;
    chapterTitle: string;
    reason: string;
    difficulty: string;
    isReview?: boolean;
  } | null;
  updatedAt: string;
}

export interface AssessmentEvaluation {
  passed: boolean;
  score: number;
  feedback: string;
  canSkipStage: boolean;
  unlockedStageNumber: number;
}

