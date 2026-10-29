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
  Code2,
  Award,
  Sparkles,
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
  // 1. Local / Real state derivation
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

    // Initialize with first topic expanded for pleasant learner discovery
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

        // Search query filter (search across topic title, summary, lesson title, exercise title/description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.topic.title.toLowerCase().includes(q);
          const matchSummary = item.topic.summary.toLowerCase().includes(q);
          const matchLesson = item.topic.lessons.some((l) => l.title.toLowerCase().includes(q));
          const matchExercise = item.exercises.some(
            (ex) => ex.title.toLowerCase().includes(q) || ex.description.toLowerCase().includes(q)
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
    <div id={id} className={`curriculum-browser-container ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Course Header / Progress Overview */}
      {showCourseHeader && (
        <Card variant="mint" padding="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pastel-mint-text)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  <BookOpen size={18} />
                  <span>Chương trình học Python chuẩn</span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                  {course.title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', marginTop: '8px', maxWidth: '750px', lineHeight: 1.55 }}>
                  {course.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Badge variant="mint" size="md" icon={<CheckCircle2 size={16} />}>
                  {courseStats.completedExercises}/{courseStats.totalExercises} bài đã hoàn thành ({courseStats.overallPercentage}%)
                </Badge>
                <Badge variant="sky" size="md" icon={<Award size={16} />}>
                  {courseStats.totalPoints} điểm tối đa
                </Badge>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span>Tiến độ tổng thể</span>
                <span style={{ color: 'var(--pastel-mint-text)', fontWeight: 700 }}>{courseStats.overallPercentage}% Hoàn thành</span>
              </div>
              <div
                style={{
                  height: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
          </div>
        </Card>
      )}

      {/* 2. Search, Filters, and Controls */}
      <Card variant="default" padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top row: Search input + Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <Input
                placeholder="Tìm kiếm chủ đề, bài tập hoặc từ khóa (print, input, if, loop)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
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
                      <RotateCcw size={14} />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Sort Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="form-control"
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="order">Theo thứ tự giáo trình</option>
                  <option value="progress">Tiến độ cao nhất</option>
                  <option value="exercises">Nhiều bài tập nhất</option>
                </select>
              </div>

              {/* Accordion global toggles */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button variant="ghost" size="sm" onClick={expandAll}>
                  Mở tất cả
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAll}>
                  Thu gọn
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom row: Filter Chips & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <Filter size={14} /> Trạng thái:
              </span>

              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'all' ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'all' ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'all' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Tất cả ({computedTopics.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('in_progress')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'in_progress' ? '1px solid var(--pastel-sky)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'in_progress' ? 'var(--pastel-sky-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'in_progress' ? 'var(--pastel-sky-text)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Đang học ({computedTopics.filter((t) => t.status === 'in_progress').length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'completed' ? '1px solid var(--pastel-mint)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'completed' ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                  color: statusFilter === 'completed' ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Đã hoàn thành ({computedTopics.filter((t) => t.status === 'completed').length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('not_started')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: statusFilter === 'not_started' ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === 'not_started' ? 'var(--bg-muted)' : 'var(--bg-surface)',
                  color: statusFilter === 'not_started' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                Chưa học ({computedTopics.filter((t) => t.status === 'not_started').length})
              </button>
            </div>

            {/* Reset Filters button */}
            {isFiltered && (
              <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RotateCcw size={14} />}>
                Đặt lại bộ lọc
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Empty State or Topics List */}
      {filteredTopics.length === 0 ? (
        <Card variant="default" padding="lg">
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '16px',
              }}
            >
              <Search size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Không tìm thấy chủ đề nào
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', maxWidth: '480px', margin: '0 auto 20px auto' }}>
              {searchQuery
                ? `Không có chủ đề hoặc bài tập nào khớp với từ khóa "${searchQuery}". Hãy thử từ khóa khác hoặc xóa bộ lọc.`
                : 'Không có chủ đề nào phù hợp với các tiêu chí bộ lọc đã chọn.'}
            </p>
            <Button variant="mint" size="md" onClick={resetFilters} leftIcon={<RotateCcw size={16} />}>
              Hiển thị toàn bộ giáo trình
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredTopics.map((item, index) => {
            const { topic, exercises, totalExercises, completedCount, percentage, status, nextExercise, theme } = item;
            const isExpanded = expandedTopicIds.has(topic.id);

            return (
              <div
                key={topic.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1.5px solid ${theme.border}`,
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                }}
              >
                {/* Topic Header Card */}
                <div
                  style={{
                    backgroundColor: theme.bgLight,
                    padding: '22px 24px',
                    borderBottom: isExpanded ? `1px solid ${theme.border}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ flex: '1 1 340px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: `1px solid ${theme.border}`,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
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

                        {/* Status Badge */}
                        {status === 'completed' && (
                          <Badge variant="mint" size="sm" icon={<CheckCircle2 size={13} />}>
                            Đã hoàn thành
                          </Badge>
                        )}
                        {status === 'in_progress' && (
                          <Badge variant="sky" size="sm" icon={<PlayCircle size={13} />}>
                            Đang học
                          </Badge>
                        )}
                        {status === 'not_started' && (
                          <Badge variant="neutral" size="sm" icon={<Clock size={13} />}>
                            Chưa bắt đầu
                          </Badge>
                        )}
                        {status === 'locked' && (
                          <Badge variant="peach" size="sm" icon={<Lock size={13} />}>
                            Đã khóa
                          </Badge>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        {topic.title}
                      </h3>
                      {topic.summary && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', marginTop: '6px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                          {topic.summary}
                        </p>
                      )}
                    </div>

                    {/* Progress summary & Action buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flex: '0 0 auto' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {completedCount}/{totalExercises} bài tập ({percentage}%)
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {status === 'completed' ? 'Xuất sắc! Bạn đã xong chủ đề này' : 'Tiến độ thực tế'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Primary action button */}
                        {status === 'locked' ? (
                          <Button variant="outline" size="sm" disabled leftIcon={<Lock size={14} />}>
                            Khóa
                          </Button>
                        ) : nextExercise ? (
                          <Link href={`/exercises/${nextExercise.slug}`} style={{ textDecoration: 'none' }}>
                            <Button
                              variant={status === 'completed' ? 'outline' : 'mint'}
                              size="sm"
                              leftIcon={status === 'completed' ? <RotateCcw size={14} /> : <PlayCircle size={14} />}
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
                          rightIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          aria-expanded={isExpanded}
                          aria-label={`Xem danh sách bài tập của ${topic.title}`}
                        >
                          {isExpanded ? 'Thu gọn' : 'Chi tiết'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      marginTop: '16px',
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
                </div>

                {/* Expanded Lessons & Exercises Accordion */}
                {isExpanded && (
                  <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {topic.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          style={{
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px',
                            backgroundColor: 'var(--bg-tertiary)',
                          }}
                        >
                          {/* Lesson Title & Theory Note */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Layers size={16} color="var(--text-secondary)" />
                              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                                {lesson.title}
                              </h4>
                            </div>

                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {lesson.exercises.length} bài tập
                            </span>
                          </div>

                          {lesson.theoryContent && (
                            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                              {lesson.theoryContent}
                            </p>
                          )}

                          {/* Exercise List */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {lesson.exercises.map((exercise, exIdx) => {
                              const isCompleted = isExerciseCompleted(exercise);

                              return (
                                <div
                                  key={exercise.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    backgroundColor: isCompleted ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                                    border: isCompleted ? '1px solid var(--pastel-mint)' : '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                  }}
                                >
                                  {/* Left: Indicator & Title */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px' }}>
                                    <div
                                      style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: 'var(--radius-full)',
                                        backgroundColor: isCompleted ? 'var(--status-success)' : 'var(--bg-muted)',
                                        color: isCompleted ? '#FFFFFF' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {isCompleted ? <Check size={14} strokeWidth={3} /> : exIdx + 1}
                                    </div>

                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                          {exercise.title}
                                        </span>
                                      </div>
                                      <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineClamp: 1 }}>
                                        {exercise.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Right: Badges & Launch Link */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                    {getDifficultyBadge(exercise.difficulty)}
                                    <Badge variant="yellow" size="sm" icon={<Award size={12} />}>
                                      +{exercise.points}đ
                                    </Badge>

                                    <Link href={`/exercises/${exercise.slug}`} style={{ textDecoration: 'none' }}>
                                      <Button
                                        variant={isCompleted ? 'ghost' : 'mint'}
                                        size="sm"
                                        rightIcon={<ArrowRight size={14} />}
                                      >
                                        {isCompleted ? 'Làm lại' : 'Làm bài'}
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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
