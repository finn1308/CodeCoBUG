'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  BarChart3,
  Globe2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { ProjectCourse } from '@/lib/types/project';
import { ALL_PROJECTS } from '@/lib/projects';
import { authManager } from '@/lib/auth/authManager';

interface ProjectListProps {
  projects?: ProjectCourse[];
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects = ALL_PROJECTS,
}) => {
  const [progressMap, setProgressMap] = useState<Record<string, { completedCount: number; percentage: number }>>({});

  useEffect(() => {
    const updateProgress = () => {
      const map: Record<string, { completedCount: number; percentage: number }> = {};
      for (const p of projects) {
        const prog = authManager.getProjectProgress(p.id, p.checkpoints.length);
        map[p.id] = prog;
      }
      setProgressMap(map);
    };

    updateProgress();
    const unsub = authManager.subscribe(() => {
      updateProgress();
    });
    return () => unsub();
  }, [projects]);

  const getProjectIcon = (category: string) => {
    switch (category) {
      case 'game':
        return <Gamepad2 size={24} style={{ color: 'var(--pastel-mint-text)' }} />;
      case 'data':
        return <BarChart3 size={24} style={{ color: 'var(--pastel-sky-text)' }} />;
      case 'web':
        return <Globe2 size={24} style={{ color: 'var(--pastel-lavender-text)' }} />;
      default:
        return <Sparkles size={24} />;
    }
  };

  const getThemeVars = (accentColor: string) => {
    switch (accentColor) {
      case 'mint':
        return {
          bg: 'var(--pastel-mint-light)',
          border: 'var(--pastel-mint)',
          text: 'var(--pastel-mint-text)',
        };
      case 'sky':
        return {
          bg: 'var(--pastel-sky-light)',
          border: 'var(--pastel-sky)',
          text: 'var(--pastel-sky-text)',
        };
      case 'lavender':
      default:
        return {
          bg: 'var(--pastel-lavender-light)',
          border: 'var(--pastel-lavender)',
          text: 'var(--pastel-lavender-text)',
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--pastel-mint-light) 0%, var(--pastel-lavender-light) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={22} style={{ color: 'var(--pastel-mint-text)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Học tập qua Dự án Thực chiến (Project-Based Learning)
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
          3 Dự án Lớn Kế thừa từ Python Crash Course 3E
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '820px', lineHeight: 1.6 }}>
          Không học vẹt hay sao chép mã nguồn có sẵn. Mỗi dự án được bóc tách thành các Chặng kiểm tra (Checkpoints) có kiểm thử tự động,
          hướng dẫn chạy trên máy cá nhân và quản lý trạng thái tiến độ độc lập.
        </p>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {projects.map((project) => {
          const theme = getThemeVars(project.accentColor);
          const prog = progressMap[project.id] || { completedCount: 0, percentage: 0 };
          const isFinished = prog.completedCount >= project.checkpoints.length && project.checkpoints.length > 0;

          return (
            <Card
              key={project.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                border: `1.5px solid ${theme.border}`,
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-xs)',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
              }}
            >
              <div>
                {/* Header Icon & Badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: theme.bg,
                      border: `1px solid ${theme.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getProjectIcon(project.category)}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <Badge variant={project.accentColor} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                      Nâng cao
                    </Badge>
                    <Badge variant="neutral" style={{ fontSize: '0.72rem' }}>
                      <Clock size={11} style={{ marginRight: '4px' }} />
                      {project.estimatedHours}h
                    </Badge>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {project.title}
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {project.subtitle}
                </p>

                {/* Checkpoint Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <BookOpen size={14} />
                  <span>{project.checkpoints.length} Checkpoints thực hành</span>
                  <span>•</span>
                  <Terminal size={14} />
                  <span>{project.runtimeMode === 'pyodide_canvas' ? 'Pygame Engine' : project.runtimeMode === 'pyodide_data' ? 'Data Sci Engine' : 'Django Web MVT'}</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Tiến độ hoàn thành:</span>
                    <span style={{ color: theme.text }}>
                      {prog.completedCount}/{project.checkpoints.length} ({prog.percentage}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '7px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--bg-tertiary)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${prog.percentage}%`,
                        height: '100%',
                        backgroundColor: theme.text,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Link
                  href={`/projects/${project.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant={project.accentColor}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-lg)',
                    }}
                  >
                    <span>{isFinished ? 'Xem lại dự án' : prog.completedCount > 0 ? 'Tiếp tục dự án' : 'Bắt đầu dự án'}</span>
                    <ArrowRight size={15} />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

