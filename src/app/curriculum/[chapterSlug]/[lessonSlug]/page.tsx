import React from 'react';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout';
import { LessonDetail } from '@/components/curriculum';
import {
  OFFICIAL_PYTHON_COURSE,
  getLessonBySlug,
  getAllLessonsFromRegistry,
} from '@/lib/curriculum/curriculumRegistry';

interface LessonPageProps {
  params: Promise<{
    chapterSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateStaticParams() {
  const params: Array<{ chapterSlug: string; lessonSlug: string }> = [];

  for (const topic of OFFICIAL_PYTHON_COURSE.topics) {
    for (const lesson of topic.lessons) {
      params.push({
        chapterSlug: topic.slug,
        lessonSlug: lesson.slug,
      });
    }
  }

  return params;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { chapterSlug, lessonSlug } = await params;
  const match = getLessonBySlug(chapterSlug, lessonSlug);

  if (!match) {
    notFound();
  }

  const { topic, lesson } = match;

  // Flatten all lessons across curriculum to find sequential prev / next
  const allLessons = getAllLessonsFromRegistry();
  const currentIndex = allLessons.findIndex(
    (item) => item.topic.slug === chapterSlug && item.lesson.slug === lessonSlug
  );

  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const prevLesson = prevItem
    ? {
        topicSlug: prevItem.topic.slug,
        lessonSlug: prevItem.lesson.slug,
        title: prevItem.lesson.title,
      }
    : null;

  const nextLesson = nextItem
    ? {
        topicSlug: nextItem.topic.slug,
        lessonSlug: nextItem.lesson.slug,
        title: nextItem.lesson.title,
      }
    : null;

  return (
    <AppShell
      headerProps={{
        exerciseTitle: lesson.title,
        topicTitle: topic.title,
      }}
    >
      <LessonDetail
        topic={topic}
        lesson={lesson}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
      />
    </AppShell>
  );
}

