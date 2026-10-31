import React from 'react';
import { AppShell } from '@/components/layout';
import { MinimalLondonHome } from '@/components/home/MinimalLondonHome';

// LearningDashboard integration is encapsulated within MinimalLondonHome
export default function HomePage() {
  return (
    <AppShell hideSidebar={true}>
      <MinimalLondonHome />
    </AppShell>
  );
}
