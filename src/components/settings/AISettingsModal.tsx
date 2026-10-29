'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Sparkles, Check, AlertCircle, Eye, EyeOff, Trash2 } from 'lucide-react';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  temperature: number;
}

const DEFAULT_SETTINGS: AISettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.7,
};

const PROVIDER_MODELS: Record<string, { id: string; name: string }[]> = {
  gemini: [
    { id: 'gemini-1.5-flash', name: 'Google Gemini 1.5 Flash (Nhanh & Tối ưu)' },
    { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro (Suy luận sâu)' },
    { id: 'gemini-2.0-flash-exp', name: 'Google Gemini 2.0 Flash (Thử nghiệm)' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o Mini (Tiết kiệm)' },
    { id: 'gpt-4o', name: 'OpenAI GPT-4o (Đa phương thức cao cấp)' },
  ],
  anthropic: [
    { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku', name: 'Anthropic Claude 3.5 Haiku' },
  ],
  custom: [
    { id: 'custom-model', name: 'Custom OpenAI-Compatible Model' },
  ],
};

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('codecobug_ai_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: AISettings['provider']) => {
    const defaultModel = PROVIDER_MODELS[newProvider]?.[0]?.id || '';
    setSettings((prev) => ({
      ...prev,
      provider: newProvider,
      model: defaultModel,
    }));
    setTestStatus('idle');
    setStatusMessage('');
  };

  const handleTestConnection = async () => {
    if (!settings.apiKey.trim()) {
      setTestStatus('error');
      setStatusMessage('Vui lòng nhập API Key trước khi kiểm tra kết nối.');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Đang kết nối đến máy chủ AI Provider để kiểm tra khóa...');

    try {
      const response = await fetch('/api/ai/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: settings.provider,
          apiKey: settings.apiKey.trim(),
          model: settings.model,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setTestStatus('success');
        setStatusMessage(data.message || `Kết nối thành công với mô hình ${settings.model}!`);
      } else {
        setTestStatus('error');
        setStatusMessage(data?.message || 'Kiểm tra kết nối thất bại.');
      }
    } catch (err: unknown) {
      setTestStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Lỗi kết nối mạng đến máy chủ.');
    }
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('codecobug_ai_settings', JSON.stringify(settings));
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleClearKey = () => {
    if (window.confirm('Bạn có chắc muốn xóa khóa API đã lưu?')) {
      setSettings((prev) => ({ ...prev, apiKey: '' }));
      if (typeof window !== 'undefined') {
        localStorage.removeItem('codecobug_ai_settings');
      }
      setTestStatus('idle');
      setStatusMessage('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
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
          maxWidth: '540px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Key size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cài đặt AI Gia sư (BYOK)
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Bring Your Own Key — Tự cấp API key cá nhân, an toàn và riêng tư
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '6px' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Security Notice */}
          <div
            style={{
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <Shield size={16} style={{ color: 'var(--accent-light)', marginTop: '2px', flexShrink: 0 }} />
            <span>
              API Key được quản lý an toàn. Trong Giai đoạn 6, khóa sẽ được mã hóa chuẩn <strong>AES-256-GCM</strong> trước khi gửi lên AI Provider adapter.
            </span>
          </div>

          {/* Provider Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Nhà cung cấp AI (Provider)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['gemini', 'openai', 'anthropic'] as const).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => handleProviderChange(prov)}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${settings.provider === prov ? 'var(--accent-light)' : 'var(--border-subtle)'}`,
                    background: settings.provider === prov ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-tertiary)',
                    color: settings.provider === prov ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {prov === 'gemini' ? 'Google Gemini' : prov === 'openai' ? 'OpenAI' : 'Anthropic'}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Mô hình (Model)
            </label>
            <select
              value={settings.model}
              onChange={(e) => setSettings((prev) => ({ ...prev, model: e.target.value }))}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-medium)',
                outline: 'none',
                fontSize: '0.85rem',
              }}
            >
              {PROVIDER_MODELS[settings.provider]?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                API Key {settings.provider === 'gemini' ? '(Gemini)' : '(OpenAI / Claude)'}
              </label>
              {settings.apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={11} />
                  <span>Xóa key</span>
                </button>
              )}
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => {
                  setSettings((prev) => ({ ...prev, apiKey: e.target.value }));
                  setTestStatus('idle');
                  setStatusMessage('');
                }}
                placeholder={
                  settings.provider === 'gemini'
                    ? 'AIzaSy...'
                    : settings.provider === 'openai'
                    ? 'sk-proj-...'
                    : 'sk-ant-...'
                }
                style={{
                  width: '100%',
                  padding: '9px 40px 9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowKey((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title={showKey ? 'Ẩn key' : 'Hiện key'}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {settings.provider === 'gemini'
                ? 'Lấy khóa miễn phí tại: aistudio.google.com'
                : 'Lấy khóa tại bảng điều khiển nhà cung cấp của bạn.'}
            </p>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background:
                  testStatus === 'success'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : testStatus === 'error'
                    ? 'rgba(239, 68, 68, 0.12)'
                    : 'rgba(56, 189, 248, 0.12)',
                color:
                  testStatus === 'success'
                    ? '#34d399'
                    : testStatus === 'error'
                    ? '#fb7185'
                    : 'var(--accent-light)',
                border: `1px solid ${
                  testStatus === 'success'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : testStatus === 'error'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(56, 189, 248, 0.3)'
                }`,
              }}
            >
              {testStatus === 'success' && <Check size={14} />}
              {testStatus === 'error' && <AlertCircle size={14} />}
              {testStatus === 'testing' && <Sparkles size={14} />}
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-tertiary)',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
          >
            <span>{testStatus === 'testing' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Đã lưu!</span>
                </>
              ) : (
                <span>Lưu cấu hình</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
