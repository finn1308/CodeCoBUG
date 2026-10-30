import { NextRequest, NextResponse } from 'next/server';
import { AITutorService, AITutorRequest } from '@/lib/ai/tutorService';
import { redactApiKey } from '@/lib/ai/crypto';

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce payload size limit (max 64KB to prevent payload flooding)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 65536) {
      return NextResponse.json(
        { success: false, error: 'Kích thước yêu cầu vượt quá giới hạn cho phép (64KB).' },
        { status: 413 }
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON.' },
        { status: 400 }
      );
    }

    const { config, action, exerciseContext, submissionData, userPrompt, hintLevel } = body;

    // 2. Validate mandatory credentials & configuration
    if (!config || !config.apiKey || !config.apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chưa cấu hình API Key. Vui lòng nhấn vào biểu tượng Cài đặt AI để nhập khóa (BYOK).',
        },
        { status: 401 }
      );
    }

    if (!exerciseContext || !exerciseContext.title) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin ngữ cảnh bài tập (exerciseContext).' },
        { status: 400 }
      );
    }

    const tutorRequest: AITutorRequest = {
      config: {
        provider: config.provider || 'gemini',
        apiKey: String(config.apiKey).trim(),
        model: config.model || (config.provider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini'),
        temperature: typeof config.temperature === 'number' ? config.temperature : 0.7,
        baseUrl: config.baseUrl,
      },
      action: action || 'chat',
      exerciseContext,
      submissionData,
      userPrompt,
      hintLevel: hintLevel || 1,
    };

    // 3. Process via pedagogical AI Tutor Engine
    const result = await AITutorService.processRequest(tutorRequest);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: redactApiKey(result.error || 'Không thể tạo phản hồi từ AI.', config.apiKey),
        },
        { status: 400 }
      );
    }

    // 4. Return safe, redacted response
    return NextResponse.json({
      success: true,
      text: redactApiKey(result.text, config.apiKey),
      generatedExercise: result.generatedExercise,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Lỗi xử lý AI không xác định.';
    return NextResponse.json(
      { success: false, error: redactApiKey(errorMsg) },
      { status: 500 }
    );
  }
}
