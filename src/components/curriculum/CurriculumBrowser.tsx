'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  PlayCircle,
  Lock,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
  Award,
  Layers,
  Check,
} from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { Course, Topic, Difficulty } from '@/lib/types/curriculum';
import { SAMPLE_TEST_COURSE } from '@/lib/fixtures/sampleCurriculum';
import { authManager } from '@/lib/auth/authManager';

export interface CurriculumBrowserProps {
  course?: Course;
  topics?: Topic[];
  completedExerciseIds?: Set<string>;
  completedExerciseSlugs?: Set<string>;
  showCourseHeader?: boolean;
  initialFilter?: 'all' | 'in_progress' | 'completed' | 'not_started';
  initialDifficulty?: 'all' | Difficulty;
  id?: string;
  className?: string;
}

const PASTEL_THEMES = [
  {
    name: 'mint',
    bgLight: 'var(--pastel-mint-light)',
    border: 'var(--pastel-mint)',
    text: 'var(--pastel-mint-text)',
    badgeVariant: 'mint' as const,
  },
  {
    name: 'sky',
    bgLight: 'var(--pastel-sky-light)',
    border: 'var(--pastel-sky)',
    text: 'var(--pastel-sky-text)',
    badgeVariant: 'sky' as const,
  },
  {
    name: 'lavender',
    bgLight: 'var(--pastel-lavender-light)',
    border: 'var(--pastel-lavender)',
    text: 'var(--pastel-lavender-text)',
    badgeVariant: 'lavender' as const,
  },
  {
    name: 'peach',
    bgLight: 'var(--pastel-peach-light)',
    border: 'var(--pastel-peach)',
    text: 'var(--pastel-peach-text)',
    badgeVariant: 'peach' as const,
  },
  {
    name: 'yellow',
    bgLight: 'var(--pastel-yellow-light)',
    border: 'var(--pastel-yellow)',
    text: 'var(--pastel-yellow-text)',
    badgeVariant: 'yellow' as const,
  },
];

