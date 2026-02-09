import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// 관리자 이메일 주소
const ADMIN_EMAIL = 'fatemate2026@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message } = body;

    // 필수 항목 검증
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: '모든 항목을 입력해주세요' },
        { status: 400 }
      );
    }

    // 이메일 HTML 생성
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>새 문의 접수</title>
      </head>
      <body style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">📩 새 문의가 접수되었습니다</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
            <strong style="color: #92400e;">⚡ 새 문의 확인 필요</strong>
          </div>
          
          <h2 style="color: #374151; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📋 문의 정보</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold; width: 120px;">문의 유형</td>
              <td style="padding: 10px; color: #667eea; font-weight: bold;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold;">문의자</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold;">이메일</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9fafb; font-weight: bold;">접수일시</td>
              <td style="padding: 10px;">${new Date().toLocaleString('ko-KR')}</td>
            </tr>
          </table>
          
          <h2 style="color: #374151; border-bottom: 2px solid #667eea; padding-bottom: 10px;">📝 문의 내용</h2>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #374151;">${subject}</h3>
            <div style="white-space: pre-wrap; color: #4b5563; line-height: 1.6;">
${message}
            </div>
          </div>
          
          <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
            <p style="margin: 0; color: #065f46; font-size: 16px;">
              <strong>📧 답변 보내기:</strong><br>
              <a href="mailto:${email}" style="color: #10b981; text-decoration: none; font-weight: bold;">${email}</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>K-Saju 문의 시스템</p>
          <p style="margin: 5px 0;">sajutype.kr</p>
        </div>
      </body>
      </html>
    `;

    // 관리자에게 이메일 발송
    const { data, error } = await resend.emails.send({
      from: 'K-Saju <noreply@sajutype.kr>',
      to: ADMIN_EMAIL,
      subject: `📩 [${category}] ${subject} - ${name}님`,
      html: emailHtml,
      // 답장 주소 설정
      replyTo: email,
    });

    if (error) {
      console.error('Contact email error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Contact email sent:', data?.id);

    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      message: '문의가 성공적으로 전송되었습니다' 
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: '문의 전송 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
