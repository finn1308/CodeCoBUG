export type ExamType =
  | 'topic_diagnostic' // Bài kiểm tra đầu vào theo chủ đề
  | 'chapter_end'      // Bài kiểm tra cuối chương (End-of-Chapter Exam)
  | 'comprehensive';   // Bài thi tổng hợp nhiều chương (Midterm / Final Mock Exam)

export type QuestionFormat = 'multiple_choice' | 'code_analysis' | 'code_fill';

export interface ExamQuestionOption {
  id: string; // 'a', 'b', 'c', 'd'
  text: string;
}

export interface ExamQuestion {
  id: string;
  topicSlug: string;
  chapterOrderIndex: number;
  format: QuestionFormat;
  prompt: string;
  codeSnippet?: string;
  options: ExamQuestionOption[];
  correctOptionId: string;
  explanation: string; // Lời giải chi tiết do CodeCoBUG biên soạn
  testedSkillCode: string;
  testedSkillName: string;
  points: number; // Điểm câu hỏi (vd: 10 điểm)
}

export interface ExamDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ExamType;
  durationMinutes: number; // Thời gian làm bài (phút)
  passingScore: number;    // Điểm đạt (thang 100, vd: 70)
  targetChapterSlugs: string[];
  questionIds: string[];
  totalPoints: number;
}

export interface ExamAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect?: boolean;
}

export interface ExamSessionState {
  sessionId: string;
  userId: string;
  examId: string;
  examSlug: string;
  examTitle: string;
  startedAt: string;
  expiresAt: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  isSubmitted: boolean;
  submittedAt?: string;
}

export interface TopicScoreBreakdown {
  topicSlug: string;
  topicTitle: string;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  skillCodes: string[];
  needsReview: boolean;
}

export interface ExamSubmissionResult {
  submissionId: string;
  sessionId: string;
  userId: string;
  examId: string;
  examSlug: string;
  examTitle: string;
  score: number; // 0 - 100
  totalScore: number;
  isPassed: boolean;
  timeSpentSeconds: number;
  submittedAt: string;
  answers: Array<{
    questionId: string;
    prompt: string;
    codeSnippet?: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    explanation: string;
    testedSkillCode: string;
    testedSkillName: string;
  }>;
  topicBreakdowns: TopicScoreBreakdown[];
  weakSkillsIdentified: Array<{
    skillCode: string;
    skillName: string;
    errorCount: number;
  }>;
}
