import React from 'react';
import { AppShell } from '@/components/layout';
import { LearningDashboard } from '@/components/dashboard/LearningDashboard';

export default function HomePage() {
  return (
    <AppShell>
      <LearningDashboard />
    </AppShell>
  );
}
