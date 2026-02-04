'use client';

import { useState } from 'react';
import Link from 'next/link';

const reviews = [
  {
    id: 1,
    name: '김**',
    product: '연인 궁합 스페셜 분석',
    rating: 5,
    date: '2025.01.28',
    content: '남친이랑 맨날 같은 부분에서 싸우는데 이유를 모르겠더라구요. 뻔한 얘기 나올 줄 알았는데 생각보다 디테일하게 나와서 놀랐어요. 갈등 포인트가 진짜 우리 싸우는 부분이랑 똑같아서... 이제 좀 이해하고 넘어가게 됐어요.',
    verified: true
  },
  {
    id: 2,
    name: '이**',
    product: '정통사주 × MBTI 분석',
    rating: 4,
    date: '2025.01.25',
    content: 'MBTI만 봤을 땐 몰랐던 부분들이 있더라고요. 사주랑 같이 보니까 내가 왜 이런 연애를 하는지 좀 알겠어요. 가격 대비 괜찮은데, 좀 더 자세하게 나왔으면 더 좋았을 것 같긴 해요.',
    verified: true
  },
  {
    id: 3,
    name: '박**',
    product: '연인 궁합 스페셜 분석',
    rating: 5,
    date: '2025.01.22',
    content: '결혼 전에 한번 봤어요. 상담지 읽다 보니 철학관 가서 상담하는 내용이랑 많은 부분 비슷해서 좀 놀랐어요. 조심해야 할 시기도 알려줘서 실용적이었고, 이 가격에 이정도면 충분한듯?',
    verified: true
  },
  {
    id: 4,
    name: '최**',
    product: '정통 사주 분석',
    rating: 4,
    date: '2025.01.20',
    content: '기본 상품이라 기대 안했는데 생각보다 볼 게 있네요. 올해 연애운 보려고 했는데 나름 참고할 만해요. 다만 더 자세한 분석이 필요하면 위에 상품들 보는게 나을 것 같아요.',
    verified: true
  },
  {
    id: 5,
    name: '정**',
    product: '연인 궁합 스페셜 분석',
    rating: 4,
    date: '2025.01.18',
    content: '짝사랑하던 사람 생일 물어봐서 몰래 봤어요 ㅋㅋ 생각보다 안 맞는다고 나왔는데, 냉정하게 현실 파악하는 계기가 됐네요. 아쉽지만 도움은 됐어요.',
    verified: true
  },
  {
    id: 6,
    name: '한**',
    product: '정통사주 × MBTI 분석',
    rating: 5,
    date: '2025.01.15',
    content: '왜 맨날 같은 타입한테 끌리나 했는데 여기서 이유를 찾았어요. 단순히 성격만 보는 게 아니라 사주까지 연결해서 보니까 훨씬 이해가 잘 되더라고요. 이 가격이면 가성비 좋은 듯!',
    verified: true
  },
  {
    id: 7,
    name: '송**',
    product: '연인 궁합 스페셜 분석',
    rating: 5,
    date: '2025.01.12',
    content: '사귀기 전에 미리 확인해보려고 했어요. 케미 점수도 나오고 갈등 날 수 있는 부분도 미리 알려줘서 실제로 도움 됐어요. 고백 타이밍 잡는데도 참고했습니다 ㅎㅎ',
    verified: true
  },
  {
    id: 8,
    name: '윤**',
    product: '연인 궁합 스페셜 분석',
    rating: 5,
    date: '2025.01.10',
    content: '원거리 연애 중이라 언제 만나야 좋을지 궁금했는데, 시기별로 나와서 유용했어요. 남친이랑 같이 보면서 우리 얘기 나와서 신기해했어요 💕',
    verified: true
  }
];

export default function ReviewsPage() {
  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">고객 후기</h1>
            <p className="text-gray-600">실제 이용 고객님들의 생생한 후기입니다.</p>
          </div>
          <Link 
            href="/reviews/write"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            후기 작성
          </Link>
        </div>

        {/* 평점 요약 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600">{averageRating}</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 ${star <= Math.round(Number(averageRating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 mt-2">{reviews.length}개의 리뷰</p>
            </div>
          </div>
        </div>

        {/* 주간 베스트 후기 이벤트 배너 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-md p-6 mb-8 border-2 border-amber-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">⏰</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  주간 베스트 후기 이벤트
                </h3>
                <p className="text-gray-700 font-medium mb-1">
                  매주 우수 후기 2분께 <span className="text-amber-600 font-bold">추가 1인 무료 분석권</span> 증정
                </p>
                <p className="text-sm text-gray-600">
                  궁금했던 그 사람, 지금 바로 확인하세요
                </p>
              </div>
            </div>
            <Link 
              href="/reviews/write"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
            >
              후기 작성하기
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-200 flex flex-wrap items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>당첨자는 이메일로 개별 안내</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>참여 후기가 많을 경우 선정 인원 확대 가능</span>
            </div>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{review.name}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        구매인증
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{review.product}</span>
                </div>
                <span className="text-sm text-gray-400">{review.date}</span>
              </div>
              
              <div className="flex mb-3">
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
              
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>* 실제 구매 고객의 후기만 게시됩니다.</p>
          <p>* 개인정보 보호를 위해 이름은 일부 가려져 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
}
