'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  FastForward,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { PathStage, StageMasteryStatus } from '@/lib/types/learningPath';
import { Card, Badge, Button } from '@/components/ui';

export interface StageTimelineCardProps {
  stage: PathStage;
  isCurrentStage: boolean;
  onSkipStage?: (stageNumber: number) => void;
}

export const StageTimelineCard: React.FC<StageTimelineCardProps> = ({
  stage,
  isCurrentStage,
  onSkipStage,
}) => {
  const [isExpanded, setIsExpanded] = useState(isCurrentStage);

  const getStatusBadge = (status: StageMasteryStatus, skipped: boolean) => {
    if (skipped) {
      return (
        <Badge variant="neutral" size="sm">
          Đã bỏ qua (Đạt test)
        </Badge>
      );
    }
    switch (status) {
      case 'mastered':
        return (
          <Badge variant="mint" size="sm" icon={<CheckCircle2 size={12} />}>
            Đã thành thạo
          </Badge>
        );
      case 'needs_review':
        return (
          <Badge variant="peach" size="sm" icon={<AlertTriangle size={12} />}>
            Cần ôn tập
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="sky" size="sm" icon={<PlayCircle size={12} />}>
            Đang học ({stage.progressPercentage}%)
          </Badge>
        );
      case 'not_started':
      default:
        return (
          <Badge variant="neutral" size="sm" icon={<Clock size={12} />}>
            Chưa học
          </Badge>
        );
    }
  };

  const getCardBorder = (status: StageMasteryStatus, isCurrent: boolean) => {
    if (isCurrent) return '2px solid var(--pastel-mint-text)';
    if (status === 'mastered') return '1px solid var(--pastel-mint)';
    if (status === 'needs_review') return '1px solid var(--pastel-peach)';
    return '1px solid var(--border-medium)';
  };

  return (
    <Card
      variant="default"
      padding="none"
      style={{
        borderRadius: 'var(--radius-xl)',
        border: getCardBorder(stage.status, isCurrentStage),
        boxShadow: isCurrentStage ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        backgroundColor: stage.skipped ? 'var(--bg-secondary)' : 'var(--bg-surface)',
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'all var(--transition-base)',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: isCurrentStage ? 'var(--pastel-mint-light)' : 'transparent',
        }}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              backgroundColor: stage.status === 'mastered' ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
              color: stage.status === 'mastered' ? 'var(--pastel-mint-text)' : 'var(--text-primary)',
            }}
          >
            {stage.stageNumber}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-primary)' }}>
                {stage.title}
              </span>
              {getStatusBadge(stage.status, stage.skipped)}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {stage.description}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right', display: 'none' }} className="desktop-stat">
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {stage.completedExercisesCount}/{stage.totalExercisesCount}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '4px' }}>bài</span>
          </div>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Progress line */}
      <div style={{ height: '4px', backgroundColor: 'var(--bg-tertiary)', width: '100%' }}>
        <div
          style={{
            height: '100%',
            width: `${stage.progressPercentage}%`,
            backgroundColor: stage.status === 'needs_review' ? 'var(--pastel-peach-text)' : 'var(--pastel-mint-text)',
            transition: 'width var(--transition-base)',
          }}
        />
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div style={{ padding: '18px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Chapter list */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Các chương trong chặng:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {stage.chapters.map((ch) => (
                <Badge key={ch.slug} variant="sky" size="sm" icon={<BookOpen size={11} />}>
                  {ch.title}
                </Badge>
              ))}
            </div>
          </div>

          {/* Exercise list preview */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Danh sách bài tập ({stage.exercises.length} bài):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
              {stage.exercises.slice(0, 6).map((ex) => (
                <Link
                  key={ex.slug}
                  href={`/exercises/${ex.slug}`}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ex.title}
                  </span>
                  <Badge variant={ex.difficulty === 'easy' ? 'mint' : ex.difficulty === 'medium' ? 'sky' : 'peach'} size="sm">
                    {ex.difficulty}
                  </Badge>
                </Link>
              ))}
              {stage.exercises.length > 6 && (
                <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  + và {stage.exercises.length - 6} bài học khác...
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            {stage.status !== 'mastered' && !stage.skipped && onSkipStage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSkipStage(stage.stageNumber)}
                leftIcon={<FastForward size={14} />}
                title="Bỏ qua chặng này nếu bạn đã vững kiến thức"
              >
                Bỏ qua chặng này
              </Button>
            )}

            {stage.exercises.length > 0 && (
              <Link href={`/exercises/${stage.exercises[0].slug}`} style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />}>
                  Vào bài đầu tiên của chặng
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

