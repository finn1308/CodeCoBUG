import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import { SAMPLE_TEST_COURSE } from '@/lib/fixtures/sampleCurriculum';
import { BookOpen, Code2, Award, ArrowRight, Sparkles, CheckCircle2, PlayCircle } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';

export default function HomePage() {
  const course = SAMPLE_TEST_COURSE;
  const firstExercise = course.topics[0]?.lessons[0]?.exercises[0];

  return (
    <AppShell>
      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '36px 24px', width: '100%', flex: 1 }}>
        {/* Welcoming Page Header / Hero Section */}
        <div style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--pastel-mint-light)',
              border: '1px solid var(--pastel-mint)',
              color: 'var(--pastel-mint-text)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} />
            <span>CodeCoBUG Teen Pastel Studio</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px', color: 'var(--text-primary)' }}>
            Luyện tập Lập trình Python <span className="text-gradient">Thông minh & Trực quan</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
            Không gian học lập trình tươi sáng, thân thiện dành cho học viên: Trình soạn thảo trực quan, bộ chạy WebAssembly Pyodide, chấm bài tự động và AI gia sư kèm cặp.
          </p>

          {/* Relevant Primary Action */}
          {firstExercise && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link href={`/exercises/${firstExercise.slug}`} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg" leftIcon={<PlayCircle size={18} />}>
                  Bắt đầu làm bài: {firstExercise.title}
                </Button>
              </Link>
              <a href="#curriculum" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" size="lg" leftIcon={<BookOpen size={18} />}>
                  Xem toàn bộ giáo trình
                </Button>
              </a>
            </div>
          )}
        </div>

        {/* Python Curriculum Section */}
        <div id="curriculum">
          <Card variant="default" padding="lg" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--pastel-sky-text)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  <BookOpen size={16} />
                  <span>Giáo trình học tập</span>
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {course.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
                  {course.description}
                </p>
              </div>

              <Badge variant="mint" size="md" icon={<CheckCircle2 size={14} />}>
                Khóa học nền tảng
              </Badge>
            </div>

            {/* Topics List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {course.topics.map((topic, topicIdx) => {
                const topicPastelClass = topicIdx % 2 === 0 ? 'var(--pastel-mint-light)' : 'var(--pastel-sky-light)';
                const topicBorder = topicIdx % 2 === 0 ? 'var(--pastel-mint)' : 'var(--pastel-sky)';

                return (
                  <div
                    key={topic.id}
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '24px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            backgroundColor: topicPastelClass,
                            border: `1px solid ${topicBorder}`,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          Chủ đề {String(topicIdx + 1).padStart(2, '0')}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                          {topic.title}
                        </h3>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
                        {topic.summary}
                      </p>
                    </div>

                    {/* Exercises in Topic */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {topic.lessons.flatMap((l) => l.exercises).map((ex) => (
                        <Link
                          key={ex.id}
                          href={`/exercises/${ex.slug}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            transition: 'all var(--transition-base)',
                            boxShadow: 'var(--shadow-xs)',
                          }}
                          className="card-pastel"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--pastel-mint)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--pastel-mint-text)',
                                flexShrink: 0,
                              }}
                            >
                              <Code2 size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                                {ex.title}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                                <span>3 ví dụ minh họa</span>
                                <span>•</span>
                                <span>{ex.examples.length} test scenarios</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <Badge variant={ex.difficulty as any} size="sm">
                              {ex.difficulty.replace('_', ' ')}
                            </Badge>

                            <Badge variant="mint" size="sm" icon={<Award size={13} />}>
                              {ex.points} đ
                            </Badge>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: 'var(--pastel-mint-text)',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                              }}
                            >
                              <span>Mở Studio</span>
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
