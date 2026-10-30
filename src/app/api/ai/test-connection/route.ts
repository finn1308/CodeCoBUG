import { NextRequest, NextResponse } from 'next/server';
import { AIProviderAdapter, AIProviderConfig } from '@/lib/ai/providerAdapter';
import { redactApiKey } from '@/lib/ai/crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu yêu cầu không hợp lệ (Invalid JSON payload).' },
        { status: 400 }
      );
    }

    const { provider, apiKey, model, baseUrl } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đầy đủ thông tin Provider và API Key.' },
        { status: 400 }
      );
    }

    const config: AIProviderConfig = {
      provider,
      apiKey: String(apiKey).trim(),
      model: model || (provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini'),
      baseUrl,
    };

    const testResult = await AIProviderAdapter.testConnection(config);

    return NextResponse.json({
      success: testResult.success,
      message: redactApiKey(testResult.message, config.apiKey),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Lỗi máy chủ nội bộ.';
    return NextResponse.json(
      { success: false, message: redactApiKey(errorMsg) },
      { status: 500 }
    );
  }
}
