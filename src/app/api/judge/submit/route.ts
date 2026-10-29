import { NextRequest, NextResponse } from 'next/server';
import { getServerExerciseTests } from '@/lib/judge/testCasesRepository';
import { evaluateSubmission } from '@/lib/judge/runner';
import { getExerciseBySlug } from '@/lib/fixtures/sampleCurriculum';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exerciseSlug, code } = body;

    if (!exerciseSlug || typeof exerciseSlug !== 'string') {
      return NextResponse.json(
        { error: 'Thiếu hoặc sai định dạng exerciseSlug' },
        { status: 400 }
      );
    }

    if (typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Mã nguồn nộp bài không hợp lệ' },
        { status: 400 }
      );
    }

    const testConfig = getServerExerciseTests(exerciseSlug);
    if (!testConfig) {
      return NextResponse.json(
        { error: `Không tìm thấy cấu hình test case cho bài tập: ${exerciseSlug}` },
        { status: 404 }
      );
    }

    // Get exercise points metadata
    const exerciseMeta = getExerciseBySlug(exerciseSlug);
    const points = exerciseMeta?.exercise.points ?? 10;

    // Evaluate submission through Judge Engine
    const report = await evaluateSubmission(testConfig, code, points);

    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    console.error('[Judge Submit API Error]', err);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi chấm bài: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
