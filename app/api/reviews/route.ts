import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
const reviews: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, email, rating, content } = body;

    // 유효성 검사
    if (!orderNumber || !rating || !content) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '별점은 1~5점 사이여야 합니다.' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: '후기는 최소 10자 이상 작성해주세요.' },
        { status: 400 }
      );
    }

    // 주문번호 검증 (실제로는 데이터베이스에서 확인)
    // 예시: K-SAJU-20250202-XXXXX 형식 확인
    if (!orderNumber.match(/^[A-Z]+-[A-Z]+-\d{8}-[A-Z0-9]+$/)) {
      return NextResponse.json(
        { error: '올바른 주문번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 실제 구현 시:
    // 1. 주문번호로 구매 내역 확인
    // 2. 이미 후기를 작성했는지 확인
    // 3. 데이터베이스에 저장 (승인 대기 상태로)
    // 4. 관리자에게 알림 이메일 발송

    // 임시 저장
    const newReview = {
      id: Date.now(),
      orderNumber,
      email: email || null,
      rating,
      content,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    // TODO: 실제 구현 시
    // await db.reviews.create({ data: newReview });
    // await sendEmailToAdmin(newReview);

    return NextResponse.json(
      {
        success: true,
        message: '후기가 성공적으로 제출되었습니다. 관리자 승인 후 게시됩니다.',
        reviewId: newReview.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: '후기 제출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // 승인된 후기만 반환
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  return NextResponse.json({
    reviews: approvedReviews,
    total: approvedReviews.length,
  });
}
