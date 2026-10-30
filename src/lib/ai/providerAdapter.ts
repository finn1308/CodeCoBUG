import { redactApiKey } from './crypto';

export type AIProviderType = 'gemini' | 'openai' | 'anthropic' | 'custom';

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey: string;
  model: string;
  temperature?: number;
  baseUrl?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  config: AIProviderConfig;
  messages: AIMessage[];
  maxTokens?: number;
}

export interface AIProviderResponse {
  success: boolean;
  content: string;
  modelUsed: string;
  error?: string;
  rawError?: string;
}

export class AIProviderAdapter {
  /**
   * Main completion router across providers
   */
  public static async generateCompletion(request: AICompletionRequest): Promise<AIProviderResponse> {
    const { config, messages } = request;
    const { provider, apiKey, model } = config;

    if (!apiKey || !apiKey.trim()) {
      return {
        success: false,
        content: '',
        modelUsed: model,
        error: 'Chưa cung cấp API Key. Vui lòng cấu hình API Key trong mục Cài đặt AI.',
      };
    }

    try {
      if (provider === 'gemini') {
        return await this.callGemini(config, messages, request.maxTokens);
      } else if (provider === 'openai') {
        return await this.callOpenAI(config, messages, request.maxTokens);
      } else if (provider === 'anthropic') {
        return await this.callAnthropic(config, messages, request.maxTokens);
      } else {
        return await this.callOpenAICompatible(config, messages, request.maxTokens);
      }
    } catch (err: unknown) {
      const rawMessage = err instanceof Error ? err.message : String(err);
      const safeMessage = redactApiKey(rawMessage, apiKey);

      return {
        success: false,
        content: '',
        modelUsed: model,
        error: this.formatFriendlyError(safeMessage, provider),
        rawError: safeMessage,
      };
    }
  }

