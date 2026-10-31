import React from 'react';
import { Metadata } from 'next';
import { AppShell } from '@/components/layout';
import { LearningPathView } from '@/components/learning-path';

export const metadata: Metadata = {
  title: 'Lộ Trình Học Cá Nhân Hóa — CodeCoBUG',
  description: 'Hệ thống bản đồ học Python thích ứng theo trình độ, bài kiểm tra chẩn đoán năng lực và kết quả thực hành.',
};

export default function LearningPathPage() {
  return (
    <AppShell>
      <LearningPathView />
    </AppShell>
  );
}

