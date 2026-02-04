'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: number;
  orderNumber: string;
  email?: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  name?: string;
  product?: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // 실제로는 관리자 API 호출
      // const response = await fetch('/api/admin/reviews');
      // const data = await response.json();
      
      // 임시 데이터
      const mockReviews: Review[] = [
        {
          id: 1,
          orderNumber: 'K-SAJU-20250202-ABC123',
          email: 'user@example.com',
          rating: 5,
          content: '정말 좋았습니다! MBTI와 사주가 잘 맞아서 신기했어요.',
          status: 'pending',
          createdAt: '2025-02-02T10:30:00',
          name: '김**',
          product: 'K-Saju 프리미엄'
        },
        {
          id: 2,
          orderNumber: 'FATEMATE-20250201-XYZ789',
          email: 'user2@example.com',
          rating: 4,
          content: '궁합 분석이 자세해서 도움이 됐어요.',
          status: 'pending',
          createdAt: '2025-02-01T15:20:00',
          name: '이**',
          product: 'FateMate 완전판'
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('후기 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId: number) => {
    if (!confirm('이 후기를 승인하시겠습니까?')) return;

    try {
      // 실제로는 API 호출
      // await fetch(`/api/admin/reviews/${reviewId}/approve`, { method: 'POST' });
      
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: 'approved' as const } : r
      ));
      alert('후기가 승인되었습니다.');
    } catch (error) {
      alert('후기 승인에 실패했습니다.');
    }
  };

  const handleReject = async (reviewId: number) => {
    const reason = prompt('거부 사유를 입력해주세요:');
    if (!reason) return;

    try {
      // 실제로는 API 호출
      // await fetch(`/api/admin/reviews/${reviewId}/reject`, {
      //   method: 'POST',
      //   body: JSON.stringify({ reason })
      // });
      
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: 'rejected' as const } : r
      ));
      alert('후기가 거부되었습니다.');
    } catch (error) {
      alert('후기 거부에 실패했습니다.');
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('이 후기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      // 실제로는 API 호출
      // await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' });
      
      setReviews(reviews.filter(r => r.id !== reviewId));
      alert('후기가 삭제되었습니다.');
    } catch (error) {
      alert('후기 삭제에 실패했습니다.');
    }
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: '승인 대기',
      approved: '승인됨',
      rejected: '거부됨'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">후기 관리</h1>
          <p className="text-gray-600">고객 후기를 승인하거나 거부할 수 있습니다.</p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">전체 후기</div>
            <div className="text-2xl font-bold">{reviews.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <div className="text-sm text-yellow-800 mb-1">승인 대기</div>
            <div className="text-2xl font-bold text-yellow-900">
              {reviews.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="text-sm text-green-800 mb-1">승인됨</div>
            <div className="text-2xl font-bold text-green-900">
              {reviews.filter(r => r.status === 'approved').length}
            </div>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6">
            <div className="text-sm text-red-800 mb-1">거부됨</div>
            <div className="text-2xl font-bold text-red-900">
              {reviews.filter(r => r.status === 'rejected').length}
            </div>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && '전체'}
                {status === 'pending' && '승인 대기'}
                {status === 'approved' && '승인됨'}
                {status === 'rejected' && '거부됨'}
              </button>
            ))}
          </div>
        </div>

        {/* 후기 목록 */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">표시할 후기가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold">{review.name || '익명'}</span>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>상품: {review.product}</p>
                      <p>주문번호: {review.orderNumber}</p>
                      {review.email && <p>이메일: {review.email}</p>}
                      <p>작성일: {new Date(review.createdAt).toLocaleString('ko-KR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-lg">
                  {review.content}
                </p>

                {/* 액션 버튼 */}
                <div className="flex gap-2 justify-end">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        거부
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
