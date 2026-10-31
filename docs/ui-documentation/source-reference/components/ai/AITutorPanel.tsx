'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Key,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Code2,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { FormattedAIResponse } from './FormattedAIResponse';
import { maskApiKey } from '@/lib/ai/crypto';
import { authManager } from '@/lib/auth/authManager';
import { MasteryEngine } from '@/lib/mastery/masteryEngine';
import { AIGeneratedExercise } from '@/lib/ai/tutorService';

export interface AITutorPanelProps {
  exerciseContext?: {
    title: string;
    slug: string;
    difficulty?: string;
    description: string;
    constraints?: string[];
    starterCode?: string;
  };
  submissionData?: {
    submittedCode: string;
    verdict?: string;
    score?: number;
    totalPoints?: number;
    errorMessage?: string;
    cleanTraceback?: string;
    failedTestInfo?: {
      orderIndex: number;
      inputData?: string;
      expectedOutput?: string;
      actualOutput?: string;
      errorMessage?: string;
    };
  };
  onOpenSettings: () => void;
  onClose?: () => void;
  onLoadExerciseCode?: (code: string, title: string) => void;
  isDrawer?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  generatedExercise?: AIGeneratedExercise;
  isError?: boolean;
}

const DEFAULT_GENERAL_EXERCISE = {
  title: 'Hỏi đáp Python Studio',
  slug: 'general-python-tutor',
  difficulty: 'beginner',
  description: 'Trợ lý học tập Python cá nhân CodeCoBUG: giải thích cú pháp, thuật toán, tư duy lập trình và phân tích lỗi.',
  constraints: [] as string[],
  starterCode: '# Viết code Python tại đây\n',
};

