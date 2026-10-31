export type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'challenge';

export interface Example {
  id: string;
  exerciseId: string;
  inputData: string;
  expectedOutput: string;
  explanation?: string;
  orderIndex: number;
}

export interface TestCase {
  id: string;
  exerciseId: string;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
  comparisonMode: 'exact' | 'normalized_lines' | 'float_tolerance';
  weight: number;
  orderIndex: number;
}

export interface LessonExample {
  title?: string;
  code: string;
  expectedOutput: string;
  explanation?: string;
}

export interface LessonCommonMistake {
  mistake: string;
  explanation: string;
  fix: string;
}

export interface LessonGuidedTask {
  title: string;
  instructions: string;
  hint?: string;
}

export interface LessonReferenceLink {
  title: string;
  url: string;
}

export type CurriculumLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LessonMiniChallenge {
  title: string;
  instructions: string;
  hint?: string;
  expectedOutputSnippet?: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  topicId: string;
  slug: string;
  title: string;
  description: string;
  starterCode: string;
  solutionCode?: string;
  difficulty: Difficulty;
  points: number;
  completionCriteria: {
    requiredTests: 'all' | 'majority';
    forbiddenTokens?: string[];
    requiredTokens?: string[];
  };
  examples: Example[];
  testCases?: TestCase[]; // Public test cases only on client
  orderIndex: number;
  isPublished: boolean;
  skillTags?: string[];
  expectedLearningOutcome?: string;
  hints?: string[];
}

export interface Lesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  theoryContent?: string;
  learningObjectives?: string[];
  prerequisites?: string[];
  codeExamples?: LessonExample[];
  commonMistakes?: LessonCommonMistake[];
  guidedPracticeTask?: LessonGuidedTask;
  recap?: string[];
  referenceLinks?: LessonReferenceLink[];
  level?: CurriculumLevel;
  visualExplanation?: string;
  miniChallenge?: LessonMiniChallenge;
  relatedLessons?: string[];
  exercises: Exercise[];
  orderIndex: number;
  isPublished: boolean;
}

export type TopicCompletionStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Topic {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  summary: string;
  orderIndex: number;
  lessons: Lesson[];
  isPublished: boolean;
  category?: string;
  isLocked?: boolean;
  accentColor?: 'mint' | 'lavender' | 'sky' | 'peach' | 'yellow';
  level?: CurriculumLevel;
  prerequisites?: string[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  topics: Topic[];
  isPublished: boolean;
}
