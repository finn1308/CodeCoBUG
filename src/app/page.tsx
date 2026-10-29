import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { SAMPLE_TEST_COURSE } from '@/lib/fixtures/sampleCurriculum';
import { BookOpen, Code2, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const course = SAMPLE_TEST_COURSE;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Header />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', width: '100%', flex: 1 }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--accent-light)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <Sparkles size={14} />
            <span>CodeCoBUG Architecture Foundation</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
            Luyện tập Lập trình Python <span className="text-gradient">Thông minh & Trực tuyến</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            Nền tảng tích hợp trình soạn thảo Monaco, bộ thực thi WebAssembly Pyodide, hệ thống chấm bài tự động và AI gia sư kèm cặp.
          </p>
        </div>

        {/* Course Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-light)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                <BookOpen size={15} />
                <span>Khóa học</span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {course.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                {course.description}
              </p>
            </div>

            <div
              className="badge"
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '4px 10px',
              }}
            >
              <CheckCircle2 size={13} />
              <span>Khóa học nền tảng</span>
            </div>
          </div>

          {/* Topics List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {course.topics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                }}
              >
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {topic.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                    {topic.summary}
                  </p>
                </div>

                {/* Exercises in Topic */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {topic.lessons.flatMap((l) => l.exercises).map((ex) => (
                    <Link
                      key={ex.id}
                      href={`/exercises/${ex.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      className="exercise-item-link"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'var(--bg-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-light)',
                          }}
                        >
                          <Code2 size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {ex.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                            <span>3 ví dụ minh họa</span>
                            <span>•</span>
                            <span>{ex.examples.length} test scenarios</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span className={`badge badge-${ex.difficulty}`}>
                          {ex.difficulty.replace('_', ' ')}
                        </span>

                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            color: 'var(--accent-light)',
                            fontWeight: 600,
                          }}
                        >
                          <Award size={13} />
                          {ex.points} đ
                        </span>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--text-secondary)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                          }}
                        >
                          <span>Mở IDE</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
