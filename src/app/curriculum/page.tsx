import React from 'react';
import { AppShell } from '@/components/layout';
import { CurriculumBrowser } from '@/components/curriculum';

export const metadata = {
  title: 'Giáo trình Python | CodeCoBUG',
  description: 'Khám phá toàn bộ danh sách chủ đề, bài học và bài tập lập trình Python theo chuẩn CodeCoBUG.',
};

export default function CurriculumPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '8px 0 32px 0' }}>
        <CurriculumBrowser />
      </div>
    </AppShell>
  );
}

