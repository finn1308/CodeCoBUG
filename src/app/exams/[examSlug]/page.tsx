import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { AppShell } from '@/components/layout';
import { getExamBySlug } from '@/lib/exams/examRegistry';
import { ExamTakingView } from '@/components/exams';

interface ExamDetailPageProps {
  params: Promise<{
    examSlug: string;
  }>;
}

export async function generateMetadata({ params }: ExamDetailPageProps): Promise<Metadata> {
  const { examSlug } = await params;
  const exam = getExamBySlug(examSlug);
  if (!exam) return { title: 'Bài thi không tồn tại — CodeCoBUG' };
  return {
    title: `${exam.title} — Thi Thử CodeCoBUG`,
    description: exam.description,
  };
}

export default async function ExamDetailPage({ params }: ExamDetailPageProps) {
  const { examSlug } = await params;
  const exam = getExamBySlug(examSlug);

  if (!exam) {
    notFound();
  }

  return (
    <AppShell>
      <ExamTakingView exam={exam} />
    </AppShell>
  );
}