export const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({
  course = SAMPLE_TEST_COURSE,
  topics: propTopics,
  completedExerciseIds: propCompletedIds,
  completedExerciseSlugs: propCompletedSlugs,
  showCourseHeader = true,
  initialFilter = 'all',
  initialDifficulty = 'all',
  id = 'curriculum',
  className = '',
}) => {
  // 1. Local & Real state derivation
  const [internalCompletedSlugs, setInternalCompletedSlugs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>(initialFilter);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>(initialDifficulty);
  const [sortBy, setSortBy] = useState<'order' | 'progress' | 'exercises'>('order');
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set());

  // Determine list of topics to render from props or course
  const rawTopics = useMemo(() => {
    return propTopics || course.topics || [];
  }, [propTopics, course]);

  // Load real user completed submissions if not passed as props
  useEffect(() => {
    if (propCompletedSlugs) {
      setInternalCompletedSlugs(propCompletedSlugs);
      return;
    }

    const loadRealUserProgress = () => {
      const submissions = authManager.getAllUserSubmissions();
      const completed = new Set<string>();
      for (const sub of submissions) {
        if (sub.verdict === 'accepted') {
          completed.add(sub.exerciseSlug);
        }
      }
      setInternalCompletedSlugs(completed);
    };

    loadRealUserProgress();

    // Default to first topic expanded for pleasant initial discovery
    if (rawTopics.length > 0) {
      setExpandedTopicIds(new Set([rawTopics[0].id]));
    }
  }, [propCompletedSlugs, rawTopics]);

  const activeCompletedSlugs = propCompletedSlugs || internalCompletedSlugs;
  const activeCompletedIds = propCompletedIds;

  const isExerciseCompleted = useCallback((ex: { id: string; slug: string }) => {
    if (activeCompletedIds && activeCompletedIds.has(ex.id)) return true;
    if (activeCompletedSlugs && activeCompletedSlugs.has(ex.slug)) return true;
    return false;
  }, [activeCompletedIds, activeCompletedSlugs]);

  // 2. Compute stats for each topic
  const computedTopics = useMemo(() => {
    return rawTopics.map((topic, index) => {
      const exercises = topic.lessons.flatMap((lesson) => lesson.exercises);
      const totalExercises = exercises.length;
      const completedCount = exercises.filter((ex) => isExerciseCompleted(ex)).length;
      const percentage = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

      let status: 'locked' | 'completed' | 'in_progress' | 'not_started' = 'not_started';
      if (topic.isLocked) {
        status = 'locked';
      } else if (totalExercises > 0 && completedCount === totalExercises) {
        status = 'completed';
      } else if (completedCount > 0) {
        status = 'in_progress';
      } else {
        status = 'not_started';
      }

      // Next uncompleted exercise
      const nextExercise = exercises.find((ex) => !isExerciseCompleted(ex)) || exercises[0];

      // Pastel theme by order
      const theme = PASTEL_THEMES[index % PASTEL_THEMES.length];

      return {
        topic,
        exercises,
        totalExercises,
        completedCount,
        percentage,
        status,
        nextExercise,
        theme,
      };
    });
  }, [rawTopics, isExerciseCompleted]);

  // Overall course statistics
  const courseStats = useMemo(() => {
    let totalEx = 0;
    let completedEx = 0;
    let totalPoints = 0;

    for (const item of computedTopics) {
      totalEx += item.totalExercises;
      completedEx += item.completedCount;
      for (const ex of item.exercises) {
        totalPoints += ex.points;
      }
    }

    const percentage = totalEx > 0 ? Math.round((completedEx / totalEx) * 100) : 0;
    return {
      totalTopics: computedTopics.length,
      totalExercises: totalEx,
      completedExercises: completedEx,
      overallPercentage: percentage,
      totalPoints,
    };
  }, [computedTopics]);

  // 3. Search, Filter, and Sort logic
  const filteredTopics = useMemo(() => {
    return computedTopics
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) {
          return false;
        }

        // Difficulty filter
        if (difficultyFilter !== 'all') {
          const hasDifficulty = item.exercises.some((ex) => ex.difficulty === difficultyFilter);
          if (!hasDifficulty) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.topic.title.toLowerCase().includes(q);
          const matchSummary = item.topic.summary ? item.topic.summary.toLowerCase().includes(q) : false;
          const matchLesson = item.topic.lessons.some((l) => l.title.toLowerCase().includes(q));
          const matchExercise = item.exercises.some(
            (ex) => ex.title.toLowerCase().includes(q) || (ex.description ? ex.description.toLowerCase().includes(q) : false)
          );

          if (!matchTitle && !matchSummary && !matchLesson && !matchExercise) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'progress') {
          return b.percentage - a.percentage;
        }
        if (sortBy === 'exercises') {
          return b.totalExercises - a.totalExercises;
        }
        return a.topic.orderIndex - b.topic.orderIndex;
      });
  }, [computedTopics, statusFilter, difficultyFilter, searchQuery, sortBy]);

  // Toggle topic accordion
  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTopicIds(new Set(rawTopics.map((t) => t.id)));
  };

  const collapseAll = () => {
    setExpandedTopicIds(new Set());
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDifficultyFilter('all');
    setSortBy('order');
  };

  const isFiltered = searchQuery.trim() !== '' || statusFilter !== 'all' || difficultyFilter !== 'all' || sortBy !== 'order';

  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'very_easy':
        return <Badge variant="mint" size="sm">Rất dễ</Badge>;
      case 'easy':
        return <Badge variant="sky" size="sm">Dễ</Badge>;
      case 'medium':
        return <Badge variant="yellow" size="sm">Trung bình</Badge>;
      case 'hard':
        return <Badge variant="peach" size="sm">Khó</Badge>;
      case 'challenge':
        return <Badge variant="error" size="sm">Thử thách</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{difficulty}</Badge>;
    }
  };

  return (
    <div id={id} className={`curriculum-browser-container ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Compact Course Header */}
      {showCourseHeader && (
        <Card variant="mint" padding="md" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--pastel-mint-text)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  <BookOpen size={15} />
                  <span>Chương trình học Python chuẩn</span>
                </div>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                  {course.title}
                </h1>
                {course.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px', maxWidth: '680px', lineHeight: 1.5, margin: '4px 0 0 0' }}>
                    {course.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {courseStats.totalExercises > 0 && (
                  <Badge variant="mint" size="sm" icon={<CheckCircle2 size={13} />}>
                    {courseStats.completedExercises}/{courseStats.totalExercises} bài ({courseStats.overallPercentage}%)
                  </Badge>
                )}
                {courseStats.totalPoints > 0 && (
                  <Badge variant="sky" size="sm" icon={<Award size={13} />}>
                    {courseStats.totalPoints} điểm
                  </Badge>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            {courseStats.totalExercises > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <span>Tiến độ toàn bộ giáo trình</span>
                  <span style={{ color: 'var(--pastel-mint-text)', fontWeight: 700 }}>{courseStats.overallPercentage}% Hoàn thành</span>
                </div>
                <div
                  style={{
                    height: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    border: '1px solid var(--pastel-mint)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${courseStats.overallPercentage}%`,
                      backgroundColor: 'var(--border-focus)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease-out',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 2. Compact Search & Filter Controls */}
      <Card variant="default" padding="sm" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top row: Search input + Sorting + Accordion toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px' }}>
              <Input
                placeholder="Tìm kiếm chủ đề, bài tập hoặc từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={16} />}
                rightIcon={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label="Xóa tìm kiếm"
                    >
                      <RotateCcw size={13} />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-select"
                style={{
                  padding: '6px 10px',
                  fontSize: '0.8rem',
                  width: 'auto',
                  minWidth: '150px',
                }}
                aria-label="Sắp xếp danh sách chủ đề"
              >
                <option value="order">Thứ tự giáo trình</option>
                <option value="progress">Tiến độ cao nhất</option>
                <option value="exercises">Nhiều bài tập nhất</option>
              </select>

              {/* Accordion global toggles */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <Button variant="ghost" size="sm" onClick={expandAll} style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
                  Mở tất cả
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAll} style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
                  Thu gọn
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom row: Filter Chips & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <Filter size={13} /> Lọc:
              </span>

              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'all' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'all' ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'all' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-instant)',
                }}
              >
                Tất cả ({computedTopics.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('in_progress')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'in_progress' ? '1px solid var(--pastel-sky)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'in_progress' ? 'var(--pastel-sky-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'in_progress' ? 'var(--pastel-sky-text)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-instant)',
                }}
              >
                Đang học ({computedTopics.filter((t) => t.status === 'in_progress').length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'completed' ? '1px solid var(--pastel-mint)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'completed' ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'completed' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-instant)',
                }}
              >
                Đã hoàn thành ({computedTopics.filter((t) => t.status === 'completed').length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('not_started')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'not_started' ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'not_started' ? 'var(--bg-muted)' : 'var(--bg-surface)',
                  color: statusFilter === 'not_started' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all var(--transition-instant)',
                }}
              >
                Chưa học ({computedTopics.filter((t) => t.status === 'not_started').length})
              </button>
            </div>

            {/* Reset Filters button */}
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RotateCcw size={13} />} style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
                Đặt lại bộ lọc
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Empty State or Compact Topics List */}
      {filteredTopics.length === 0 ? (
        <Card variant="default" padding="md">
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '12px',
              }}
            >
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Không tìm thấy chủ đề nào
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', maxWidth: '420px', margin: '0 auto 16px auto', lineHeight: 1.45 }}>
              {searchQuery
                ? `Không có chủ đề hoặc bài tập nào khớp với từ khóa "${searchQuery}". Hãy thử từ khóa khác hoặc xóa bộ lọc.`
                : 'Không có chủ đề nào phù hợp với các tiêu chí bộ lọc đã chọn.'}
            </p>
            <Button variant="mint" size="sm" onClick={resetFilters} leftIcon={<RotateCcw size={14} />}>
              Hiển thị toàn bộ giáo trình
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredTopics.map((item, index) => {
            const { topic, exercises, totalExercises, completedCount, percentage, status, nextExercise, theme } = item;
            const isExpanded = expandedTopicIds.has(topic.id);

            return (
              <div
                key={topic.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${theme.border}`,
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'box-shadow var(--transition-base), border-color var(--transition-base)',
                }}
              >
                {/* Topic Header Card (Compact & Focused) */}
                <div
                  style={{
                    backgroundColor: theme.bgLight,
                    padding: '16px 20px',
                    borderBottom: isExpanded ? `1px solid ${theme.border}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: `1px solid ${theme.border}`,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: theme.text,
                            textTransform: 'uppercase',
                          }}
                        >
                          Chủ đề {String(topic.orderIndex || index + 1).padStart(2, '0')}
                        </span>

                        {topic.category && (
                          <Badge variant={theme.badgeVariant} size="sm">
                            {topic.category}
                          </Badge>
                        )}

                        {/* Real Status Badge */}
                        {status === 'completed' && (
                          <Badge variant="mint" size="sm" icon={<CheckCircle2 size={12} />}>
                            Đã hoàn thành
                          </Badge>
                        )}
                        {status === 'in_progress' && (
                          <Badge variant="sky" size="sm" icon={<PlayCircle size={12} />}>
                            Đang học
                          </Badge>
                        )}
                        {status === 'not_started' && (
                          <Badge variant="neutral" size="sm" icon={<Clock size={12} />}>
                            Chưa bắt đầu
                          </Badge>
                        )}
                        {status === 'locked' && (
                          <Badge variant="peach" size="sm" icon={<Lock size={12} />}>
                            Đã khóa
                          </Badge>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {topic.title}
                      </h3>
                      {topic.summary && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.45, margin: '4px 0 0 0' }}>
                          {topic.summary}
                        </p>
                      )}
                    </div>

                    {/* Progress summary & Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flex: '0 0 auto' }}>
                      {totalExercises > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {completedCount}/{totalExercises} bài tập ({percentage}%)
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {/* Primary action button */}
                        {status === 'locked' ? (
                          <Button variant="outline" size="sm" disabled leftIcon={<Lock size={13} />}>
                            Khóa
                          </Button>
                        ) : nextExercise ? (
                          <Link href={`/exercises/${nextExercise.slug}`} style={{ textDecoration: 'none' }}>
                            <Button
                              variant={status === 'completed' ? 'outline' : 'mint'}
                              size="sm"
                              leftIcon={status === 'completed' ? <RotateCcw size={13} /> : <PlayCircle size={13} />}
                            >
                              {status === 'completed' ? 'Ôn tập lại' : status === 'in_progress' ? 'Học tiếp' : 'Bắt đầu học'}
                            </Button>
                          </Link>
                        ) : null}

                        {/* Toggle Accordion */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTopicExpand(topic.id)}
                          rightIcon={isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          aria-expanded={isExpanded}
                          aria-label={`Xem danh sách bài tập của ${topic.title}`}
                          style={{ padding: '6px 10px' }}
                        >
                          {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {totalExercises > 0 && (
                    <div
                      style={{
                        height: '5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden',
                        marginTop: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          backgroundColor: status === 'completed' ? 'var(--status-success)' : 'var(--border-focus)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.35s ease',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Expanded Lessons & Exercises Accordion */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topic.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          style={{
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '12px 14px',
                            backgroundColor: 'var(--bg-tertiary)',
                          }}
                        >
                          {/* Lesson Title */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: lesson.theoryContent || lesson.exercises.length > 0 ? '8px' : '0', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Layers size={15} color="var(--text-secondary)" />
                              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                {lesson.title}
                              </h4>
                            </div>

                            {lesson.exercises.length > 0 && (
                              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                {lesson.exercises.length} bài tập
                              </span>
                            )}
                          </div>

                          {lesson.theoryContent && (
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                              {lesson.theoryContent}
                            </p>
                          )}

                          {/* Exercise List */}
                          {lesson.exercises.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {lesson.exercises.map((exercise, exIdx) => {
                                const isCompleted = isExerciseCompleted(exercise);

                                return (
                                  <div
                                    key={exercise.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '8px 12px',
                                      backgroundColor: isCompleted ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                                      border: isCompleted ? '1px solid var(--pastel-mint)' : '1px solid var(--border-subtle)',
                                      borderRadius: 'var(--radius-md)',
                                      flexWrap: 'wrap',
                                      gap: '8px',
                                    }}
                                  >
                                    {/* Left: Indicator & Title */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 200px' }}>
                                      <div
                                        style={{
                                          width: '22px',
                                          height: '22px',
                                          borderRadius: 'var(--radius-full)',
                                          backgroundColor: isCompleted ? 'var(--status-success)' : 'var(--bg-muted)',
                                          color: isCompleted ? '#FFFFFF' : 'var(--text-muted)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '0.7rem',
                                          fontWeight: 700,
                                          flexShrink: 0,
                                        }}
                                      >
                                        {isCompleted ? <Check size={12} strokeWidth={3} /> : exIdx + 1}
                                      </div>

                                      <div>
                                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                          {exercise.title}
                                        </div>
                                        {exercise.description && (
                                          <p style={{ margin: '1px 0 0 0', fontSize: '0.76rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                                            {exercise.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Right: Badges & Launch Link */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                      {getDifficultyBadge(exercise.difficulty)}
                                      {exercise.points > 0 && (
                                        <Badge variant="yellow" size="sm" icon={<Award size={11} />}>
                                          +{exercise.points}đ
                                        </Badge>
                                      )}

                                      <Link href={`/exercises/${exercise.slug}`} style={{ textDecoration: 'none' }}>
                                        <Button
                                          variant={isCompleted ? 'ghost' : 'mint'}
                                          size="sm"
                                          rightIcon={<ArrowRight size={13} />}
                                          style={{ padding: '3px 8px', fontSize: '0.76rem' }}
                                        >
                                          {isCompleted ? 'Làm lại' : 'Làm bài'}
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
