import { NextRequest, NextResponse } from 'next/server';
import { getServerExerciseTests } from '@/lib/judge/testCasesRepository';
import { evaluateSubmission } from '@/lib/judge/runner';
import { getExerciseBySlug } from '@/lib/fixtures/sampleCurriculum';
import { getServerAuthenticatedUser } from '@/lib/auth/serverAuth';
import { saveAuthoritativeSubmission, getAuthoritativeSubmissions } from '@/lib/judge/submissionStore';
import { ReviewEngine } from '@/lib/mastery/reviewEngine';

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

    // 2. Safe JSON Body Extraction & Validation
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Dữ liệu yêu cầu không đúng định dạng JSON (Invalid JSON payload).' },
        { status: 400 }
      );
    }

    const { exerciseSlug, code } = body;

    if (!exerciseSlug || typeof exerciseSlug !== 'string' || !exerciseSlug.trim()) {
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

    if (code.length > 100000) {
      return NextResponse.json(
        { error: 'Mã nguồn vượt quá dung lượng cho phép (100KB).' },
        { status: 413 }
      );
    }

    const testConfig = getServerExerciseTests(exerciseSlug.trim());
    if (!testConfig) {
      return NextResponse.json(
        { error: `Không tìm thấy cấu hình test case cho bài tập: ${exerciseSlug}` },
        { status: 404 }
      );
    }

    // Get exercise points metadata
    const exerciseMeta = getExerciseBySlug(exerciseSlug.trim());
    const points = exerciseMeta?.exercise.points ?? 10;
    const exerciseId = exerciseMeta?.exercise.id ?? testConfig.exerciseId;

    // Evaluate submission through Judge Engine
    const report = await evaluateSubmission(testConfig, code, points);

    // 3. Authoritative Server-Side Persistence
    // Attributed strictly to the verified authenticatedUser.id!
    const savedSubmission = await saveAuthoritativeSubmission({
      userId: authenticatedUser.id,
      exerciseId: exerciseId,
      exerciseSlug: exerciseSlug.trim(),
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

    // 4. Update authoritative review recommendations
    try {
      const userSubs = await getAuthoritativeSubmissions(authenticatedUser.id);
      ReviewEngine.syncReviewQueue(authenticatedUser.id, userSubs as any);
    } catch (syncErr) {
      console.warn('[ReviewQueue AutoSync Warning]:', syncErr);
    }

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
      { error: 'Lỗi máy chủ khi chấm bài.' },
      { status: 500 }
    );
  }
}
