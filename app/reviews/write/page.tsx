'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WriteReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    rating: 0,
    content: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = '주문번호를 입력해주세요.';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (formData.rating === 0) {
      newErrors.rating = '별점을 선택해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '후기 내용을 작성해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '후기는 최소 10자 이상 작성해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // API 호출 예시 (실제 구현 시 사용)
      /*
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('후기 제출에 실패했습니다.');
      }
      */

      // 임시: 콘솔에 데이터 출력
      console.log('제출된 후기:', formData);

      // 성공 메시지 표시
      alert('후기가 성공적으로 제출되었습니다!\n관리자 승인 후 게시됩니다.');
      
      // 후기 목록으로 이동
      router.push('/reviews');
    } catch (error) {
      alert('후기 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <Link 
            href="/reviews"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            후기 목록으로 돌아가기
          </Link>
          <h1 className="text-4xl font-bold mb-2">후기 작성</h1>
          <p className="text-gray-600">구매하신 상품에 대한 솔직한 후기를 작성해주세요.</p>
        </div>

        {/* 안내 사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">후기 작성 안내</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>작성하신 후기는 관리자 승인 후 게시됩니다.</li>
                <li>구매 확인을 위해 주문번호가 필요합니다.</li>
                <li>개인정보 보호를 위해 이름은 일부 가려져 표시됩니다.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 후기 작성 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* 주문번호 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주문번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.orderNumber}
              onChange={(e) => {
                setFormData({ ...formData, orderNumber: e.target.value });
                setErrors({ ...errors, orderNumber: '' });
              }}
              placeholder="예: ORD-20240120-XXXXX"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.orderNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.orderNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.orderNumber}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              주문 완료 이메일에서 확인하실 수 있습니다.
            </p>
          </div>

          {/* 이메일 (선택) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일 (선택)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              후기 관련 문의 시 연락받으실 이메일을 입력해주세요.
            </p>
          </div>

          {/* 별점 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              별점 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-110"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* 후기 내용 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              후기 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => {
                setFormData({ ...formData, content: e.target.value });
                setErrors({ ...errors, content: '' });
              }}
              placeholder="상품에 대한 솔직한 후기를 작성해주세요. (최소 10자)"
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.content.length}자
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '제출 중...' : '후기 제출'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
