import { Product } from './types';

export const products: Product[] = [
  {
    id: 'cross',
    name: '정통사주 × MBTI 분석',
    description: '160가지 페르소나 · 강점/약점 · 액션 가이드',
    price: 9900,
    originalPrice: 19800,
    features: [
      '베이직 전체 내용 포함',
      'MBTI × 사주 크로스 분석',
      '타고난 기질 vs 후천적 성향',
      '연애 DNA & 이상형 분석',
      '재물운 & 직업 적성',
      '건강운 & 대인관계 전략',
      '상세 PDF 리포트'
    ],
    category: 'premium',
    image: '/images/cross.png',
    icon: '🧬',
    badge: '런칭 50%',
    popular: true
  },
  {
    id: 'fatemate',
    name: '연인 궁합 스페셜 분석',
    description: '케미 점수 · 갈등 포인트 · 소통 전략',
    price: 14900,
    originalPrice: 29800,
    features: [
      '사주 궁합 종합 점수',
      'MBTI 궁합 & 소통 스타일',
      '오행 에너지 케미 분석',
      '관계 강점 & 주의점',
      '갈등 해결 & 화해 전략',
      '연애 타이밍 가이드',
      '상세 PDF 리포트'
    ],
    category: 'compatibility',
    image: '/images/fatemate.png',
    icon: '💫',
    badge: '베스트',
    popular: true
  },
  {
    id: 'fortune',
    name: '재물운 × 사업 타이밍',
    description: '재운 흐름 · 투자 시기 · 업종 적합도',
    price: 12900,
    originalPrice: 25800,
    features: [
      '재물운 흐름 (월별 타이밍)',
      '사업 적합도 & 업종 추천',
      '투자 시기 & 리스크 진단',
      '월별 재운 흐름 & 기회 포착',
      '자산 방어 & 공격 전략',
      '동업 파트너 시너지 분석',
      '상세 PDF 리포트'
    ],
    category: 'fortune',
    image: '/images/money.png',
    icon: '💰',
    badge: '런칭 50%',
    popular: true
  }
];

// 인기 상품
export const popularProducts = products.filter(p => p.popular);

// 카테고리별 상품
export const getProductsByCategory = (category: Product['category']) => {
  return products.filter(p => p.category === category);
};

// ID로 상품 찾기
export const getProductById = (id: string) => {
  return products.find(p => p.id === id);
};