  /**
   * Google Gemini Provider (Official REST API v1beta)
   */
  private static async callGemini(
    config: AIProviderConfig,
    messages: AIMessage[],
    maxTokens = 2048
  ): Promise<AIProviderResponse> {
    const model = config.model || 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;

    // Separate system instruction from conversation history
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    // Convert messages to Gemini contents structure
    const contents = conversationMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const requestBody: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: maxTokens,
      },
    };

    if (systemMessage) {
      requestBody.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorDetail = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini API Error: ${errorDetail} (Status: ${response.status})`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Không nhận được nội dung phản hồi từ mô hình Gemini.');
    }

    return {
      success: true,
      content: candidateText,
      modelUsed: model,
    };
  }

  /**
   * OpenAI Provider (Official REST API /v1/chat/completions)
   */
  private static async callOpenAI(
    config: AIProviderConfig,
    messages: AIMessage[],
    maxTokens = 2048
  ): Promise<AIProviderResponse> {
    const model = config.model || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: config.temperature ?? 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorDetail = errorJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`OpenAI API Error: ${errorDetail} (Status: ${response.status})`);
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;

    if (!messageContent) {
      throw new Error('Không nhận được nội dung phản hồi từ OpenAI.');
    }

    return {
      success: true,
      content: messageContent,
      modelUsed: model,
    };
  }

  /**
   * Anthropic Claude Provider (Official REST API /v1/messages)
   */
  private static async callAnthropic(
    config: AIProviderConfig,
    messages: AIMessage[],
    maxTokens = 2048
  ): Promise<AIProviderResponse> {
    const model = config.model || 'claude-3-5-sonnet-20241022';
    const url = 'https://api.anthropic.com/v1/messages';

    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system: systemMessage?.content || undefined,
        messages: conversationMessages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorDetail = errorJson?.error?.message || `HTTP ${response.status}`;
      throw new Error(`Anthropic API Error: ${errorDetail}`);
    }

    const data = await response.json();
    const content = data?.content?.[0]?.text;

    if (!content) {
      throw new Error('Không nhận được phản hồi từ Claude.');
    }

    return {
      success: true,
      content,
      modelUsed: model,
    };
  }

  /**
   * Generic OpenAI-compatible Provider (e.g. Local LLM, Groq, OpenRouter)
   */
  private static async callOpenAICompatible(
    config: AIProviderConfig,
    messages: AIMessage[],
    maxTokens = 2048
  ): Promise<AIProviderResponse> {
    const baseUrl = (config.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
    const url = `${baseUrl}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: config.temperature ?? 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorDetail = errorJson?.error?.message || `HTTP ${response.status}`;
      throw new Error(`Custom API Error: ${errorDetail}`);
    }

    const data = await response.json();
    const messageContent = data?.choices?.[0]?.message?.content;

    return {
      success: true,
      content: messageContent || '',
      modelUsed: config.model,
    };
  }

  /**
   * Real Connection Test against provider
   */
  public static async testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }> {
    if (!config.apiKey || !config.apiKey.trim()) {
      return { success: false, message: 'Vui lòng nhập API Key trước khi kiểm tra.' };
    }

    // Format pre-flight validation
    const trimmedKey = config.apiKey.trim();
    if (config.provider === 'gemini' && !trimmedKey.startsWith('AIza') && !trimmedKey.startsWith('AQ.')) {
      return {
        success: false,
        message: 'Định dạng API Key Gemini không hợp lệ (Khóa từ Google AI Studio bắt đầu bằng "AIza" hoặc "AQ.").',
      };
    }
    if (config.provider === 'openai' && !config.apiKey.startsWith('sk-')) {
      return {
        success: false,
        message: 'Định dạng API Key OpenAI không hợp lệ (Khóa bắt đầu bằng "sk-").',
      };
    }

    // Send a minimal ping query to verify real credentials against provider API
    const pingMessages: AIMessage[] = [
      { role: 'user', content: 'Ping. Phản hồi lại từ "PONG" nếu nhận được.' },
    ];

    const result = await this.generateCompletion({
      config,
      messages: pingMessages,
      maxTokens: 10,
    });

    if (result.success) {
      return {
        success: true,
        message: `Kết nối thành công với nhà cung cấp ${config.provider.toUpperCase()} (Mô hình: ${config.model})!`,
      };
    } else {
      return {
        success: false,
        message: result.error || 'Kiểm tra kết nối thất bại.',
      };
    }
  }

  /**
   * Convert technical API errors into helpful educational Vietnamese messages
   */
  private static formatFriendlyError(errorMsg: string, provider: AIProviderType): string {
    const lower = errorMsg.toLowerCase();

    if (lower.includes('401') || lower.includes('invalid_api_key') || lower.includes('api key not valid')) {
      return `API Key ${provider.toUpperCase()} không chính xác hoặc đã bị thu hồi. Vui lòng kiểm tra lại khóa trong Cài đặt AI.`;
    }
    if (lower.includes('403') || lower.includes('permission_denied') || lower.includes('has not enabled the')) {
      return `Tài khoản hoặc API Key chưa được cấp quyền truy cập mô hình này. Vui lòng kiểm tra quyền trên bảng điều khiển Google AI Studio / OpenAI.`;
    }
    if (lower.includes('429') || lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
      return `Đã vượt quá hạn mức sử dụng (Quota / Rate Limit) của ${provider.toUpperCase()}. Vui lòng đợi trong giây lát hoặc kiểm tra quota trên tài khoản của bạn.`;
    }
    if (lower.includes('404') || lower.includes('model not found')) {
      return `Mô hình AI được chọn không tồn tại hoặc không còn được hỗ trợ bởi ${provider.toUpperCase()}.`;
    }
    if (lower.includes('fetch failed') || lower.includes('network') || lower.includes('econnrefused')) {
      return 'Không thể kết nối đến máy chủ AI Provider (Lỗi mạng hoặc kết nối bị gián đoạn).';
    }

    return `Lỗi từ nhà cung cấp AI: ${errorMsg}`;
  }
}
