'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Award, HelpCircle } from 'lucide-react';
import { Modal, Button, Card, Badge } from '@/components/ui';
import { DIAGNOSTIC_QUESTIONS } from '@/lib/learning-path/diagnosticQuestions';
import { DiagnosticResult, LearningGoalType, LearningPace } from '@/lib/types/learningPath';
import { PathRecommendationEngine } from '@/lib/learning-path/recommendationEngine';

export interface DiagnosticAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (diagnostic: DiagnosticResult, goal: LearningGoalType, pace: LearningPace) => void;
}

export const DiagnosticAssessmentModal: React.FC<DiagnosticAssessmentModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<'goal' | 'quiz' | 'result'>('goal');
  const [selectedGoal, setSelectedGoal] = useState<LearningGoalType>('start_from_scratch');
  const [selectedPace, setSelectedPace] = useState<LearningPace>('standard');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluatedResult, setEvaluatedResult] = useState<DiagnosticResult | null>(null);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === DIAGNOSTIC_QUESTIONS.length - 1;

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Evaluate results
      const res = PathRecommendationEngine.evaluateDiagnostic(answers);
      setEvaluatedResult(res);
      setStep('result');
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    if (evaluatedResult) {
      onComplete(evaluatedResult, selectedGoal, selectedPace);
      onClose();
    }
  };

  const goalOptions: { id: LearningGoalType; title: string; desc: string; icon: string }[] = [
    {
      id: 'start_from_scratch',
      title: 'Học từ số 0 (Mới bắt đầu)',
      desc: 'Dành cho người mới toanh, đi từ căn bản nhập môn, biến, phép toán đến khi tự tin làm chủ Python.',
      icon: '🌱',
    },
    {
      id: 'reinforce_basics',
      title: 'Củng cố nền tảng & Lấp lỗ hổng',
      desc: 'Đã từng học qua nhưng hay quên cú pháp, chưa chắc cấu trúc dữ liệu hoặc vòng lặp.',
      icon: '🧱',
    },
    {
      id: 'practice_mastery',
      title: 'Luyện bài tập & Tư duy giải thuật',
      desc: 'Tập trung giải các bài toán tư duy, rèn luyện kỹ năng clean code và tối ưu hóa.',
      icon: '⚡',
    },
    {
      id: 'prepare_projects',
      title: 'Chuẩn bị làm 3 Dự án thực chiến',
      desc: 'Tập trung trang bị nhanh các kỹ năng OOP, File I/O để bước vào làm Game Pygame, Web & Data.',
      icon: '🚀',
    },
  ];

  const paceOptions: { id: LearningPace; title: string; desc: string }[] = [
    { id: 'relaxed', title: 'Thư giãn (1-2 bài/ngày)', desc: 'Phù hợp khi bận rộn' },
    { id: 'standard', title: 'Tiêu chuẩn (3-5 bài/ngày)', desc: 'Lộ trình tối ưu cho teen' },
    { id: 'intensive', title: 'Tốc lực (6+ bài/ngày)', desc: 'Tiến độ nhanh, thử thách cao' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--pastel-mint-text)' }} />
          <span>Khảo sát Trình độ & Thiết lập Lộ trình</span>
        </div>
      }
      maxWidth="680px"
    >
      <div style={{ padding: '4px 0' }}>
        {/* STEP 1: CHỌN MỤC TIÊU & TỐC ĐỘ */}
        {step === 'goal' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '18px' }}>
              Hãy chọn mục tiêu và tốc độ học tập phù hợp nhất với bạn để CodeCoBUG cá nhân hóa lộ trình học:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                1. Mục tiêu học tập chính:
              </div>
              {goalOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedGoal(opt.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: selectedGoal === opt.id ? '2px solid var(--pastel-mint-text)' : '1px solid var(--border-medium)',
                    backgroundColor: selectedGoal === opt.id ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all var(--transition-base)',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </div>
                  {selectedGoal === opt.id && (
                    <CheckCircle2 size={18} style={{ color: 'var(--pastel-mint-text)' }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                2. Tốc độ mong muốn:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {paceOptions.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPace(p.id)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedPace === p.id ? '2px solid var(--pastel-sky-text)' : '1px solid var(--border-medium)',
                      backgroundColor: selectedPace === p.id ? 'var(--pastel-sky-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginTop: '2px' }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="ghost" onClick={onClose}>
                Để sau
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep('quiz')}
                rightIcon={<ArrowRight size={16} />}
              >
                Bắt đầu bài kiểm tra năng lực (8 câu)
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: BÀI TEST 8 CÂU */}
        {step === 'quiz' && currentQ && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <Badge variant="mint" size="sm">
                Câu {currentQuestionIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
              </Badge>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Đánh giá: Chặng {currentQ.stageWeight}
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', marginBottom: '16px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${((currentQuestionIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                  backgroundColor: 'var(--pastel-mint-text)',
                  transition: 'width var(--transition-base)',
                }}
              />
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {currentQ.question}
            </div>

            {currentQ.codeSnippet && (
              <pre
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-code)',
                  color: '#A6E3A1',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.86rem',
                  marginBottom: '16px',
                  overflowX: 'auto',
                }}
              >
                {currentQ.codeSnippet}
              </pre>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--pastel-mint-text)' : '1px solid var(--border-medium)',
                      backgroundColor: isSelected ? 'var(--pastel-mint-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: isSelected ? 'var(--pastel-mint-text)' : 'var(--bg-tertiary)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      }}
                    >
                      {opt.id.toUpperCase()}
                    </div>
                    <span>{opt.text}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                leftIcon={<ArrowLeft size={16} />}
              >
                Câu trước
              </Button>
              <Button
                variant="primary"
                onClick={handleNextQuestion}
                disabled={!answers[currentQ.id]}
                rightIcon={<ArrowRight size={16} />}
              >
                {isLastQuestion ? 'Hoàn thành đánh giá' : 'Câu tiếp theo'}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: KẾT QUẢ & ĐỀ XUẤT LỘ TRÌNH */}
        {step === 'result' && evaluatedResult && (
          <div>
            <div style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pastel-mint)',
                  color: 'var(--pastel-mint-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Hoàn Thành Khảo Sát Năng Lực!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Đạt <strong style={{ color: 'var(--pastel-mint-text)' }}>{evaluatedResult.score}%</strong> ({evaluatedResult.correctCount}/{evaluatedResult.totalQuestions} câu đúng) — Xếp loại: <strong>{evaluatedResult.assessedLevel.toUpperCase()}</strong>
              </p>
            </div>

            {evaluatedResult.skippedStages.length > 0 ? (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--pastel-mint-light)',
                  border: '1px solid var(--pastel-mint)',
                  marginBottom: '18px',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--pastel-mint-text)', marginBottom: '4px' }}>
                  🎉 Bạn đủ điều kiện bỏ qua các chặng đã thành thạo:
                </div>
                <div>
                  Hệ thống tự động đánh dấu hoàn thành <strong>Chặng {evaluatedResult.skippedStages.join(', ')}</strong> và đưa bạn thẳng tới bài học thích hợp nhất!
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--pastel-sky-light)',
                  border: '1px solid var(--pastel-sky)',
                  marginBottom: '18px',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--pastel-sky-text)', marginBottom: '4px' }}>
                  ✨ Bắt đầu từ Chặng 1 để xây nền tảng vững chắc
                </div>
                <div>
                  Bạn sẽ đi tuần tự từ làm quen cú pháp, nhập xuất dữ liệu đến các cấu trúc nâng cao theo lộ trình chuẩn.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button variant="primary" onClick={handleFinish} rightIcon={<ArrowRight size={16} />}>
                Xem Bản Đồ Lộ Trình Của Tôi
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

