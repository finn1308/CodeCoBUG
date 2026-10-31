import React from 'react';
import { Metadata } from 'next';
import { AppShell } from '@/components/layout';
import { ExamListView } from '@/components/exams';

export const metadata: Metadata = {
  title: 'Hệ Thống Đánh Giá & Thi Thử Python — CodeCoBUG',
  description: 'Ngân hàng bài thi đánh giá năng lực Python chuẩn hóa có chấm tự động và phân tích điểm yếu.',
};

export default function ExamsIndexPage() {
  return (
    <AppShell>
      <ExamListView />
    </AppShell>
  );
}
