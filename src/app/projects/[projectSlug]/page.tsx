import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';

interface ProjectPageProps {
  params: Promise<{
    projectSlug: string;
  }>;
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({
    projectSlug: p.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectSlug } = await params;
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 0 40px 0' }}>
        <ProjectDetail project={project} />
      </div>
    </AppShell>
  );
}

