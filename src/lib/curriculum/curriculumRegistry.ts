import { Course } from '@/lib/types/curriculum';
import { CHAPTER_01_INTRO } from './chapter01_intro';

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
