import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthenticatedUser } from '@/lib/auth/serverAuth';
import { ReviewEngine } from '@/lib/mastery/reviewEngine';
import { getAuthoritativeSubmissions } from '@/lib/judge/submissionStore';

export async function GET(req: NextRequest) {
  try {
    const authenticatedUser = await getServerAuthenticatedUser(req);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Yêu cầu đăng nhập để truy cập hàng đợi ôn tập.' },
        { status: 401 }
      );
    }

    const pending = ReviewEngine.getPendingReviews(authenticatedUser.id);
    const completed = ReviewEngine.getCompletedReviews(authenticatedUser.id);

    return NextResponse.json(
      {
        userId: authenticatedUser.id,
        pending,
        completed,
        totalPending: pending.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Review Queue API Error]', err);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi truy xuất hàng đợi ôn tập.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authenticatedUser = await getServerAuthenticatedUser(req);
    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Yêu cầu đăng nhập để đồng bộ hàng đợi ôn tập.' },
        { status: 401 }
      );
    }

    // Sync from server authoritative submissions
    const submissions = await getAuthoritativeSubmissions(authenticatedUser.id);
    const updated = ReviewEngine.syncReviewQueue(authenticatedUser.id, submissions);

    return NextResponse.json(
      {
        success: true,
        userId: authenticatedUser.id,
        reviewQueue: updated,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[Review Queue Sync Error]', err);
    return NextResponse.json(
      { error: 'Lỗi máy chủ khi đồng bộ hàng đợi ôn tập.' },
      { status: 500 }
    );
  }
}

