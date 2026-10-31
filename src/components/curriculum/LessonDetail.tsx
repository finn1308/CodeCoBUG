'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Clock,
  Target,
  Lightbulb,
  AlertTriangle,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Award,
  Layers,
  ChevronRight,
  Play,
  Loader2,
  HelpCircle,
  Sparkles,
  Compass,
} from 'lucide-react';
import { Topic, Lesson } from '@/lib/types/curriculum';
import { authManager } from '@/lib/auth/authManager';
import { Card, Badge, Button } from '@/components/ui';
import { usePyodide } from '@/hooks/usePyodide';

export interface LessonDetailProps {
  topic: Topic;
  lesson: Lesson;
  prevLesson?: { topicSlug: string; lessonSlug: string; title: string } | null;
  nextLesson?: { topicSlug: string; lessonSlug: string; title: string } | null;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({
  topic,
  lesson,
  prevLesson,
  nextLesson,
}) => {
  const [completedExerciseSlugs, setCompletedExerciseSlugs] = useState<Set<string>>(new Set());
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);
  const [runningIdx, setRunningIdx] = useState<number | null>(null);
  const [liveOutputs, setLiveOutputs] = useState<Record<number, string>>({});
  const [showChallengeHint, setShowChallengeHint] = useState(false);
  const { runPython } = usePyodide();

