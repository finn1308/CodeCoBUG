'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Zap,
  Info,
} from 'lucide-react';
import { authManager } from '@/lib/auth/authManager';
import { MasteryEngine, LearnerMasteryReport } from '@/lib/mastery/masteryEngine';
import { ReviewEngine, ReviewItem } from '@/lib/mastery/reviewEngine';

interface WeaknessTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeaknessTrackerModal: React.FC<WeaknessTrackerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'queue' | 'policy'>('skills');
  const [masteryReport, setMasteryReport] = useState<LearnerMasteryReport | null>(null);
  const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
  const [completedReviews, setCompletedReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const user = authManager.getCurrentUser();
    if (!user) return;

    const userSubmissions = authManager.getAllUserSubmissions();
    const report = MasteryEngine.computeMastery(userSubmissions);
    setMasteryReport(report);

    // Sync real-time review queue from submission evidence
    ReviewEngine.syncReviewQueue(user.id, userSubmissions);
    const pending = ReviewEngine.getPendingReviews(user.id);
    const completed = ReviewEngine.getCompletedReviews(user.id);

    setReviewQueue(pending);
    setCompletedReviews(completed);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 11, 20, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Target size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Theo dõi điểm yếu & Ôn tập thích ứng
                </h2>
                {masteryReport && (
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-light)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    {masteryReport.overallMasteryPercentage}% Thành thạo
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                Dữ liệu năng lực tính toán 100% dựa trên lịch sử nộp bài thực tế
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-primary)',
            padding: '4px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '8px',
          }}
        >
          <button
            type="button"
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'skills' ? 'var(--accent-light)' : 'transparent'}`,
              color: activeTab === 'skills' ? 'var(--accent-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => setActiveTab('skills')}
          >
            <TrendingUp size={14} />
            <span>Kỹ năng & Điểm yếu</span>
          </button>

          <button
            type="button"
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'queue' ? 'var(--accent-light)' : 'transparent'}`,
              color: activeTab === 'queue' ? 'var(--accent-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => setActiveTab('queue')}
          >
            <Clock size={14} />
            <span>Hàng đợi ôn tập ({reviewQueue.length})</span>
          </button>

          <button
            type="button"
            style={{
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === 'policy' ? 'var(--accent-light)' : 'transparent'}`,
              color: activeTab === 'policy' ? 'var(--accent-light)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onClick={() => setActiveTab('policy')}
          >
            <Info size={14} />
            <span>Chính sách thành thạo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {/* TAB 1: SKILLS & RECURRING WEAKNESSES */}
          {activeTab === 'skills' && masteryReport && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stat Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
                    {masteryReport.masteredCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Đã thành thạo (≥80%)</div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                    {masteryReport.inProgressCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Đang rèn luyện (40-79%)</div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fb7185' }}>
                    {masteryReport.weakCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cần củng cố (&lt;40%)</div>
                </div>
              </div>

              {/* Recurring Weakness Alert Banner */}
              {masteryReport.recurringWeaknesses.length > 0 && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                  }}
                >
                  <ShieldAlert size={18} style={{ color: '#fb7185', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#fb7185' }}>
                      Phát hiện điểm yếu lặp lại (Recurring Weaknesses):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {masteryReport.recurringWeaknesses.map((w) => (
                        <span
                          key={w.category}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#fb7185',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {w.title} ({w.count} lần mắc)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Progress List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
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
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            {skill.skillName}
                          </span>
                          <span
                            style={{
                              marginLeft: '8px',
                              fontSize: '0.68rem',
                              color: 'var(--text-muted)',
                              background: 'var(--bg-primary)',
                              padding: '1px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {skill.category}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: isMastered
                                ? 'rgba(16, 185, 129, 0.15)'
                                : isWeak
                                ? 'rgba(239, 68, 68, 0.15)'
                                : isUntested
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(56, 189, 248, 0.15)',
                              color: isMastered
                                ? '#34d399'
                                : isWeak
                                ? '#fb7185'
                                : isUntested
                                ? 'var(--text-muted)'
                                : 'var(--accent-light)',
                            }}
                          >
                            {isMastered
                              ? 'THÀNH THẠO'
                              : isWeak
                              ? 'CẦN ÔN TẬP'
                              : isUntested
                              ? 'CHƯA KIỂM TRA'
                              : 'ĐANG RÈN LUYỆN'}
                          </span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {skill.masteryScore}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div
                        style={{
                          height: '6px',
                          background: 'var(--bg-primary)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${skill.masteryScore}%`,
                            background: isMastered
                              ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                              : isWeak
                              ? 'linear-gradient(90deg, #ef4444 0%, #fb7185 100%)'
                              : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>{skill.description}</span>
                        <span>
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
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Hàng đợi ôn tập thích ứng (Đề xuất dựa trên lỗi thực tế)
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Hệ thống tự động đẩy các bài tập học viên từng làm sai hoặc có kỹ năng yếu vào hàng đợi này. Khi học viên nộp bài đạt, bài tập sẽ được tự động chuyển sang mục Hoàn thành.
                </div>
              </div>

              {reviewQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={36} style={{ margin: '0 auto 10px', color: '#34d399', opacity: 0.8 }} />
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Không có bài tập cần ôn lại!</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Tất cả các bài tập bạn từng làm đều đã đạt chuẩn hoặc bạn chưa nộp bài thử nào.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reviewQueue.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: `1px solid ${item.priority === 1 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(251, 191, 36, 0.35)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {item.exerciseTitle}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: item.priority === 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                              color: item.priority === 1 ? '#fb7185' : '#fbbf24',
                            }}
                          >
                            {item.priority === 1 ? 'ƯU TIÊN CAO' : 'CỦNG CỐ'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                          {item.reasonDescription}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Mục tiêu: Kỹ năng [{item.targetSkillName}]
                        </div>
                      </div>

                      <Link
                        href={`/exercises/${item.exerciseSlug}`}
                        onClick={onClose}
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>Ôn tập ngay</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Reviews Evidence */}
              {completedReviews.length > 0 && (
                <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Đã hoàn thành sau khi ôn luyện ({completedReviews.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {completedReviews.map((done) => (
                      <div
                        key={done.id}
                        style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.78rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={14} style={{ color: '#34d399' }} />
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{done.exerciseTitle}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({done.targetSkillName})</span>
                        </div>
                        <span style={{ color: '#34d399', fontSize: '0.72rem', fontWeight: 600 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  <Zap size={16} style={{ color: 'var(--accent-light)' }} />
                  <span>Quy tắc đánh giá năng lực & thành thạo (Mastery Policy)</span>
                </div>
                <p>
                  Khác với hệ thống điểm tĩnh thông thường, CodeCoBUG theo dõi độ thành thạo kỹ năng theo chuỗi thời gian dựa trên các lần nộp bài thực tế:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    <strong>Ngưỡng đạt chuẩn (Mastery Threshold):</strong> <strong>≥ 80%</strong> điểm kỹ năng.
                  </li>
                  <li>
                    <strong>Điểm thưởng thành công:</strong> Mỗi bài nộp đạt <code>accepted</code> cộng <strong>+35%</strong> điểm kỹ năng.
                  </li>
                  <li>
                    <strong>Thưởng chuỗi liên tiếp (Streak Bonus):</strong> Giải đúng liên tiếp cùng kỹ năng được cộng thêm <strong>+15%</strong> mỗi lần.
                  </li>
                  <li>
                    <strong>Khấu trừ khi gặp lỗi:</strong> Mỗi lần nộp bài thất bại trừ <strong>-20%</strong> và ngắt chuỗi liên tiếp.
                  </li>
                  <li>
                    <strong>Hàng đợi ôn tập thích ứng (Adaptive Review):</strong> Kỹ năng dưới 40% hoặc có 2 lỗi liên tiếp sẽ tự động kích hoạt bài ôn tập.
                  </li>
                  <li>
                    <strong>Đánh giá lại (Re-assessment):</strong> Hàng đợi tiếp tục mở cho đến khi học viên nộp bài đạt chuẩn để bảo đảm triệt tiêu điểm yếu.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
