'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../components/CartProvider';
import { useAuth } from '../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    TossPayments: any;
  }
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // 🔑 토스페이먼츠 라이브 클라이언트 키
  const clientKey = 'live_ck_6BYq7GWPVvN4G0OLvX9aVNE5vbo1';

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: user.phone || '',
      }));
    }
  }, [user]);

  // SDK 로딩 확인
  useEffect(() => {
    const checkSDK = () => {
      if (typeof window !== 'undefined' && window.TossPayments) {
        console.log('TossPayments SDK loaded successfully');
        setIsSDKReady(true);
        setSdkError(null);
      }
    };

    checkSDK();

    const timeout = setTimeout(() => {
      if (!window.TossPayments) {
        setSdkError('결제 모듈 로딩 실패. 페이지를 새로고침해주세요.');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <Link href="/products" className="btn-primary mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">
            상품 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '이메일을 입력해주세요';
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식이 아닙니다';
    }

    const phoneRegex = /^01[0-9]{8,9}$/;
    const cleanPhone = formData.customerPhone.replace(/-/g, '');
    if (formData.customerPhone.trim() && !phoneRegex.test(cleanPhone)) {
      newErrors.customerPhone = '올바른 휴대폰 번호를 입력해주세요 (예: 01012345678)';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요';
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보 처리방침에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 무통장 입금 처리
  const handleBankTransfer = async () => {
    if (!validate()) {
      alert('입력 정보를 확인해주세요');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const orderData = {
        orderId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        items: items,
        totalAmount: totalAmount,
        paymentMethod: 'transfer',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('transferOrder', JSON.stringify(orderData));

      // 주문 완료 페이지로 이동
      router.push('/payment/transfer-complete');
      
    } catch (error) {
      console.error('주문 처리 오류:', error);
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 카드 결제 처리
  const handleCardPayment = async () => {
    console.log('=== 결제 시작 ===');

    if (!validate()) {
      alert('입력 정보를 확인해주세요');
      return;
    }

    if (!isSDKReady) {
      alert('결제 모듈이 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!window.TossPayments) {
      alert('결제 모듈을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 주문 정보 저장
      const orderData = {
        orderId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      const tossPayments = window.TossPayments(clientKey);
      
      await tossPayments.requestPayment('카드', {
        amount: totalAmount,
        orderId: orderId,
        orderName: items.length > 1 
          ? `${items[0].product.name} 외 ${items.length - 1}건`
          : items[0].product.name,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerMobilePhone: formData.customerPhone,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

    } catch (error: any) {
      console.error('결제 오류:', error);
      
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else if (error.message) {
        alert(`결제 오류: ${error.message}`);
      } else {
        alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'transfer') {
      handleBankTransfer();
    } else {
      handleCardPayment();
    }
  };

  return (
    <>
      <Script 
        src="https://js.tosspayments.com/v1/payment"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Toss Payments script loaded');
          setIsSDKReady(true);
        }}
        onError={() => {
          console.error('Toss Payments script failed to load');
          setSdkError('결제 모듈 로딩 실패');
        }}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
            <p className="text-gray-600 mt-2">주문 정보를 확인하고 결제를 진행해주세요</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 왼쪽: 주문자 정보 입력 */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                {/* 주문자 정보 */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">주문자 정보</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.customerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="홍길동"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">결과물이 발송될 이메일입니다</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        휴대폰 번호
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="01012345678"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 결제 방법 */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">결제 방법</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* 무통장 입금 */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === 'transfer'}
                        onChange={() => setPaymentMethod('transfer')}
                        className="mr-2"
                      />
                      <span className="font-semibold">무통장 입금</span>
                    </button>

                    {/* 카드 결제 */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mr-2"
                      />
                      <span className="font-semibold">카드 결제</span>
                    </button>
                  </div>

                  {sdkError && paymentMethod === 'card' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">{sdkError}</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        주문 완료 후 계좌 정보를 안내드립니다. 입금 확인 후 24시간 이내 결과물이 발송됩니다.
                      </p>
                    </div>
                  )}
                </div>

                {/* 약관 동의 */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="agreeTerms" className="text-sm">
                      <Link href="/terms" className="text-blue-600 hover:underline">이용약관</Link>에 동의합니다 
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-red-500 text-sm ml-6">{errors.agreeTerms}</p>
                  )}

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({...formData, agreePrivacy: e.target.checked})}
                      className="mt-1 mr-2"
                    />
                    <label htmlFor="agreePrivacy" className="text-sm">
                      <Link href="/privacy" className="text-blue-600 hover:underline">개인정보 처리방침</Link>에 동의합니다 
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  {errors.agreePrivacy && (
                    <p className="text-red-500 text-sm ml-6">{errors.agreePrivacy}</p>
                  )}
                </div>

                {/* 결제 버튼 */}
                <button
                  type="submit"
                  disabled={isProcessing || (paymentMethod === 'card' && !isSDKReady)}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                    isProcessing || (paymentMethod === 'card' && !isSDKReady)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : paymentMethod === 'transfer'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessing 
                    ? '처리중...' 
                    : paymentMethod === 'transfer'
                    ? `${totalAmount.toLocaleString()}원 주문하기`
                    : `${totalAmount.toLocaleString()}원 결제하기`
                  }
                </button>
              </form>
            </div>

            {/* 오른쪽: 주문 상품 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">주문 상품</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-4 border-b">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.product.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-gray-800">{item.product.price.toLocaleString()}원</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총 결제금액</span>
                    <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
