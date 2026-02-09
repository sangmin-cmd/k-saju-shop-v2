'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../components/CartProvider';

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  // 🔮 사주 분석용 개인정보
  birthDate?: string;
  birthCalendar?: 'solar' | 'lunar';
  birthTime?: string;
  mbti?: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
}

export default function TransferCompletePage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  // 계좌 정보 (결제 완료 단계에서만 노출)
  const bankInfo = {
    bank: '하나은행',
    account: '928-910087-34107',
    holder: '이상민',
  };

  useEffect(() => {
    const stored = localStorage.getItem('transferOrder');
    if (stored) {
      const order = JSON.parse(stored);
      setOrderData(order);
      clearCart(); // 장바구니 비우기
      
      // 🎯 관리자에게 이메일 발송 (한 번만)
      if (!notificationSent) {
        sendAdminNotification(order);
      }
    } else {
      // 주문 정보 없으면 메인으로
      router.push('/');
    }
  }, [notificationSent]);

  // 관리자 알림 발송 함수 (개인정보 포함)
  const sendAdminNotification = async (order: OrderData) => {
    try {
      const response = await fetch('/api/admin-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.orderId,
          amount: order.totalAmount,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          
          // 🔮 사주 분석용 개인정보 추가
          birthDate: order.birthDate || '',
          birthCalendar: order.birthCalendar || 'solar',
          birthTime: order.birthTime || '',
          mbti: order.mbti || '',
          
          products: order.items.map(item => ({
            name: item.product.name,
            price: item.product.price
          })),
        }),
      });
      
      if (response.ok) {
        setNotificationSent(true);
        console.log('관리자 알림 발송 완료 (개인정보 포함)');
      }
    } catch (error) {
      console.error('관리자 알림 발송 실패:', error);
      // 알림 실패해도 고객 화면에는 영향 없음
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(bankInfo.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">주문 정보 확인중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 주문 완료 헤더 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✔</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">주문이 완료되었습니다</h1>
          <p className="text-gray-600 mt-2">아래 계좌로 입금해주시면 확인 후 서비스를 제공해드립니다.</p>
        </div>

        {/* 입금 계좌 정보 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🏦</span> 입금 계좌 정보
          </h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">은행</span>
              <span className="font-semibold text-lg">{bankInfo.bank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">계좌번호</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg font-mono">{bankInfo.account}</span>
                <button
                  onClick={copyAccount}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  {copied ? '복사됨!' : '복사'}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">예금주</span>
              <span className="font-semibold text-lg">{bankInfo.holder}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-blue-200">
              <span className="text-gray-600">입금금액</span>
              <span className="font-bold text-xl text-blue-600">{orderData.totalAmount.toLocaleString()}원</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>📌 입금자명 안내:</strong> 입금 시 입금자명을 <strong>'{orderData.customerName}'</strong>으로 해주세요.
              다른 이름으로 입금 시 확인이 지연될 수 있습니다.
            </p>
          </div>
        </div>

        {/* 🔮 사주 분석 정보 확인 */}
        {orderData.birthDate && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-purple-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700">
              <span>🔮</span> 분석 정보 확인
            </h2>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-purple-200">
                  <span className="text-gray-600">생년월일</span>
                  <span className="font-semibold text-purple-700">{orderData.birthDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-200">
                  <span className="text-gray-600">양력/음력</span>
                  <span className="font-semibold text-purple-700">
                    {orderData.birthCalendar === 'solar' ? '☀️ 양력' : '🌙 음력'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-200">
                  <span className="text-gray-600">출생시간</span>
                  <span className="font-semibold text-purple-700">{orderData.birthTime}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">MBTI</span>
                  <span className="font-bold text-purple-700 text-lg">{orderData.mbti}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-purple-100 rounded-lg">
              <p className="text-xs text-purple-700 text-center">
                ✨ 이 정보로 맞춤 분석을 진행합니다
              </p>
            </div>
          </div>
        )}

        {/* 주문 정보 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">주문 정보</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">주문번호</span>
              <span className="font-mono text-gray-800">{orderData.orderId}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">주문자</span>
              <span>{orderData.customerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">이메일</span>
              <span>{orderData.customerEmail}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">연락처</span>
              <span>{orderData.customerPhone}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">주문일시</span>
              <span>{new Date(orderData.createdAt).toLocaleString('ko-KR')}</span>
            </div>
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">주문 상품</h2>
          
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                </div>
                <span className="font-semibold">{item.product.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t flex justify-between">
            <span className="font-bold">총 결제금액</span>
            <span className="font-bold text-xl text-blue-600">{orderData.totalAmount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 안내사항 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📋 안내사항</h2>
          
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>입금 확인 후 <strong>24시간 이내</strong>에 이메일로 결과를 발송해드립니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>입금 확인은 평일 오전 9시 ~ 오후 6시에 처리됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>주말/공휴일에 입금하신 경우, 다음 영업일에 확인됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>결과 발송 전 환불을 원하시면 7일 이내 연락해주세요.</span>
            </li>
          </ul>
        </div>

        {/* 알림 발송 상태 */}
        {notificationSent && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-green-700">
              ✅ 주문 정보가 관리자에게 전달되었습니다
            </p>
          </div>
        )}

        {/* 문의 정보 */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-2">문의가 필요하신가요?</p>
          <p className="font-semibold">이메일: fatemate2026@gmail.com</p>
          <p className="font-semibold">전화: 070-8065-5466</p>
        </div>

        {/* 버튼 */}
        <div className="mt-8 flex gap-4">
          <Link 
            href="/"
            className="flex-1 py-3 text-center bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            홈으로
          </Link>
          <Link 
            href="/products"
            className="flex-1 py-3 text-center bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            다른 상품 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
