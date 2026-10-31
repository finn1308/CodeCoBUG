import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/lib/auth/serverAuth';
import { getAuthoritativeSubmissions } from '@/lib/judge/submissionStore';

/**
 * Submissions Query API
 * Enforces strict multi-tenant authorization:
 * A learner can ONLY access their own submissions!
 */
export async function GET(req: NextRequest) {
  try {
    const authenticatedUser = await getServerAuthenticatedUser(req);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Yêu cầu đăng nhập để truy cập lịch sử nộp bài.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get('exerciseSlug');
    const exerciseSlug = rawSlug && rawSlug.trim().length > 0 ? rawSlug.trim() : undefined;

    // Strict multi-tenant: Query using verified authenticatedUser.id only!
    const submissions = await getAuthoritativeSubmissions(
      authenticatedUser.id,
      exerciseSlug
    );

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (err) {
    console.error('[Submissions API Error]', err);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi truy xuất bài nộp.' },
      { status: 500 }
    );
  }
}

