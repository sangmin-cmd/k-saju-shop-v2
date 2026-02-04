import { NextRequest, NextResponse } from 'next/server';

// 🔑 토스페이먼츠 시크릿 키
const TOSS_SECRET_KEY = 'live_sk_0RnYX2w532wJvnEmWAqeVNeyqApQ';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    console.log('=== 토스 결제 승인 시작 ===');
    console.log('paymentKey:', paymentKey);
    console.log('orderId:', orderId);
    console.log('amount:', amount);

    // 토스페이먼츠 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('=== 토스 승인 실패 ===');
      console.error('Status:', response.status);
      console.error('Error:', result);
      
      return NextResponse.json(
        { 
          error: result.message || '결제 승인에 실패했습니다.',
          code: result.code 
        },
        { status: response.status }
      );
    }

    console.log('=== 토스 승인 성공 ===');
    console.log('Result:', result);

    return NextResponse.json({
      success: true,
      payment: result,
    });

  } catch (error) {
    console.error('=== 결제 승인 오류 ===');
    console.error(error);
    
    return NextResponse.json(
      { error: '결제 승인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