export const AITutorPanel: React.FC<AITutorPanelProps> = ({
  exerciseContext = DEFAULT_GENERAL_EXERCISE,
  submissionData,
  onOpenSettings,
  onClose,
  onLoadExerciseCode,
  isDrawer = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState<1 | 2 | 3>(1);
  const [aiSettings, setAiSettings] = useState<{
    provider: string;
    apiKey: string;
    model: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load configured AI settings from localStorage
  const loadStoredSettings = () => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('codecobug_ai_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setAiSettings(parsed);
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    setAiSettings(null);
    return null;
  };

  useEffect(() => {
    loadStoredSettings();
  }, []);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          text: `Chào bạn! Mình là **AI Gia Sư CodeCoBUG** 🤖✨\n\nMình đồng hành cùng bạn học Python theo nguyên tắc sư phạm: **hướng dẫn tư duy, phân tích nguyên nhân lỗi và gợi ý bậc thang**, tuyệt đối không giải hộ bài. Bạn có thể hỏi bất kỳ câu hỏi nào về Python hoặc sử dụng các nút hành động bên dưới!`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [messages.length]);

  // Compute empirical weaknesses for rich weakness analysis
  const getEmpiricalWeaknesses = () => {
    try {
      const submissions = authManager.getAllUserSubmissions();
      if (submissions.length > 0) {
        const report = MasteryEngine.computeMastery(submissions);
        if (report.recurringWeaknesses && report.recurringWeaknesses.length > 0) {
          return report.recurringWeaknesses.slice(0, 4).map((w) => ({
            category: w.category,
            title: w.title,
            count: w.count,
          }));
        }
      }
    } catch {
      // fallback
    }
    return undefined;
  };

  // Dispatch API request to /api/ai/chat
  const handleSendRequest = async (
    action: 'explain_error' | 'get_hint' | 'analyze_weakness' | 'generate_exercise' | 'chat',
    customQuery?: string,
    specificHintLevel?: 1 | 2 | 3
  ) => {
    if (isLoading) return;

    const currentConfig = loadStoredSettings();

    // Enforce BYOK credentials
    if (!currentConfig || !currentConfig.apiKey || !currentConfig.apiKey.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: `warn-${Date.now()}`,
          role: 'assistant',
          text: `🔑 **Chưa cấu hình API Key (BYOK)**\n\nCodeCoBUG sử dụng mô hình Bring Your Own Key để đảm bảo an toàn riêng tư và không lưu khóa trên máy chủ. Vui lòng bấm vào nút **Cài đặt API Key** để thiết lập khóa cá nhân (Google Gemini, OpenAI, Anthropic).`,
          timestamp: Date.now(),
          isError: true,
        },
      ]);
      onOpenSettings();
      return;
    }

    const queryToSend = customQuery || inputQuery.trim();

    // Display user bubble for chat queries or actions
    let actionLabel = queryToSend;
    if (!customQuery) {
      if (action === 'explain_error') actionLabel = '🔍 Hãy giải thích lỗi trong mã nguồn của tôi';
      else if (action === 'get_hint') actionLabel = `💡 Cho tôi gợi ý bài tập (Mức ${specificHintLevel || hintLevel})`;
      else if (action === 'analyze_weakness') actionLabel = '📊 Phân tích điểm yếu và lỗi thường gặp của tôi';
      else if (action === 'generate_exercise') actionLabel = '✨ Hãy tạo một bài tập tự luyện tương tự';
    }

    if (actionLabel) {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          text: actionLabel,
          timestamp: Date.now(),
        },
      ]);
    }

    setInputQuery('');
    setIsLoading(true);

    try {
      const payloadSubmission = submissionData
        ? {
            ...submissionData,
            overallWeaknesses: getEmpiricalWeaknesses(),
          }
        : {
            submittedCode: '',
            overallWeaknesses: getEmpiricalWeaknesses(),
          };

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: currentConfig,
          action,
          exerciseContext: {
            title: exerciseContext.title,
            slug: exerciseContext.slug,
            difficulty: exerciseContext.difficulty,
            description: exerciseContext.description,
            constraints: exerciseContext.constraints,
            starterCode: exerciseContext.starterCode,
          },
          submissionData: payloadSubmission,
          userPrompt: customQuery || (action === 'chat' ? queryToSend : undefined),
          hintLevel: specificHintLevel || hintLevel,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: data.text,
            timestamp: Date.now(),
            generatedExercise: data.generatedExercise,
          },
        ]);

        if (action === 'get_hint') {
          setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 1));
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-err-${Date.now()}`,
            role: 'assistant',
            text: `⚠️ **Thông báo lỗi từ hệ thống:**\n\n${data?.error || 'Không thể nhận phản hồi từ nhà cung cấp AI.'}`,
            timestamp: Date.now(),
            isError: true,
          },
        ]);
      }
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : String(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-neterr-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Lỗi kết nối:** Không thể gửi yêu cầu đến máy chủ AI (${errStr}). Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.`,
          timestamp: Date.now(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine contextual smart suggested prompt chips
  const hasError = !!(submissionData?.cleanTraceback || submissionData?.errorMessage);
  const suggestedPrompts = hasError
    ? [
        { label: '🔍 Vì sao code báo lỗi?', action: () => handleSendRequest('explain_error') },
        { label: `💡 Gợi ý Mức ${hintLevel}`, action: () => handleSendRequest('get_hint') },
        { label: '📊 Phân tích lỗi sai', action: () => handleSendRequest('analyze_weakness') },
        { label: '❓ Cách kiểm tra kiểu dữ liệu?', query: 'Cách kiểm tra và ép kiểu dữ liệu trong Python?' },
        { label: '✨ Tạo bài tương tự', action: () => handleSendRequest('generate_exercise') },
      ]
    : [
        { label: `💡 Gợi ý làm bài (Mức ${hintLevel})`, action: () => handleSendRequest('get_hint') },
        { label: '🎯 Lưu ý điều kiện biên', query: 'Trong bài này cần lưu ý các trường hợp biên hoặc dữ liệu ngoại lệ nào?' },
        { label: '📝 Cách dùng input() và split()', query: 'Giải thích cách đọc nhiều số trên cùng 1 dòng bằng input() và split()?' },
        { label: '📊 Điểm yếu của tôi', action: () => handleSendRequest('analyze_weakness') },
        { label: '✨ Tạo bài tương tự', action: () => handleSendRequest('generate_exercise') },
      ];

  const hasApiKey = !!(aiSettings?.apiKey && aiSettings.apiKey.trim());

  return (
    <div
      className="ai-tutor-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: isDrawer ? '380px' : '100%',
        backgroundColor: 'var(--bg-surface)',
        borderLeft: isDrawer ? '1px solid var(--border-subtle)' : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Bar */}
      <div
        className="pane-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--pastel-lavender-light)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--pastel-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--pastel-lavender-text)',
            }}
          >
            <Bot size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                AI Tutor Studio
              </span>
              <Badge variant="lavender" size="sm">
                Sư phạm
              </Badge>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              {exerciseContext.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
            onClick={onOpenSettings}
            title="Cài đặt khóa AI (BYOK) & Mô hình"
          >
            <Key size={15} style={{ color: hasApiKey ? 'var(--status-success-text)' : 'var(--status-warning-text)' }} />
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
            onClick={() => {
              setMessages([
                {
                  id: `reset-${Date.now()}`,
                  role: 'assistant',
                  text: 'Đã làm mới phiên hỏi đáp cùng AI Gia Sư. Bạn muốn trao đổi về vấn đề nào?',
                  timestamp: Date.now(),
                },
              ]);
            }}
            title="Xóa lịch sử hội thoại"
          >
            <RotateCcw size={14} />
          </button>

          {onClose && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
              onClick={onClose}
              title="Đóng bảng AI Tutor"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* 2. BYOK Status Bar */}
      <div
        style={{
          padding: '8px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: hasApiKey ? 'var(--pastel-mint-light)' : 'var(--pastel-yellow-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.76rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hasApiKey ? (
            <>
              <ShieldCheck size={14} style={{ color: 'var(--status-success-text)' }} />
              <span style={{ color: 'var(--pastel-mint-text)', fontWeight: 600 }}>
                {aiSettings?.provider.toUpperCase()}: {aiSettings?.model} ({maskApiKey(aiSettings?.apiKey || '')})
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={14} style={{ color: 'var(--status-warning-text)' }} />
              <span style={{ color: 'var(--status-warning-text)', fontWeight: 600 }}>
                Chưa cấu hình API Key cá nhân
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--pastel-lavender-text)',
            fontWeight: 700,
            fontSize: '0.74rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          {hasApiKey ? 'Đổi cấu hình' : 'Thiết lập ngay'}
        </button>
      </div>

      {/* 3. Pedagogical Quick Actions Bar */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-primary)',
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
          Hành động sư phạm nhanh:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSendRequest('explain_error')}
            className="btn btn-secondary"
            style={{
              padding: '6px 8px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'flex-start',
              borderRadius: 'var(--radius-md)',
              border: hasError ? '1px solid var(--pastel-peach)' : '1px solid var(--border-subtle)',
              backgroundColor: hasError ? 'var(--pastel-peach-light)' : 'var(--bg-surface)',
            }}
            title="Đọc lỗi thực tế và phân tích nguyên nhân"
          >
            <AlertTriangle size={13} style={{ color: 'var(--status-error)' }} />
            <span style={{ fontWeight: hasError ? 700 : 500 }}>Giải thích lỗi</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSendRequest('get_hint')}
            className="btn btn-secondary"
            style={{
              padding: '6px 8px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'flex-start',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
            }}
            title={`Gợi ý bậc thang Mức ${hintLevel}`}
          >
            <Lightbulb size={13} style={{ color: 'var(--status-warning)' }} />
            <span>Gợi ý (Mức {hintLevel})</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSendRequest('analyze_weakness')}
            className="btn btn-secondary"
            style={{
              padding: '6px 8px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'flex-start',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
            }}
            title="Tổng hợp lỗi thường gặp từ bài làm thực tế"
          >
            <HelpCircle size={13} style={{ color: 'var(--pastel-sky-text)' }} />
            <span>Phân tích điểm yếu</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSendRequest('generate_exercise')}
            className="btn btn-secondary"
            style={{
              padding: '6px 8px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'flex-start',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
            }}
            title="Sinh bài tập tự luyện tương tự"
          >
            <Sparkles size={13} style={{ color: 'var(--pastel-lavender-text)' }} />
            <span>Tạo bài tương tự</span>
          </button>
        </div>
      </div>

      {/* 4. Chat Messages Scroll Area */}
      <div
        className="ai-messages-scroll"
        style={{
          flex: 1,
          padding: '14px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  maxWidth: '92%',
                  padding: '10px 14px',
                  borderRadius: isUser
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  backgroundColor: isUser
                    ? 'var(--pastel-mint-light)'
                    : msg.isError
                    ? 'var(--pastel-peach-light)'
                    : 'var(--pastel-lavender-light)',
                  border: isUser
                    ? '1px solid var(--pastel-mint)'
                    : msg.isError
                    ? '1px solid var(--pastel-peach)'
                    : '1px solid var(--pastel-lavender)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xs)',
                  wordBreak: 'break-word',
                }}
              >
                {/* Header label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isUser
                      ? 'var(--pastel-mint-text)'
                      : msg.isError
                      ? 'var(--status-error)'
                      : 'var(--pastel-lavender-text)',
                    marginBottom: '4px',
                  }}
                >
                  {isUser ? (
                    <span>Bạn</span>
                  ) : (
                    <>
                      <Bot size={13} />
                      <span>AI Tutor</span>
                    </>
                  )}
                </div>

                {/* Render formatted message content */}
                <FormattedAIResponse content={msg.text} />

                {/* AI Generated Exercise Card */}
                {msg.generatedExercise && (
                  <Card
                    variant="yellow"
                    style={{
                      marginTop: '10px',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {msg.generatedExercise.title}
                      </div>
                      <Badge variant="yellow" size="sm">
                        Chưa kiểm chứng (Unverified)
                      </Badge>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {msg.generatedExercise.description}
                    </div>

                    {msg.generatedExercise.examples && msg.generatedExercise.examples.length > 0 && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          padding: '8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.74rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>Ví dụ minh họa:</div>
                        <div>
                          <strong>Input:</strong> <code>{msg.generatedExercise.examples[0].inputData}</code>
                        </div>
                        <div>
                          <strong>Output:</strong> <code>{msg.generatedExercise.examples[0].expectedOutput}</code>
                        </div>
                      </div>
                    )}

                    {onLoadExerciseCode && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const gen = msg.generatedExercise;
                          if (gen && onLoadExerciseCode) {
                            onLoadExerciseCode(gen.starterCode, gen.title);
                          }
                        }}
                        leftIcon={<Code2 size={13} />}
                        style={{ alignSelf: 'flex-start', marginTop: '2px' }}
                      >
                        Thử bài tập này trên Editor
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '18px 18px 18px 4px',
              backgroundColor: 'var(--pastel-lavender-light)',
              border: '1px solid var(--pastel-lavender)',
              maxWidth: '85%',
              alignSelf: 'flex-start',
            }}
          >
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite', color: 'var(--pastel-lavender-text)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--pastel-lavender-text)', fontWeight: 600 }}>
              AI Gia Sư đang phân tích mã nguồn và ngữ cảnh sư phạm...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 5. Suggested Question Prompt Chips */}
      <div
        style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          flexWrap: 'nowrap',
          gap: '6px',
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {suggestedPrompts.map((p, idx) => (
          <button
            key={`prompt-${idx}`}
            type="button"
            disabled={isLoading}
            onClick={() => {
              if (p.action) {
                p.action();
              } else if (p.query) {
                handleSendRequest('chat', p.query);
              }
            }}
            className="ai-prompt-chip"
            style={{
              flexShrink: 0,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--pastel-sky-light)',
              border: '1px solid var(--pastel-sky)',
              color: 'var(--pastel-sky-text)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-base)',
              whiteSpace: 'nowrap',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 6. Natural Language Question Input */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={inputQuery}
          disabled={isLoading}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendRequest('chat');
          }}
          placeholder="Hỏi AI Gia sư về bài tập này..."
          className="form-input"
          style={{
            flex: 1,
            padding: '9px 14px',
            fontSize: '0.84rem',
            borderRadius: 'var(--radius-md)',
          }}
        />

        <Button
          variant="mint"
          size="sm"
          disabled={isLoading || !inputQuery.trim()}
          onClick={() => handleSendRequest('chat')}
          style={{ padding: '0 16px' }}
          title="Gửi câu hỏi tới AI Tutor"
        >
          {isLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
        </Button>
      </div>
    </div>
  );
};
