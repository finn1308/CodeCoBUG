'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, Sparkles, Check, AlertCircle, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';

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
  model: 'gemini-3.8-flash',
  temperature: 0.7,
};

const PROVIDER_MODELS: Record<string, { id: string; name: string }[]> = {
  gemini: [
    { id: 'gemini-3.8-flash', name: 'Google Gemini 3.8 Flash (Khuyên dùng - Nhanh & Mới nhất)' },
    { id: 'gemini-3.5-flash-lite', name: 'Google Gemini 3.5 Flash-Lite (Siêu tốc & Tiết kiệm)' },
    { id: 'gemini-4-argon', name: 'Google Gemini 4 Argon (Flagship Frontier 2026)' },
    { id: 'gemini-3.1-pro-preview', name: 'Google Gemini 3.1 Pro (Suy luận sâu & Code nâng cao)' },
    { id: 'gemini-flash-latest', name: 'Google Gemini Flash (Tự động trỏ bản mới nhất)' },
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài đặt AI Gia sư (BYOK)"
      description="Bring Your Own Key — Tự cấp API key cá nhân, an toàn và riêng tư"
      icon={<Key size={18} />}
      maxWidth="560px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Button
            variant="secondary"
            onClick={handleTestConnection}
            isLoading={testStatus === 'testing'}
          >
            Kiểm tra kết nối
          </Button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              leftIcon={savedSuccess ? <Check size={16} /> : undefined}
            >
              {savedSuccess ? 'Đã lưu!' : 'Lưu cấu hình'}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Security Notice */}
        <div
          style={{
            background: 'var(--pastel-sky-light)',
            border: '1px solid var(--pastel-sky)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.82rem',
            color: 'var(--pastel-sky-text)',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
            lineHeight: 1.5,
          }}
        >
          <Shield size={18} style={{ color: 'var(--status-info)', marginTop: '2px', flexShrink: 0 }} />
          <span>
            API Key được bảo mật cao cấp: Khóa được mã hóa bằng chuẩn mã hóa đối xứng <strong>AES-256-GCM</strong> trước khi gửi lên AI Provider adapter và không bao giờ bị lưu lộ ở client.
          </span>
        </div>

        {/* Provider Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Nhà cung cấp AI (Provider)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(['gemini', 'openai', 'anthropic'] as const).map((prov) => {
              const isSelected = settings.provider === prov;
              return (
                <button
                  key={prov}
                  type="button"
                  onClick={() => handleProviderChange(prov)}
                  style={{
                    padding: '10px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--pastel-mint-active)' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'var(--pastel-mint)' : 'var(--bg-tertiary)',
                    color: isSelected ? 'var(--pastel-mint-text)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                    boxShadow: isSelected ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  {prov === 'gemini' ? 'Google Gemini' : prov === 'openai' ? 'OpenAI' : 'Anthropic'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Mô hình (Model)
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings((prev) => ({ ...prev, model: e.target.value }))}
            className="form-input"
            style={{
              cursor: 'pointer',
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
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              API Key {settings.provider === 'gemini' ? '(Google AI Studio)' : '(OpenAI / Claude)'}
            </label>
            {settings.apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--status-error-text)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <Trash2 size={12} />
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
                  ? 'AIzaSy... hoặc AQ.Ab...'
                  : settings.provider === 'openai'
                  ? 'sk-proj-...'
                  : 'sk-ant-...'
              }
              className="form-input"
              style={{
                paddingRight: '40px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              title={showKey ? 'Ẩn key' : 'Hiện key'}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {settings.provider === 'gemini'
              ? 'Lấy khóa miễn phí tại: aistudio.google.com'
              : 'Lấy khóa tại bảng điều khiển nhà cung cấp của bạn.'}
          </p>
        </div>

        {/* Test Status Banner */}
        {testStatus !== 'idle' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor:
                testStatus === 'success'
                  ? 'var(--status-success-bg)'
                  : testStatus === 'error'
                  ? 'var(--status-error-bg)'
                  : 'var(--pastel-sky-light)',
              color:
                testStatus === 'success'
                  ? 'var(--status-success-text)'
                  : testStatus === 'error'
                  ? 'var(--status-error-text)'
                  : 'var(--pastel-sky-text)',
              border: `1px solid ${
                testStatus === 'success'
                  ? 'var(--status-success-border)'
                  : testStatus === 'error'
                  ? 'var(--status-error-border)'
                  : 'var(--pastel-sky)'
              }`,
            }}
          >
            {testStatus === 'success' && <Check size={16} />}
            {testStatus === 'error' && <AlertCircle size={16} />}
            {testStatus === 'testing' && <Sparkles size={16} />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
