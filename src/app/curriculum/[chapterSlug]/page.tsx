import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/layout';
import {
  OFFICIAL_PYTHON_COURSE,
  getTopicBySlug,
} from '@/lib/curriculum/curriculumRegistry';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Layers,
  Award,
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

interface ChapterPageProps {
  params: Promise<{
    chapterSlug: string;
  }>;
}

export async function generateStaticParams() {
  return OFFICIAL_PYTHON_COURSE.topics.map((t) => ({
    chapterSlug: t.slug,
  }));
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterSlug } = await params;
  const topic = getTopicBySlug(chapterSlug);

  if (!topic) {
    notFound();
  }

  const totalExercises = topic.lessons.flatMap((l) => l.exercises).length;

  return (
    <AppShell
      headerProps={{
        exerciseTitle: topic.title,
        topicTitle: 'Giáo trình Python CodeCoBUG',
      }}
    >
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
        {/* Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
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
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            {topic.title}
          </span>
        </nav>

        {/* Chapter Hero */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--pastel-sky-light) 0%, var(--pastel-mint-light) 100%)',
            border: '1px solid var(--pastel-sky)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge variant="sky" size="sm">
                Chủ đề {String(topic.orderIndex).padStart(2, '0')}
              </Badge>
              <Badge variant="neutral" size="sm">
                {topic.lessons.length} bài học
              </Badge>
              <Badge variant="mint" size="sm">
                {totalExercises} bài tập thực hành
              </Badge>
            </div>

            <Link href="/curriculum" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={13} />}>
                Về danh mục giáo trình
              </Button>
            </Link>
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: '8px 0',
              lineHeight: 1.3,
            }}
          >
            {topic.title}
          </h1>

          {topic.summary && (
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
              {topic.summary}
            </p>
          )}
        </div>

        {/* Lessons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Các bài học trong chương
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topic.lessons.map((lesson, idx) => (
              <Card
                key={lesson.id}
                variant="default"
                padding="md"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--pastel-sky-light)',
                      color: 'var(--pastel-sky-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {lesson.title}
                      </span>
                      <Badge variant="neutral" size="sm">
                        {lesson.exercises.length} bài tập
                      </Badge>
                    </div>
                    {lesson.theoryContent && (
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '0.82rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {lesson.theoryContent}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link href={`/curriculum/${topic.slug}/${lesson.slug}`} style={{ textDecoration: 'none' }}>
                    <Button variant="mint" size="sm" rightIcon={<ArrowRight size={13} />}>
                      Vào học bài này
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

