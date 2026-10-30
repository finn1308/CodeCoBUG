import { Course } from '@/lib/types/curriculum';
import { CHAPTER_01_INTRO } from './chapter01_intro';
import { CHAPTER_02_VARIABLES } from './chapter02_variables';
import { CHAPTER_03_OPERATORS } from './chapter03_operators';
import { CHAPTER_04_STRINGS } from './chapter04_strings';
import { CHAPTER_05_DATA_STRUCTURES } from './chapter05_data_structures';
import { CHAPTER_06_CONDITIONALS } from './chapter06_conditionals';
import { CHAPTER_07_LOOPS } from './chapter07_loops';

/**
 * Authoritative CodeCoBUG Python Mastery Curriculum
 * Designed with original Vietnamese pedagogical explanations,
 * sequential progression inspired by W3Schools, runnable examples,
 * and deterministic multi-test grading.
 */
export const OFFICIAL_PYTHON_COURSE: Course = {
  id: 'course-codecobug-python-mastery',
  slug: 'python-mastery',
  title: 'Giáo trình Python Cơ bản & Tư duy Thuật toán',
  description: 'Lộ trình rèn luyện lập trình Python từ số 0 đến nâng cao: Cú pháp chuẩn, cấu trúc dữ liệu, thuật toán và dự án thực tế.',
  orderIndex: 1,
  isPublished: true,
  topics: [
    CHAPTER_01_INTRO,
    CHAPTER_02_VARIABLES,
    CHAPTER_03_OPERATORS,
    CHAPTER_04_STRINGS,
    CHAPTER_05_DATA_STRUCTURES,
    CHAPTER_06_CONDITIONALS,
    CHAPTER_07_LOOPS,
  ],
};

export function getExerciseFromRegistry(slug: string) {
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      const match = lesson.exercises.find((ex) => ex.slug === slug);
      if (match) {
        return { exercise: match, lesson, topic };
      }
    }
  }
  return null;
}

export function getAllExercisesFromRegistry() {
  const list = [];
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      for (const ex of lesson.exercises) {
        list.push({ exercise: ex, lesson, topic });
      }
    }
  }
  return list;
}
