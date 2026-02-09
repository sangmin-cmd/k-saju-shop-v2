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

// MBTI 옵션
const MBTI_OPTIONS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // 주문자 정보
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    
    // 사주 분석용 개인정보
    birthDate: '', // YYYY-MM-DD
    birthCalendar: 'solar' as 'solar' | 'lunar', // 양력/음력
    birthTime: '12:00', // HH:MM
    mbti: '', // MBTI 유형
    
    // 약관 동의
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

    // 주문자 정보 검증
    if (!formData.customerName.trim()) {
      newErrors.customerName = '이름을 입력해주세요';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = '이메일을 입력해주세요';
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = '올바른 이메일 형식이 아닙니다';
    }

    // 전화번호는 선택사항, 입력했을 때만 형식 검증
    if (formData.customerPhone.trim()) {
      const phoneRegex = /^01[0-9]{8,9}$/;
      const cleanPhone = formData.customerPhone.replace(/-/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.customerPhone = '올바른 휴대폰 번호를 입력해주세요 (예: 01012345678)';
      }
    }

    // 사주 분석용 정보 검증
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = '생년월일을 입력해주세요';
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.birthDate)) {
        newErrors.birthDate = '올바른 날짜 형식이 아닙니다 (예: 1990-01-01)';
      } else {
        const [year, month, day] = formData.birthDate.split('-').map(Number);
        if (year < 1900 || year > 2026) {
          newErrors.birthDate = '연도는 1900-2026 사이여야 합니다';
        }
        if (month < 1 || month > 12) {
          newErrors.birthDate = '월은 1-12 사이여야 합니다';
        }
        if (day < 1 || day > 31) {
          newErrors.birthDate = '일은 1-31 사이여야 합니다';
        }
      }
    }

    if (!formData.birthTime.trim()) {
      newErrors.birthTime = '출생 시간을 입력해주세요';
    } else {
      const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.birthTime)) {
        newErrors.birthTime = '올바른 시간 형식이 아닙니다 (예: 14:30)';
      }
    }

    if (!formData.mbti.trim()) {
      newErrors.mbti = 'MBTI 유형을 선택해주세요';
    }

    // 약관 동의 검증
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
        
        // 사주 분석용 개인정보 추가
        birthDate: formData.birthDate,
        birthCalendar: formData.birthCalendar,
        birthTime: formData.birthTime,
        mbti: formData.mbti,
        
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
      
      // 주문 정보 저장 (사주 분석용 개인정보 포함)
      const orderData = {
        orderId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        
        // 사주 분석용 개인정보 추가
        birthDate: formData.birthDate,
        birthCalendar: formData.birthCalendar,
        birthTime: formData.birthTime,
        mbti: formData.mbti,
        
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
          console.log('TossPayments SDK loaded');
          setIsSDKReady(true);
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">주문/결제</h1>
            <p className="text-gray-600 mt-2">정확한 사주 분석을 위해 정보를 입력해주세요</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 주문자 정보 + 사주 분석 정보 입력 */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. 주문자 정보 */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                    주문자 정보
                  </h2>
                  
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
                      <p className="text-sm text-gray-500 mt-1">📧 결과물이 발송될 이메일입니다</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        휴대폰 번호 <span className="text-gray-400">(선택)</span>
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
                      <p className="text-sm text-gray-500 mt-1">📞 입력하지 않아도 주문 가능합니다</p>
                    </div>
                  </div>
                </div>

                {/* 2. 사주 분석 정보 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6 border-2 border-purple-200">
                  <h2 className="text-xl font-bold mb-2 flex items-center">
                    <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">2</span>
                    사주 분석을 위한 정보
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">🔮 정확한 분석을 위해 필요합니다</p>
                  
                  <div className="space-y-4">
                    {/* 생년월일 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        생년월일 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.birthDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="1900-01-01"
                        max="2026-12-31"
                      />
                      {errors.birthDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                      )}
                    </div>

                    {/* 양력/음력 선택 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        양력/음력 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="birthCalendar"
                            value="solar"
                            checked={formData.birthCalendar === 'solar'}
                            onChange={(e) => setFormData({...formData, birthCalendar: 'solar'})}
                            className="mr-2"
                          />
                          <span className="text-sm">☀️ 양력</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="birthCalendar"
                            value="lunar"
                            checked={formData.birthCalendar === 'lunar'}
                            onChange={(e) => setFormData({...formData, birthCalendar: 'lunar'})}
                            className="mr-2"
                          />
                          <span className="text-sm">🌙 음력</span>
                        </label>
                      </div>
                    </div>

                    {/* 출생 시간 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        출생 시간 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.birthTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.birthTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.birthTime}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">⏰ 모르시면 12:00으로 입력하세요</p>
                    </div>

                    {/* MBTI 선택 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MBTI 유형 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.mbti}
                        onChange={(e) => setFormData({...formData, mbti: e.target.value})}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          errors.mbti ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">MBTI 유형을 선택하세요</option>
                        {MBTI_OPTIONS.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.mbti && (
                        <p className="text-red-500 text-sm mt-1">{errors.mbti}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        🧠 모르시면 <a href="https://www.16personalities.com/ko" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">여기서 검사</a>하세요
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. 결제 방법 */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">3</span>
                    결제 방법
                  </h2>
                  
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
                      <span className="font-semibold">🏦 무통장 입금</span>
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
                      <span className="font-semibold">💳 카드 결제</span>
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

                {/* 4. 약관 동의 */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">4</span>
                    약관 동의
                  </h2>
                  
                  <div className="space-y-3">
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

                {/* 안내 사항 */}
                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium mb-2">📋 주문 후 절차</p>
                  <ul className="text-xs text-purple-600 space-y-1">
                    <li>1. 결제 완료</li>
                    <li>2. 입력하신 정보로 분석 진행</li>
                    <li>3. 24시간 내 이메일 발송</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
