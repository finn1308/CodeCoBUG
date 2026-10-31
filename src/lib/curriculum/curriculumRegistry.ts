import { Course } from '@/lib/types/curriculum';
import { CHAPTER_01_INTRO } from './chapter01_intro';
import { CHAPTER_02_VARIABLES } from './chapter02_variables';
import { CHAPTER_03_OPERATORS } from './chapter03_operators';
import { CHAPTER_04_STRINGS } from './chapter04_strings';
import { CHAPTER_05_DATA_STRUCTURES } from './chapter05_data_structures';
import { CHAPTER_06_CONDITIONALS } from './chapter06_conditionals';
import { CHAPTER_07_LOOPS } from './chapter07_loops';
import { CHAPTER_08_FUNCTIONS } from './chapter08_functions';
import { CHAPTER_09_ERRORS_MODULES } from './chapter09_errors_modules';
import { CHAPTER_10_FILES_DATA } from './chapter10_files_data';
import { CHAPTER_11_OOP } from './chapter11_oop';
import { CHAPTER_12_ADVANCED_TOPICS } from './chapter12_advanced_topics';

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
    CHAPTER_08_FUNCTIONS,
    CHAPTER_09_ERRORS_MODULES,
    CHAPTER_10_FILES_DATA,
    CHAPTER_11_OOP,
    CHAPTER_12_ADVANCED_TOPICS,
  ],
};

import { getCheckpointByExerciseSlug, convertCheckpointToExercise, ALL_PROJECTS } from '@/lib/projects';

export function getExerciseFromRegistry(slug: string) {
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      const match = lesson.exercises.find((ex) => ex.slug === slug);
      if (match) {
        return { exercise: match, lesson, topic };
      }
    }
  }

  // Check in Project-Based Learning (PBL) checkpoints
  const pblMatch = getCheckpointByExerciseSlug(slug);
  if (pblMatch) {
    return convertCheckpointToExercise(pblMatch.checkpoint, pblMatch.project);
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

  // Include PBL checkpoint exercises
  for (const project of ALL_PROJECTS) {
    for (const chk of project.checkpoints) {
      list.push(convertCheckpointToExercise(chk, project));
    }
  }

  return list;
}

export function getTopicBySlug(slug: string) {
  return OFFICIAL_PYTHON_COURSE.topics.find((t) => t.slug === slug) || null;
}

export function getLessonBySlug(topicSlug: string, lessonSlug: string) {
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return null;
  const lesson = topic.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return null;
  return { topic, lesson };
}

export function findLessonBySlug(lessonSlug: string) {
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    const lesson = topic.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) {
      return { topic, lesson };
    }
  }
  return null;
}

export function getAllLessonsFromRegistry() {
  const list = [];
  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      list.push({ topic, lesson });
    }
  }
  return list;
}
