'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Zap,
  Info,
  History,
  XCircle,
  Code2,
} from 'lucide-react';
import { authManager, SavedSubmissionRecord } from '@/lib/auth/authManager';
import { MasteryEngine, LearnerMasteryReport } from '@/lib/mastery/masteryEngine';
import { ReviewEngine, ReviewItem } from '@/lib/mastery/reviewEngine';
import { getExerciseFromRegistry } from '@/lib/curriculum/curriculumRegistry';
import { Modal, Button, Badge, Tabs } from '@/components/ui';

interface WeaknessTrackerModalProps {
  isOpen: boolean;
  initialTab?: 'skills' | 'queue' | 'policy' | 'history';
  onClose: () => void;
}

export const WeaknessTrackerModal: React.FC<WeaknessTrackerModalProps> = ({
  isOpen,
  initialTab = 'skills',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'queue' | 'policy' | 'history'>(initialTab);
  const [masteryReport, setMasteryReport] = useState<LearnerMasteryReport | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
  const [completedReviews, setCompletedReviews] = useState<ReviewItem[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<SavedSubmissionRecord[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialTab) {
      setActiveTab(initialTab);
    }

    const user = authManager.getCurrentUser();
    if (!user) return;

    const userSubmissions = authManager.getAllUserSubmissions();
    setAllSubmissions(userSubmissions);
    const report = MasteryEngine.computeMastery(userSubmissions);
    setMasteryReport(report);

    // Sync real-time review queue from submission evidence
    ReviewEngine.syncReviewQueue(user.id, userSubmissions);
    const pending = ReviewEngine.getPendingReviews(user.id);
    const completed = ReviewEngine.getCompletedReviews(user.id);

    setReviewQueue(pending);
    setCompletedReviews(completed);
  }, [isOpen, initialTab]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Theo dõi điểm yếu & Ôn tập thích ứng</span>
          {masteryReport && (
            <Badge variant="mint" size="sm">
              {masteryReport.overallMasteryPercentage}% Thành thạo
            </Badge>
          )}
        </div>
      }
      description="Dữ liệu năng lực tính toán 100% dựa trên lịch sử nộp bài thực tế"
      icon={<Target size={18} />}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      }
    >
      {/* Tab Switcher */}
      <div style={{ marginBottom: '18px' }}>
        <Tabs
          variant="pill"
          fullWidth
          activeTab={activeTab}
          onChange={(newTab) => setActiveTab(newTab as 'skills' | 'queue' | 'policy' | 'history')}
          tabs={[
            { id: 'skills', label: 'Kỹ năng & Điểm yếu', icon: <TrendingUp size={14} /> },
            { id: 'queue', label: `Hàng đợi ôn tập (${reviewQueue.length})`, icon: <Clock size={14} /> },
            { id: 'history', label: `Lịch sử (${allSubmissions.length})`, icon: <History size={14} /> },
            { id: 'policy', label: 'Chính sách', icon: <Info size={14} /> },
          ]}
        />
      </div>

      {/* TAB 1: SKILLS & RECURRING WEAKNESSES */}
      {activeTab === 'skills' && masteryReport && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Stat Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'var(--pastel-mint-light)',
                border: '1px solid var(--pastel-mint)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pastel-mint-text)' }}>
                {masteryReport.masteredCount}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                Đã thành thạo (≥80%)
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--pastel-sky-light)',
                border: '1px solid var(--pastel-sky)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pastel-sky-text)' }}>
                {masteryReport.inProgressCount}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                Đang rèn luyện (40-79%)
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--pastel-peach-light)',
                border: '1px solid var(--pastel-peach)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--pastel-peach-text)' }}>
                {masteryReport.weakCount}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>
                Cần củng cố (&lt;40%)
              </div>
            </div>
          </div>

          {/* Recurring Weakness Alert Banner */}
          {masteryReport.recurringWeaknesses.length > 0 && (
            <div
              style={{
                background: 'var(--status-error-bg)',
                border: '1px solid var(--status-error-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <ShieldAlert size={18} style={{ color: 'var(--status-error-text)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--status-error-text)' }}>
                  Phát hiện điểm yếu lặp lại (Recurring Weaknesses):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {masteryReport.recurringWeaknesses.map((w) => (
                    <Badge key={w.category} variant="error" size="sm">
                      {w.title} ({w.count} lần mắc)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Progress List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Chi tiết từng kỹ năng:
            </div>

            {masteryReport.skills.map((skill) => {
              const isMastered = skill.status === 'mastered';
              const isWeak = skill.status === 'weak';
              const isUntested = skill.status === 'untested';

              return (
                <div
                  key={skill.skillCode}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {skill.skillName}
                      </span>
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '0.7rem',
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--bg-muted)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {skill.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge
                        variant={isMastered ? 'success' : isWeak ? 'error' : isUntested ? 'neutral' : 'sky'}
                        size="sm"
                      >
                        {isMastered
                          ? 'THÀNH THẠO'
                          : isWeak
                          ? 'CẦN ÔN TẬP'
                          : isUntested
                          ? 'CHƯA KIỂM TRA'
                          : 'ĐANG RÈN LUYỆN'}
                      </Badge>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {skill.masteryScore}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${skill.masteryScore}%`,
                        backgroundColor: isMastered
                          ? 'var(--status-success)'
                          : isWeak
                          ? 'var(--status-error)'
                          : 'var(--pastel-sky-hover)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                    <span>{skill.description}</span>
                    <span style={{ fontWeight: 600 }}>
                      {skill.successfulAttempts}/{skill.totalAttempts} đạt
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ADAPTIVE REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Hàng đợi ôn tập thích ứng (Đề xuất dựa trên lỗi thực tế)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Hệ thống tự động đẩy các bài tập học viên từng làm sai hoặc có kỹ năng yếu vào hàng đợi này. Khi học viên nộp bài đạt, bài tập sẽ được tự động chuyển sang mục Hoàn thành.
            </div>
          </div>

          {reviewQueue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 10px', color: 'var(--status-success)', opacity: 0.85 }} />
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Không có bài tập cần ôn lại!</p>
              <p style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                Tất cả các bài tập bạn từng làm đều đã đạt chuẩn hoặc bạn chưa nộp bài thử nào.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reviewQueue.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: `1px solid ${item.priority === 1 ? 'var(--pastel-peach)' : 'var(--pastel-yellow)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {item.exerciseTitle}
                      </span>
                      <Badge
                        variant={item.priority === 1 ? 'peach' : 'yellow'}
                        size="sm"
                      >
                        {item.priority === 1 ? 'ƯU TIÊN CAO' : 'CỦNG CỐ'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.reasonDescription}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Mục tiêu: Kỹ năng [{item.targetSkillName}]
                    </div>
                  </div>

                  <Link
                    href={`/exercises/${item.exerciseSlug}`}
                    onClick={onClose}
                    className="btn btn-mint"
                    style={{ padding: '7px 14px', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Ôn tập ngay</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Completed Reviews Evidence */}
          {completedReviews.length > 0 && (
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Đã hoàn thành sau khi ôn luyện ({completedReviews.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {completedReviews.map((done) => (
                  <div
                    key={done.id}
                    style={{
                      backgroundColor: 'var(--status-success-bg)',
                      border: '1px solid var(--status-success-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--status-success-text)' }} />
                      <span style={{ color: 'var(--status-success-text)', fontWeight: 700 }}>{done.exerciseTitle}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>({done.targetSkillName})</span>
                    </div>
                    <span style={{ color: 'var(--status-success-text)', fontSize: '0.76rem', fontWeight: 700 }}>
                      Đã khắc phục thành công
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIGURABLE MASTERY POLICY */}
      {activeTab === 'policy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              <Zap size={18} style={{ color: 'var(--pastel-mint-text)' }} />
              <span>Quy tắc đánh giá năng lực & thành thạo (Mastery Policy)</span>
            </div>
            <p>
              Khác với hệ thống điểm tĩnh thông thường, CodeCoBUG theo dõi độ thành thạo kỹ năng theo chuỗi thời gian dựa trên các lần nộp bài thực tế:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Ngưỡng đạt chuẩn (Mastery Threshold):</strong> <strong>≥ 80%</strong> điểm kỹ năng.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Điểm thưởng thành công:</strong> Mỗi bài nộp đạt <code>accepted</code> cộng <strong>+35%</strong> điểm kỹ năng.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Thưởng chuỗi liên tiếp (Streak Bonus):</strong> Giải đúng liên tiếp cùng kỹ năng được cộng thêm <strong>+15%</strong> mỗi lần.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Khấu trừ khi gặp lỗi:</strong> Mỗi lần nộp bài thất bại trừ <strong>-20%</strong> và ngắt chuỗi liên tiếp.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Hàng đợi ôn tập thích ứng (Adaptive Review):</strong> Kỹ năng dưới 40% hoặc có 2 lỗi liên tiếp sẽ tự động kích hoạt bài ôn tập.
              </li>
              <li>
                <strong style={{ color: 'var(--text-primary)' }}>Đánh giá lại (Re-assessment):</strong> Hàng đợi tiếp tục mở cho đến khi học viên nộp bài đạt chuẩn để bảo đảm triệt tiêu điểm yếu.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 4: COMPREHENSIVE SUBMISSION HISTORY */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
              <History size={36} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
              <p style={{ fontWeight: 600 }}>Chưa có lần nộp bài nào được ghi nhận.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                Tiến độ và lịch sử chấm bài sẽ tự động xuất hiện tại đây sau khi bạn nộp code trong phòng lab.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Tổng cộng <strong>{allSubmissions.length}</strong> lần nộp bài</span>
                <span>Cô lập theo tài khoản người dùng</span>
              </div>

              {allSubmissions.map((sub, idx) => {
                const isAccepted = sub.verdict === 'accepted';
                const exMatch = getExerciseFromRegistry(sub.exerciseSlug);
                const title = exMatch?.exercise.title || sub.exerciseSlug;
                const chapterTitle = exMatch?.topic.title || '';
                const dateStr = new Date(sub.submittedAt).toLocaleString('vi-VN');

                return (
                  <div
                    key={sub.id}
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid ${isAccepted ? 'var(--pastel-mint)' : 'var(--pastel-peach)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 260px' }}>
                      {isAccepted ? (
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--pastel-mint-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CheckCircle2 size={18} style={{ color: 'var(--status-success-text)' }} />
                        </div>
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--pastel-peach-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <XCircle size={18} style={{ color: 'var(--status-error-text)' }} />
                        </div>
                      )}

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          #{allSubmissions.length - idx} • {chapterTitle ? `${chapterTitle} • ` : ''}{dateStr}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <Badge variant={isAccepted ? 'mint' : 'peach'} size="sm">
                        {isAccepted ? 'Accepted' : sub.verdict.toUpperCase()}
                      </Badge>

                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {sub.score}/{sub.totalPoints} pts
                      </span>

                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {sub.passedTestsCount}/{sub.totalTestsCount} tests
                      </span>

                      <Link href={`/exercises/${sub.exerciseSlug}`} style={{ textDecoration: 'none' }} onClick={onClose}>
                        <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={12} />} style={{ fontSize: '0.76rem', padding: '4px 8px' }}>
                          Làm lại
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