  // Sync real completion state from authManager
  useEffect(() => {
    const updateProgress = () => {
      const submissions = authManager.getAllUserSubmissions();
      const accepted = new Set<string>();
      for (const s of submissions) {
        if (s.verdict === 'accepted') {
          accepted.add(s.exerciseSlug);
        }
      }
      setCompletedExerciseSlugs(accepted);

      // Check if all exercises are solved
      const allSolved = lesson.exercises.length > 0 && lesson.exercises.every((e) => accepted.has(e.slug));
      authManager.saveLessonProgress(lesson.slug, allSolved ? 'completed' : 'in_progress');
    };

    updateProgress();
    const unsub = authManager.subscribe(() => {
      updateProgress();
    });

    return () => unsub();
  }, [lesson]);

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 1500);
    } catch {
      // fallback
    }
  };

  const handleRunExample = async (code: string, idx: number) => {
    if (runningIdx !== null) return;
    setRunningIdx(idx);
    let outputBuffer = '';

    try {
      const res = await runPython(code, '', (type, text) => {
        outputBuffer += text;
      });
      if (res.status === 'completed') {
        setLiveOutputs((prev) => ({
          ...prev,
          [idx]: outputBuffer || '(Code thực thi thành công không có output)',
        }));
      } else {
        setLiveOutputs((prev) => ({
          ...prev,
          [idx]: res.cleanTraceback || res.errorMessage || 'Lỗi thực thi.',
        }));
      }
    } catch (err) {
      setLiveOutputs((prev) => ({
        ...prev,
        [idx]: `Lỗi: ${err instanceof Error ? err.message : String(err)}`,
      }));
    } finally {
      setRunningIdx(null);
    }
  };

  const totalExercises = lesson.exercises.length;
  const solvedCount = lesson.exercises.filter((e) => completedExerciseSlugs.has(e.slug)).length;
  const isLessonCompleted = totalExercises > 0 && solvedCount === totalExercises;

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '24px 20px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* 1. Breadcrumbs Navigation */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          flexWrap: 'wrap',
        }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Tổng quan
        </Link>
        <ChevronRight size={13} />
        <Link href="/curriculum" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          Giáo trình
        </Link>
        <ChevronRight size={13} />
        <Link href={`/curriculum/${topic.slug}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          {topic.title}
        </Link>
        <ChevronRight size={13} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
          {lesson.title}
        </span>
      </nav>

      {/* 2. Lesson Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--pastel-mint-light) 0%, var(--pastel-sky-light) 100%)',
          border: '1px solid var(--pastel-mint)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--pastel-mint)',
                borderRadius: 'var(--radius-full)',
                padding: '3px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--pastel-mint-text)',
                textTransform: 'uppercase',
              }}
            >
              {topic.title}
            </span>

            {isLessonCompleted ? (
              <Badge variant="mint" size="sm" icon={<CheckCircle2 size={12} />}>
                Đã hoàn thành ({solvedCount}/{totalExercises} bài tập)
              </Badge>
            ) : solvedCount > 0 ? (
              <Badge variant="sky" size="sm" icon={<PlayCircle size={12} />}>
                Đang học ({solvedCount}/{totalExercises} bài tập)
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm" icon={<Clock size={12} />}>
                Đang học (Lý thuyết)
              </Badge>
            )}
          </div>

          <Link href={`/curriculum/${topic.slug}`} style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={13} />}>
              Danh sách bài trong chương
            </Button>
          </Link>
        </div>

        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: '0 0 10px 0',
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {lesson.title}
        </h1>

        {totalExercises > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '16px' }}>
            <div style={{ flex: '1 1 200px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: 'var(--radius-full)', overflow: 'hidden', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.round((solvedCount / totalExercises) * 100)}%`,
                  backgroundColor: isLessonCompleted ? 'var(--status-success)' : 'var(--border-focus)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {solvedCount}/{totalExercises} bài tập hoàn thành
            </span>
          </div>
        )}
      </div>

      {/* 3. Objectives & Prerequisites Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <Card variant="mint" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Target size={16} style={{ color: 'var(--pastel-mint-text)' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pastel-mint-text)', margin: 0 }}>
                Bạn sẽ học được gì? (Objectives)
              </h2>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {lesson.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </Card>
        )}

        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <Card variant="sky" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Lightbulb size={16} style={{ color: 'var(--pastel-sky-text)' }} />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pastel-sky-text)', margin: 0 }}>
                Kiến thức cần biết trước (Prerequisites)
              </h2>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {lesson.prerequisites.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* 4. Visual Explanation / Mind Model */}
      {lesson.visualExplanation && (
        <Card variant="lavender" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pastel-lavender-text)', margin: 0 }}>
              Mô hình trực quan & Sơ đồ khái niệm
            </h2>
          </div>
          <div style={{ whiteSpace: 'pre-line', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {lesson.visualExplanation}
          </div>
        </Card>
      )}

      {/* 5. Complete Pedagogical Theory */}
      {lesson.theoryContent && (
        <Card variant="default" padding="lg" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <BookOpen size={18} style={{ color: 'var(--border-focus)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Nội dung bài học chi tiết
            </h2>
          </div>

          <div
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              lineHeight: 1.75,
              whiteSpace: 'pre-line',
            }}
          >
            {lesson.theoryContent}
          </div>
        </Card>
      )}

      {/* 6. Runnable Code Examples */}
      {lesson.codeExamples && lesson.codeExamples.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code2 size={18} style={{ color: 'var(--pastel-mint-text)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Ví dụ code minh họa ({lesson.codeExamples.length} ví dụ)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lesson.codeExamples.map((ex, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {ex.title || `Ví dụ ${i + 1}`}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleRunExample(ex.code, i)}
                      disabled={runningIdx !== null}
                      className="btn btn-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Chạy thực tế đoạn code này bằng WebAssembly"
                    >
                      {runningIdx === i ? (
                        <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Play size={12} style={{ color: 'var(--status-success)' }} />
                      )}
                      <span>{runningIdx === i ? 'Đang chạy...' : 'Chạy thử'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(ex.code, i)}
                      className="btn btn-ghost"
                      style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="Sao chép đoạn code"
                    >
                      {copiedCodeIdx === i ? <Check size={12} style={{ color: 'var(--status-success-text)' }} /> : <Copy size={12} />}
                      <span>{copiedCodeIdx === i ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      lineHeight: 1.55,
                      overflowX: 'auto',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    {ex.code}
                  </pre>

                  {/* Live Pyodide Output if executed */}
                  {liveOutputs[i] !== undefined && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: 'var(--terminal-bg, #1B2332)',
                        color: 'var(--terminal-text, #E5EDF7)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <div style={{ color: 'var(--pastel-sky, #93C5FD)', fontSize: '0.7rem', fontWeight: 700, marginBottom: '3px' }}>
                        ⚡ Kết quả chạy thực tế (Pyodide WebAssembly):
                      </div>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{liveOutputs[i]}</pre>
                    </div>
                  )}

                  {ex.expectedOutput && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 700 }}>Kết quả mẫu kỳ vọng: </span>
                      <code style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                        {ex.expectedOutput}
                      </code>
                    </div>
                  )}

                  {ex.explanation && (
                    <div style={{ marginTop: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 600 }}>Giải thích: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6b. Mini Challenge / Quick Comprehension Quiz */}
      {lesson.miniChallenge && (
        <Card variant="lavender" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
              <h2 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--pastel-lavender-text)', margin: 0 }}>
                Câu hỏi kiểm tra nhanh: {lesson.miniChallenge.title}
              </h2>
            </div>
            {lesson.miniChallenge.hint && (
              <button
                type="button"
                onClick={() => setShowChallengeHint((prev) => !prev)}
                className="btn btn-ghost"
                style={{ padding: '3px 8px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <HelpCircle size={12} />
                <span>{showChallengeHint ? 'Ẩn gợi ý' : 'Xem gợi ý tư duy'}</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {lesson.miniChallenge.instructions}
          </div>

          {showChallengeHint && lesson.miniChallenge.hint && (
            <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 700, color: 'var(--pastel-lavender-text)' }}>💡 Gợi ý suy nghĩ: </span>
              {lesson.miniChallenge.hint}
              {lesson.miniChallenge.expectedOutputSnippet && (
                <div style={{ marginTop: '4px' }}>
                  <span style={{ fontWeight: 600 }}>Dữ liệu đầu ra mẫu: </span>
                  <code style={{ fontFamily: 'var(--font-mono)', backgroundColor: 'var(--bg-tertiary)', padding: '1px 4px', borderRadius: '4px' }}>
                    {lesson.miniChallenge.expectedOutputSnippet}
                  </code>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* 6c. Guided Practice Task */}
      {lesson.guidedPracticeTask && (
        <Card variant="mint" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Compass size={16} style={{ color: 'var(--pastel-mint-text)' }} />
            <h2 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--pastel-mint-text)', margin: 0 }}>
              Thực hành có hướng dẫn: {lesson.guidedPracticeTask.title}
            </h2>
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {lesson.guidedPracticeTask.instructions}
          </div>
          {lesson.guidedPracticeTask.hint && (
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <em>💡 Hướng dẫn bước đầu:</em> {lesson.guidedPracticeTask.hint}
            </div>
          )}
        </Card>
      )}

      {/* 7. Common Pitfalls & Mistakes Warning */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <Card variant="peach" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--status-error-text)' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--status-error-text)', margin: 0 }}>
              Cạm bẫy & Sai lầm thường gặp (Common Pitfalls)
            </h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {lesson.commonMistakes.map((mis, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>
                <strong style={{ color: 'var(--status-error-text)' }}>{mis.mistake}:</strong> {mis.explanation}
                {mis.fix && (
                  <div style={{ marginTop: '2px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <em>Cách khắc phục:</em> <code style={{ backgroundColor: 'var(--bg-tertiary)', padding: '2px 4px', borderRadius: '4px' }}>{mis.fix}</code>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* 8. Summary Recap */}
      {lesson.recap && lesson.recap.length > 0 && (
        <Card variant="lavender" padding="md" style={{ borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 size={16} style={{ color: 'var(--pastel-lavender-text)' }} />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--pastel-lavender-text)', margin: 0 }}>
              Tóm tắt cốt lõi (Key Takeaways)
            </h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {lesson.recap.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* 9. W3Schools & Documentation Reference */}
      {lesson.referenceLinks && lesson.referenceLinks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lesson.referenceLinks.map((ref, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                fontSize: '0.82rem',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Tài liệu tham khảo chuẩn mực:</span>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--pastel-sky-text)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{ref.title || 'W3Schools Python Reference'}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 10. Linked Exercises Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: 'var(--pastel-mint-text)' }} />
            <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Bài tập thực hành ({lesson.exercises.length} bài)
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Chấm tự động với Judge Engine & bộ kiểm thử ẩn
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {lesson.exercises.map((ex, idx) => {
            const isSolved = completedExerciseSlugs.has(ex.slug);

            return (
              <div
                key={ex.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${isSolved ? 'var(--pastel-mint)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSolved ? 'var(--pastel-mint-light)' : 'var(--bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isSolved ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--status-success-text)' }} />
                    ) : (
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {ex.title}
                      </span>
                      <Badge variant={ex.difficulty as any} size="sm">
                        {ex.difficulty.replace('_', ' ')}
                      </Badge>
                      <Badge variant="mint" size="sm">
                        {ex.points} pts
                      </Badge>
                    </div>
                    {ex.description && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {ex.description}
                      </p>
                    )}
                  </div>
                </div>

                <Link href={`/exercises/${ex.slug}`} style={{ textDecoration: 'none' }}>
                  <Button
                    variant={isSolved ? 'secondary' : 'mint'}
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                    style={{ fontWeight: 700 }}
                  >
                    {isSolved ? 'Làm lại bài' : 'Làm bài tập ngay'}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 11. Bottom Pagination: Previous / Next Lesson */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '16px',
        }}
      >
        {prevLesson ? (
          <Link href={`/curriculum/${prevLesson.topicSlug}/${prevLesson.lessonSlug}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={14} />}>
              <span>Bài trước: {prevLesson.title}</span>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/curriculum/${nextLesson.topicSlug}/${nextLesson.lessonSlug}`} style={{ textDecoration: 'none' }}>
            <Button variant="mint" size="sm" rightIcon={<ArrowRight size={14} />}>
              <span>Bài tiếp: {nextLesson.title}</span>
            </Button>
          </Link>
        ) : (
          <Link href="/curriculum" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
              <span>Về Mục lục Giáo trình</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
