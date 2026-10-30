import { NextRequest, NextResponse } from 'next/server';
import { getServerExerciseTests } from '@/lib/judge/testCasesRepository';
import { evaluateSubmission } from '@/lib/judge/runner';
import { getExerciseBySlug } from '@/lib/fixtures/sampleCurriculum';
import { getServerAuthenticatedUser } from '@/lib/auth/serverAuth';
import { saveAuthoritativeSubmission } from '@/lib/judge/submissionStore';

export async function POST(req: NextRequest) {
  try {
    // 1. Authoritative Server-Side User Authentication & Authorization Check
    const authenticatedUser = await getServerAuthenticatedUser(req);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Yêu cầu đăng nhập để chấm và lưu kết quả bài nộp.' },
        { status: 401 }
      );
    }

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
    const exerciseId = exerciseMeta?.exercise.id ?? testConfig.exerciseId;

    // Evaluate submission through Judge Engine
    const report = await evaluateSubmission(testConfig, code, points);

    // 2. Authoritative Server-Side Persistence
    // Attributed strictly to the verified authenticatedUser.id!
    const savedSubmission = await saveAuthoritativeSubmission({
      userId: authenticatedUser.id,
      exerciseId: exerciseId,
      exerciseSlug: exerciseSlug,
      submittedCode: code,
      verdict: report.verdict,
      score: report.score,
      totalPoints: report.totalPoints,
      passedTestsCount: report.passedTestsCount,
      totalTestsCount: report.totalTestsCount,
      executionTimeMs: report.totalExecutionTimeMs,
      errorDetails: report.verdictMessage,
      testResults: report.testResults.map((tr) => ({
        testCaseId: tr.testCaseId,
        orderIndex: tr.orderIndex,
        isPassed: tr.isPassed,
        inputData: tr.inputData,
        expectedOutput: tr.expectedOutput,
        errorMessage: tr.errorMessage,
      })),
    });

    return NextResponse.json(
      {
        ...report,
        savedSubmission,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Judge Submit API Error]', err);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi chấm bài: ' + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
