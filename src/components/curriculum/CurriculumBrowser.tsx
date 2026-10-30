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
  Target,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  Code,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button, Input } from '@/components/ui';
import { Course, Topic, Difficulty } from '@/lib/types/curriculum';
import { OFFICIAL_PYTHON_COURSE } from '@/lib/curriculum';
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
  course = OFFICIAL_PYTHON_COURSE,
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
  const [expandedLessonIds, setExpandedLessonIds] = useState<Set<string>>(new Set());

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

  // Toggle lesson educational detail accordion
  const toggleLessonExpand = (lessonId: string) => {
    setExpandedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
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
                {/* Topic Header Card (Compact & Focused: Title, Description, Progress, Single Expand Action) */}
                <div
                  style={{
                    backgroundColor: theme.bgLight,
                    padding: '16px 20px',
                    borderBottom: isExpanded ? `1px solid ${theme.border}` : 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleTopicExpand(topic.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: '1 1 280px' }}>
                      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {topic.title}
                      </h3>
                      {topic.summary && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.45, margin: '4px 0 0 0' }}>
                          {topic.summary}
                        </p>
                      )}
                    </div>

                    {/* Progress summary & Single Expand/Open Action */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {totalExercises > 0 && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {completedCount}/{totalExercises} bài tập ({percentage}%)
                          </div>
                        </div>
                      )}

                      <Button
                        variant={isExpanded ? 'ghost' : 'outline'}
                        size="sm"
                        onClick={() => toggleTopicExpand(topic.id)}
                        rightIcon={isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        aria-expanded={isExpanded}
                        aria-label={`Xem danh sách bài tập của ${topic.title}`}
                        style={{ padding: '6px 12px', fontWeight: 600 }}
                      >
                        {isExpanded ? 'Thu gọn' : 'Xem bài học'}
                      </Button>
                    </div>
                  </div>

                  {/* Real progress bar */}
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

                {/* Expanded Lessons & Exercises Accordion: Metadata and Exercises revealed progressively */}
                {isExpanded && (
                  <div style={{ padding: '16px 20px', backgroundColor: 'var(--bg-surface)' }}>
                    {/* Progressive Disclosure: Metadata & Continue Action inside expanded chapter */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '14px',
                        paddingBottom: '12px',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
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

                      {status === 'locked' ? (
                        <Button variant="outline" size="sm" disabled leftIcon={<Lock size={13} />}>
                          Đã khóa
                        </Button>
                      ) : nextExercise ? (
                        <Link href={`/exercises/${nextExercise.slug}`} style={{ textDecoration: 'none' }}>
                          <Button
                            variant={status === 'completed' ? 'outline' : 'mint'}
                            size="sm"
                            leftIcon={status === 'completed' ? <RotateCcw size={13} /> : <PlayCircle size={13} />}
                          >
                            {status === 'completed' ? 'Ôn tập lại chủ đề' : status === 'in_progress' ? 'Học tiếp bài kế' : 'Bắt đầu chủ đề'}
                          </Button>
                        </Link>
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topic.lessons.map((lesson) => {
                        const isLessonDetailExpanded = expandedLessonIds.has(lesson.id);
                        const hasPedagogy = (lesson.learningObjectives && lesson.learningObjectives.length > 0) ||
                          (lesson.codeExamples && lesson.codeExamples.length > 0) ||
                          (lesson.commonMistakes && lesson.commonMistakes.length > 0) ||
                          lesson.guidedPracticeTask ||
                          (lesson.recap && lesson.recap.length > 0);

                        return (
                          <div
                            key={lesson.id}
                            style={{
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-lg)',
                              padding: '14px 16px',
                              backgroundColor: 'var(--bg-surface)',
                              boxShadow: 'var(--shadow-xs)',
                            }}
                          >
                            {/* Lesson Title & Header Actions */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Layers size={16} color="var(--pastel-sky-text)" />
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                  {lesson.title}
                                </h4>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {lesson.exercises.length > 0 && (
                                  <Badge variant="neutral" size="sm">
                                    {lesson.exercises.length} bài tập
                                  </Badge>
                                )}

                                {hasPedagogy && (
                                  <button
                                    type="button"
                                    onClick={() => toggleLessonExpand(lesson.id)}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '4px 10px',
                                      borderRadius: 'var(--radius-full)',
                                      fontSize: '0.74rem',
                                      fontWeight: 600,
                                      backgroundColor: isLessonDetailExpanded ? 'var(--pastel-sky-light)' : 'var(--bg-tertiary)',
                                      border: `1px solid ${isLessonDetailExpanded ? 'var(--pastel-sky)' : 'var(--border-subtle)'}`,
                                      color: isLessonDetailExpanded ? 'var(--pastel-sky-text)' : 'var(--text-secondary)',
                                      cursor: 'pointer',
                                      transition: 'all var(--transition-instant)',
                                    }}
                                    aria-expanded={isLessonDetailExpanded}
                                  >
                                    <BookOpen size={12} />
                                    <span>{isLessonDetailExpanded ? 'Thu gọn bài giảng' : 'Xem bài giảng chi tiết'}</span>
                                    {isLessonDetailExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Summary Theory excerpt when collapsed */}
                            {lesson.theoryContent && !isLessonDetailExpanded && (
                              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {lesson.theoryContent}
                              </p>
                            )}

                            {/* Detailed 10-Part Pedagogical Content when expanded */}
                            {isLessonDetailExpanded && (
                              <div
                                style={{
                                  backgroundColor: 'var(--bg-tertiary)',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '14px',
                                  margin: '10px 0 14px 0',
                                  border: '1px solid var(--border-subtle)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px',
                                }}
                              >
                                {/* 1. Objectives & Prerequisites */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                                  {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                                    <div style={{ backgroundColor: 'var(--pastel-mint-light)', border: '1px solid var(--pastel-mint)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pastel-mint-text)', marginBottom: '6px' }}>
                                        <Target size={14} />
                                        <span>Mục tiêu bài học</span>
                                      </div>
                                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                        {lesson.learningObjectives.map((obj, i) => (
                                          <li key={i}>{obj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                                    <div style={{ backgroundColor: 'var(--pastel-sky-light)', border: '1px solid var(--pastel-sky)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pastel-sky-text)', marginBottom: '6px' }}>
                                        <Lightbulb size={14} />
                                        <span>Kiến thức tiên quyết</span>
                                      </div>
                                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                                        {lesson.prerequisites.map((req, i) => (
                                          <li key={i}>{req}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>

                                {/* 2. Full Theory Text */}
                                {lesson.theoryContent && (
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                                      Nội dung lý thuyết
                                    </div>
                                    <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line', backgroundColor: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                      {lesson.theoryContent}
                                    </div>
                                  </div>
                                )}

                                {/* 3. Runnable Code Examples */}
                                {lesson.codeExamples && lesson.codeExamples.length > 0 && (
                                  <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                                      Ví dụ code minh họa
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      {lesson.codeExamples.map((ex, i) => (
                                        <div key={i} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                                            {ex.title}
                                          </div>
                                          <pre style={{ margin: 0, padding: '8px 10px', backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontFamily: 'monospace', overflowX: 'auto' }}>
                                            <code>{ex.code}</code>
                                          </pre>
                                          {ex.expectedOutput && (
                                            <div style={{ marginTop: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                              <span style={{ fontWeight: 600 }}>Kết quả: </span>
                                              <code style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: '3px' }}>{ex.expectedOutput}</code>
                                            </div>
                                          )}
                                          {ex.explanation && (
                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                              {ex.explanation}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 4. Common Mistakes & Fixes */}
                                {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
                                  <div style={{ backgroundColor: 'var(--pastel-peach-light)', border: '1px solid var(--pastel-peach)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pastel-peach-text)', marginBottom: '6px' }}>
                                      <AlertTriangle size={14} />
                                      <span>Lỗi thường gặp & Cách khắc phục</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      {lesson.commonMistakes.map((mis, i) => (
                                        <div key={i} style={{ fontSize: '0.79rem', color: 'var(--text-primary)' }}>
                                          <span style={{ fontWeight: 700, color: '#B91C1C' }}>⚠️ {mis.mistake}: </span>
                                          <span>{mis.explanation} </span>
                                          <span style={{ fontWeight: 600, color: '#15803D' }}>→ Sửa: {mis.fix}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* 5. Guided Task & Recap */}
                                {lesson.guidedPracticeTask && (
                                  <div style={{ backgroundColor: 'var(--pastel-lavender-light)', border: '1px solid var(--pastel-lavender)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--pastel-lavender-text)', marginBottom: '4px' }}>
                                      <Sparkles size={14} />
                                      <span>Nhiệm vụ thực hành có hướng dẫn: {lesson.guidedPracticeTask.title}</span>
                                    </div>
                                    <p style={{ margin: '2px 0 4px 0', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                      {lesson.guidedPracticeTask.instructions}
                                    </p>
                                    {lesson.guidedPracticeTask.hint && (
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        💡 Gợi ý: {lesson.guidedPracticeTask.hint}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* 6. Recap Points & Reference Links */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                                  {lesson.recap && lesson.recap.length > 0 && (
                                    <div style={{ flex: '1 1 240px' }}>
                                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>🧠 Ghi nhớ cốt lõi: </span>
                                      <span style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                                        {lesson.recap.join(' • ')}
                                      </span>
                                    </div>
                                  )}

                                  {lesson.referenceLinks && lesson.referenceLinks.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tham khảo:</span>
                                      {lesson.referenceLinks.map((ref, i) => (
                                        <a
                                          key={i}
                                          href={ref.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px',
                                            fontSize: '0.74rem',
                                            color: 'var(--border-focus)',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                          }}
                                        >
                                          <span>{ref.title}</span>
                                          <ExternalLink size={10} />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
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
                      );
                    })}
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
