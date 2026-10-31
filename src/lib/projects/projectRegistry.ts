import { ProjectCourse, ProjectCheckpoint } from '@/lib/types/project';
import { Exercise, Lesson, Topic } from '@/lib/types/curriculum';
import { PROJECT_ALIEN_INVASION } from './projectAlienInvasion';
import { PROJECT_DATA_VISUALIZATION } from './projectDataVisualization';
import { PROJECT_WEB_APPLICATIONS } from './projectWebApplications';

export { PROJECT_ALIEN_INVASION, PROJECT_DATA_VISUALIZATION, PROJECT_WEB_APPLICATIONS };

export const ALL_PROJECTS: ProjectCourse[] = [
  PROJECT_ALIEN_INVASION,
  PROJECT_DATA_VISUALIZATION,
  PROJECT_WEB_APPLICATIONS,
];

export function getAllProjects(): ProjectCourse[] {
  return ALL_PROJECTS;
}

export function getProjectBySlug(slug: string): ProjectCourse | undefined {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}

export function getCheckpointBySlug(
  projectSlug: string,
  checkpointSlug: string
): { project: ProjectCourse; checkpoint: ProjectCheckpoint } | undefined {
  const project = getProjectBySlug(projectSlug);
  if (!project) return undefined;
  const checkpoint = project.checkpoints.find((c) => c.slug === checkpointSlug);
  if (!checkpoint) return undefined;
  return { project, checkpoint };
}

export function getCheckpointByExerciseSlug(
  exerciseSlug: string
): { project: ProjectCourse; checkpoint: ProjectCheckpoint } | undefined {
  for (const project of ALL_PROJECTS) {
    const checkpoint = project.checkpoints.find((c) => c.exerciseSlug === exerciseSlug);
    if (checkpoint) {
      return { project, checkpoint };
    }
  }
  return undefined;
}

/**
 * Converts a ProjectCheckpoint into an Exercise object compatible with
 * CodeCoBUG's ExerciseWorkspace, ProblemStatement, and Judge Engine.
 */
export function convertCheckpointToExercise(
  checkpoint: ProjectCheckpoint,
  project: ProjectCourse
): { exercise: Exercise; lesson: Lesson; topic: Topic } {
  const exercise: Exercise = {
    id: checkpoint.exerciseSlug,
    lessonId: checkpoint.slug,
    topicId: project.id,
    slug: checkpoint.exerciseSlug,
    title: checkpoint.title,
    description: checkpoint.description,
    starterCode: checkpoint.starterCode,
    solutionCode: checkpoint.solutionCode,
    difficulty: 'medium',
    points: 20,
    completionCriteria: {
      requiredTests: 'all',
    },
    examples: checkpoint.testCases
      .filter((tc) => !tc.isHidden)
      .map((tc, idx) => ({
        id: `${checkpoint.exerciseSlug}-eg-${idx}`,
        exerciseId: checkpoint.exerciseSlug,
        inputData: tc.inputData,
        expectedOutput: tc.expectedOutput,
        explanation: tc.explanation,
        orderIndex: idx + 1,
      })),
    orderIndex: checkpoint.orderIndex,
    isPublished: true,
    skillTags: [`pbl_${project.category}`, 'advanced_python'],
    hints: checkpoint.hints,
  };

  const lesson: Lesson = {
    id: checkpoint.slug,
    topicId: project.id,
    slug: checkpoint.slug,
    title: checkpoint.title,
    level: 'advanced',
    theoryContent: `${checkpoint.theoryContent}\n\n${checkpoint.codeExplanation}`,
    learningObjectives: checkpoint.learningObjectives,
    prerequisites: project.prerequisites,
    codeExamples: [
      {
        title: 'Mã nguồn mẫu Checkpoint',
        code: checkpoint.solutionCode,
        expectedOutput: checkpoint.testCases[0]?.expectedOutput || '',
        explanation: checkpoint.codeExplanation,
      },
    ],
    commonMistakes: [],
    recap: checkpoint.learningObjectives,
    referenceLinks: [],
    orderIndex: checkpoint.orderIndex,
    isPublished: true,
    exercises: [exercise],
  };

  const topic: Topic = {
    id: project.id,
    courseId: 'course-pbl-mastery',
    slug: project.slug,
    title: project.title,
    summary: project.subtitle,
    orderIndex: 100,
    lessons: [lesson],
    isPublished: true,
    category: 'Học tập qua Dự án (PBL)',
    accentColor: project.accentColor,
    level: 'advanced',
    prerequisites: project.prerequisites,
  };

  return { exercise, lesson, topic };
}
