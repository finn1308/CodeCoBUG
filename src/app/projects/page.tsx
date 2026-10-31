import React from 'react';
import { AppShell } from '@/components/layout';
import { ProjectList } from '@/components/projects/ProjectList';
import { ALL_PROJECTS } from '@/lib/projects';

export const metadata = {
  title: 'Dự án Thực chiến Python (Project-Based Learning) | CodeCoBUG',
  description: 'Khám phá 3 dự án lớn từ Python Crash Course: Game Alien Invasion (Pygame), Data Visualization (Matplotlib & Plotly) và Web App (Django Full-Stack).',
};

export default function ProjectsPage() {
  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 0 40px 0' }}>
        <ProjectList projects={ALL_PROJECTS} />
      </div>
    </AppShell>
  );
}

