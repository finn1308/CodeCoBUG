'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  Sparkles,
  Terminal,
  Layers,
  ChevronRight,
  BookOpen,
  Info,
  ExternalLink,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { ProjectCourse } from '@/lib/types/project';
import { authManager } from '@/lib/auth/authManager';

interface ProjectDetailProps {
  project: ProjectCourse;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => {
      const list = authManager.getCompletedCheckpoints(project.id);
      setCompletedSlugs(list);
    };
    refresh();
    const unsub = authManager.subscribe(() => refresh());
    return () => unsub();
  }, [project.id]);

  const copyToClipboard = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1800);
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

  const theme = getThemeVars(project.accentColor);
  const totalCheckpoints = project.checkpoints.length;
  const completedCount = completedSlugs.length;
  const percentage = totalCheckpoints > 0 ? Math.round((completedCount / totalCheckpoints) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      {/* Top Back Navigation */}
      <div>
        <Link
          href="/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.86rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại Danh sách Dự án</span>
        </Link>
      </div>

      {/* Project Hero Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.bg} 0%, var(--bg-surface) 100%)`,
          border: `1.5px solid ${theme.border}`,
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant={project.accentColor} style={{ fontSize: '0.74rem', fontWeight: 800 }}>
            {project.category === 'game' ? 'Game Development' : project.category === 'data' ? 'Data Science' : 'Full-Stack Web'}
          </Badge>
          <Badge variant="neutral" style={{ fontSize: '0.74rem' }}>
            <Clock size={12} style={{ marginRight: '4px' }} />
            Thời lượng: ~{project.estimatedHours} giờ
          </Badge>
          <Badge variant="mint" style={{ fontSize: '0.74rem' }}>
            Cấp độ: Nâng cao
          </Badge>
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          {project.title}
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.6 }}>
          {project.subtitle}
        </p>

        {/* Progress Tracker */}
        <div style={{ maxWidth: '420px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tiến độ các Chặng kiểm tra:</span>
            <span style={{ color: theme.text }}>
              {completedCount}/{totalCheckpoints} ({percentage}%)
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-tertiary)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: theme.text,
                borderRadius: 'var(--radius-full)',
                transition: 'width 300ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Prerequisites & Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Prerequisites Card */}
        <Card style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
            <Sparkles size={16} style={{ color: theme.text }} />
            <span>Kiến thức cần biết trước (Prerequisites)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {project.prerequisites.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </Card>

        {/* Learning Objectives Card */}
        <Card style={{ padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
            <Layers size={16} style={{ color: theme.text }} />
            <span>Mục tiêu đầu ra của dự án</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {project.learningObjectives.slice(0, 4).map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Runtime Environment Notice */}
      <div
        style={{
          backgroundColor: 'var(--pastel-sky-light)',
          border: '1px solid var(--pastel-sky)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}
      >
        <Info size={20} style={{ color: 'var(--pastel-sky-text)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {project.runtimeNotice}
        </div>
      </div>

      {/* Local Execution Guide */}
      <Card style={{ padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
          <Terminal size={18} style={{ color: theme.text }} />
          <span>Hướng dẫn thiết lập và chạy trên máy tính cá nhân (Local Guide)</span>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 16px 0' }}>
          Để trải nghiệm đầy đủ giao diện gốc (cửa sổ đồ họa Pygame 60 FPS hoặc máy chủ Web Django cục bộ), bạn chỉ cần mở Terminal trên máy cá nhân và thực thi các câu lệnh sau:
        </p>

        {/* Terminal Commands */}
        <div
          style={{
            backgroundColor: 'var(--editor-bg)',
            color: '#F8FAFC',
            fontFamily: 'monospace',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.83rem',
            lineHeight: 1.6,
            overflowX: 'auto',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: '10px', right: '12px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={() => copyToClipboard([...project.localExecutionGuide.installCommands, project.localExecutionGuide.runCommand].join('\n'), 999)}
              title="Sao chép toàn bộ lệnh cài đặt và khởi chạy"
            >
              {copiedIndex === 999 ? <Check size={12} color="#4ADE80" /> : <Copy size={12} />}
              <span>{copiedIndex === 999 ? 'Đã sao chép' : 'Sao chép lệnh'}</span>
            </button>
          </div>
          {project.localExecutionGuide.installCommands.map((cmd, idx) => (
            <div key={idx} style={{ opacity: cmd.startsWith('#') ? 0.6 : 1, color: cmd.startsWith('#') ? '#94A3B8' : '#38BDF8' }}>
              {cmd}
            </div>
          ))}
          <div style={{ marginTop: '8px', color: '#4ADE80', fontWeight: 700 }}>
            $ {project.localExecutionGuide.runCommand}
          </div>
        </div>

        {/* Folder Structure */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            📁 Cấu trúc thư mục dự án khuyến nghị:
          </div>
          <pre
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              margin: 0,
              fontSize: '0.8rem',
              overflowX: 'auto',
            }}
          >
            {project.localExecutionGuide.folderStructure}
          </pre>
        </div>
      </Card>

      {/* Checkpoints Sequential List */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} style={{ color: theme.text }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Danh sách Chặng kiểm tra (Checkpoints)
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Hoàn thành từng chặng để mở khóa tiếp
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {project.checkpoints.map((checkpoint, idx) => {
            const isCompleted = completedSlugs.includes(checkpoint.slug);
            // First checkpoint is always unlocked. Next checkpoints require previous to be completed.
            const isUnlocked = idx === 0 || completedSlugs.includes(project.checkpoints[idx - 1].slug) || isCompleted;

            return (
              <Card
                key={checkpoint.id}
                style={{
                  padding: '20px 24px',
                  borderRadius: 'var(--radius-lg)',
                  border: isCompleted
                    ? '1.5px solid var(--pastel-mint)'
                    : isUnlocked
                    ? `1.5px solid ${theme.border}`
                    : '1px solid var(--border-subtle)',
                  backgroundColor: isCompleted
                    ? 'var(--pastel-mint-light)'
                    : isUnlocked
                    ? 'var(--bg-surface)'
                    : 'var(--bg-tertiary)',
                  opacity: isUnlocked ? 1 : 0.75,
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isCompleted ? 'var(--pastel-mint)' : isUnlocked ? theme.bg : 'var(--bg-secondary)',
                        color: isCompleted ? 'var(--pastel-mint-text)' : isUnlocked ? theme.text : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={18} /> : isUnlocked ? idx + 1 : <Lock size={15} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                        {checkpoint.title}
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {checkpoint.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <Link
                        href={`/exercises/${checkpoint.exerciseSlug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant={isCompleted ? 'secondary' : project.accentColor}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <PlayCircle size={15} />
                          <span>{isCompleted ? 'Làm lại' : 'Vào thực hành'}</span>
                        </Button>
                      </Link>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <Lock size={13} />
                        <span>Cần xong Chặng {idx}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkpoint Objectives */}
                {isUnlocked && (
                  <div style={{ paddingLeft: '42px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Mục tiêu chặng:</div>
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {checkpoint.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
