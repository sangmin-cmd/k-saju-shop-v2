'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from './components/ProductCard';
import { products, popularProducts } from './lib/products';
import UseCasesSection from './components/UseCasesSection';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('new');

  // 카드 클릭 핸들러
  const handleCardClick = (cardType: string) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
    if (expandedCard !== cardType) {
      setSelectedType(cardType);
    }
  };

  // 통합 CTA 클릭
  const handleCtaClick = () => {
    router.push(`/free?type=${selectedType}`);
  };

  const reportPreviews = [
    {
      title: '궁합 케미 점수',
      subtitle: '우리 둘의 조화도 한눈에',
      gradient: 'from-pink-500 to-rose-600',
      content: {
        type: 'ESTJ × 丙火 & ISTJ × 乙木',
        score: '85점',
        grade: '매우 좋음',
        summary: '이 조합은 서로 다른 에너지가 균형을 이루는 관계입니다. 한 사람의 열정적인 추진력이 상대방의 차분한 신중함을 만나면서 안정적이면서도 역동적인 관계가 형성됩니다.'
      }
    },
    {
      title: '관계의 특징',
      subtitle: '우리는 어떤 커플일까?',
      gradient: 'from-emerald-500 to-teal-600',
      content: {
        strength: '불타는 열정 × 차분한 안정',
        description: '두 사람의 속도 차이가 답답함을 만들 수 있어 서로의 템포를 존중하는 것이 중요합니다. 급할 때와 천천히 갈 때를 구분하는 지혜가 필요한 관계입니다.',
        keywords: ['#균형잡힌조합', '#안정적성장', '#템포조절필수']
      }
    },
    {
      title: '첫 만남 공략법',
      subtitle: '어떻게 다가가야 할까?',
      gradient: 'from-blue-500 to-purple-600',
      content: {
        tip: '직진보다는 천천히 신뢰를 쌓아가는 접근이 효과적입니다.',
        warning: '급하게 다가가면 부담스러워할 수 있으니 주의하세요.',
        locked: ['구체적인 갈등 패턴', '화해하는 최적의 방법', '권태기 극복 전략', '재회 가능성 분석']
      }
    }
  ];

  const faqs = [
    {
      q: '생시를 몰라도 되나요?',
      a: '네, 생시는 선택 입력입니다. 생시를 모르셔도 생년월일만으로 핵심 분석이 가능합니다. 생시가 있으면 더 정밀한 분석이 가능해집니다.'
    },
    {
      q: 'AI 사주인가요?',
      a: '아닙니다. K-Saju는 절기/만세력 기반의 정밀 계산 엔진입니다. 같은 입력이면 항상 같은 결과가 나오도록 설계되어 있습니다. 100% 자체 엔진 로직으로 해석됩니다.'
    },
    {
      q: '결과가 매번 같은가요?',
      a: '네, 동일한 입력(생년월일시, MBTI)이면 동일한 결과가 나옵니다. 이것이 AI 프롬프트 기반 서비스와의 가장 큰 차이점입니다.'
    },
    {
      q: '리포트는 어떻게 받나요?',
      a: '결제 완료 후 입력하신 이메일로 PDF가 발송됩니다. 24시간 이내 받아보실 수 있습니다.'
    },
    {
      q: '환불은 어떻게 되나요?',
      a: '리포트 생성 전 취소 시 전액 환불됩니다. 생성 후에는 디지털 상품 특성상 환불이 어려우나, 품질 불만족 시 고객센터로 문의해 주세요.'
    }
  ];

  const reviews = [
    { text: '"썸 타는 사람과 궁합 봤는데 \'밀당보다 직진이 맞는 조합\'이라고 나와서 고백했어요! 지금 사귀는 중 💕"', author: '28세, 직장인', rating: 5 },
    { text: '"연애 패턴이 정확히 맞아서 소름… 왜 맨날 같은 유형한테 끌리는지 이해됐어요"', author: '31세, 프리랜서', rating: 5 },
    { text: '"남친이랑 자꾸 싸우는 이유가 사주로 딱 설명되더라고요. 화해 전략까지 알려줘서 진짜 도움됐어요"', author: '29세, 대학원생', rating: 5 },
    { text: '"결과가 재현돼서 신뢰가 생겼습니다. AI 운세랑은 확실히 다르네요"', author: '34세, 자영업', rating: 5 },
    { text: '"오행 밸런스 보고 생활 루틴을 바꿨더니 컨디션이 달라졌어요"', author: '27세, 직장인', rating: 4 },
    { text: '"MBTI랑 같이 보니까 납득이 됩니다. PDF로 정리돼서 두고두고 봐요"', author: '32세, 컨설턴트', rating: 5 }
  ];

  return (
    <div className="bg-white">
      {/* ========== 1. HERO - 프리미엄 네이비+골드 ========== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0f1a 0%, #1a2744 40%, #243b61 70%, #1a2744 100%)'
        }}>
        
        {/* 배경 효과 - 은은한 골드 톤 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl"></div>
          {/* 미세한 별자리 패턴 */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center py-24">
          {/* Badge - 골드 테두리 */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-sm rounded-full mb-10 border border-amber-500/30">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-amber-200/90 text-sm font-medium tracking-wide">전통 사주 × 현대 심리학</span>
          </div>
          
          {/* H1 - 메인 카피 (연애 중심) */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
            style={{ color: '#F5F5F0' }}>
            우리, 얼마나 잘 맞을까?
          </h1>
          
          {/* Sub - 부드러운 크림톤 */}
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'rgba(245, 245, 240, 0.75)' }}>
            <span className="text-amber-300 font-semibold">사주 × MBTI</span> 160가지 유형으로<br className="hidden md:block" />
            지금 우리 관계를 정확히 알려드려요
          </p>

          {/* 상황 선택 안내 */}
          <div className="text-center mb-8">
            <p className="text-lg" style={{ color: 'rgba(245, 245, 240, 0.9)' }}>
              💡 어떤 상황인가요?
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
              선택하면 맞춤 분석을 받아요
            </p>
          </div>

          {/* 카드 4개 - 아코디언 방식 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {/* 카드 1: 처음 만나요 */}
            <button 
              onClick={() => handleCardClick('new')}
              className="group text-left"
            >
              <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                expandedCard === 'new' 
                  ? 'border-amber-400 bg-white/10 shadow-2xl' 
                  : 'border-white/10 hover:bg-white/10 hover:border-amber-400/50'
              } hover:-translate-y-2`}>
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>
                  처음 만나요
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  썸 단계 필수!<br/>
                  고백 전략 & 타이밍
                </p>
                
                {/* 확장 콘텐츠 */}
                {expandedCard === 'new' && (
                  <div className="mt-6 pt-6 border-t border-amber-400/30 space-y-4 text-left animate-fadeIn">
                    <p className="text-sm font-semibold mb-4" style={{ color: '#F5F5F0' }}>
                      📋 이런 내용을 알려드려요:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>상대방의 연애 DNA</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>성향과 호감 포인트 분석</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>마음을 얻는 공략법</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>효과적인 어필 방법</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>연락 타이밍 점수</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>지금 연락해도 될까? (예: 55점)</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>절대 하면 안 되는 것</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>NG 행동 리스트</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`text-amber-400 text-sm font-medium transition-transform ${
                  expandedCard === 'new' ? 'mt-4' : ''
                } group-hover:translate-x-2`}>
                  {expandedCard === 'new' ? '✓ 선택됨' : '상세보기 →'}
                </div>
              </div>
            </button>

            {/* 카드 2: 연애 중이에요 */}
            <button 
              onClick={() => handleCardClick('dating')}
              className="group text-left"
            >
              <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                expandedCard === 'dating' 
                  ? 'border-amber-400 bg-white/10 shadow-2xl' 
                  : 'border-white/10 hover:bg-white/10 hover:border-amber-400/50'
              } hover:-translate-y-2`}>
                <div className="text-4xl mb-4">💕</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>
                  연애 중이에요
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  더 깊은 관계<br/>
                  유지 & 성장 비법
                </p>
                
                {/* 확장 콘텐츠 */}
                {expandedCard === 'dating' && (
                  <div className="mt-6 pt-6 border-t border-amber-400/30 space-y-4 text-left animate-fadeIn">
                    <p className="text-sm font-semibold mb-4" style={{ color: '#F5F5F0' }}>
                      📋 이런 내용을 알려드려요:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>우리 관계의 강점</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>함께 불타오르는 케미</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>주의해야 할 포인트</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>감정 충돌 예방법</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>권태기 극복 방법</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>4단계 구체적 전략</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>관계 유지 조언</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>3가지 실천 가이드</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`text-amber-400 text-sm font-medium transition-transform ${
                  expandedCard === 'dating' ? 'mt-4' : ''
                } group-hover:translate-x-2`}>
                  {expandedCard === 'dating' ? '✓ 선택됨' : '상세보기 →'}
                </div>
              </div>
            </button>

            {/* 카드 3: 고민이 있어요 */}
            <button 
              onClick={() => handleCardClick('problem')}
              className="group text-left"
            >
              <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                expandedCard === 'problem' 
                  ? 'border-amber-400 bg-white/10 shadow-2xl' 
                  : 'border-white/10 hover:bg-white/10 hover:border-amber-400/50'
              } hover:-translate-y-2`}>
                <div className="text-4xl mb-4">💭</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>
                  고민이 있어요
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  막힌 관계<br/>
                  갈등 해결 전략
                </p>
                
                {/* 확장 콘텐츠 */}
                {expandedCard === 'problem' && (
                  <div className="mt-6 pt-6 border-t border-amber-400/30 space-y-4 text-left animate-fadeIn">
                    <p className="text-sm font-semibold mb-4" style={{ color: '#F5F5F0' }}>
                      📋 이런 내용을 알려드려요:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>우리의 갈등 패턴</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>火 vs 木 스타일 분석</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>쿨링 타임 가이드</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>나 10분 vs 상대 30분</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>효과적인 화해 방법</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>성향별 맞춤 전략</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>재회 가능성 분석</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>84% + 체크리스트</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`text-amber-400 text-sm font-medium transition-transform ${
                  expandedCard === 'problem' ? 'mt-4' : ''
                } group-hover:translate-x-2`}>
                  {expandedCard === 'problem' ? '✓ 선택됨' : '상세보기 →'}
                </div>
              </div>
            </button>

            {/* 카드 4: 나를 알고 싶어요 */}
            <button 
              onClick={() => handleCardClick('self')}
              className="group text-left"
            >
              <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
                expandedCard === 'self' 
                  ? 'border-amber-400 bg-white/10 shadow-2xl' 
                  : 'border-white/10 hover:bg-white/10 hover:border-amber-400/50'
              } hover:-translate-y-2`}>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>
                  나를 알고 싶어요
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  나 자신 이해<br/>
                  성향 & 강점 분석
                </p>
                
                {/* 확장 콘텐츠 */}
                {expandedCard === 'self' && (
                  <div className="mt-6 pt-6 border-t border-amber-400/30 space-y-4 text-left animate-fadeIn">
                    <p className="text-sm font-semibold mb-4" style={{ color: '#F5F5F0' }}>
                      📋 이런 내용을 알려드려요:
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>나의 핵심 성향</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>MBTI × 사주 조합 분석</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>숨겨진 강점 발견</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>오행 밸런스로 보는 재능</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>연애 스타일 파악</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>내가 사랑하는 방식</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-amber-400 mt-0.5">✓</span>
                        <div>
                          <p className="font-medium mb-1" style={{ color: '#F5F5F0' }}>주의할 포인트</p>
                          <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>성장 방향 제시</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`text-amber-400 text-sm font-medium transition-transform ${
                  expandedCard === 'self' ? 'mt-4' : ''
                } group-hover:translate-x-2`}>
                  {expandedCard === 'self' ? '✓ 선택됨' : '상세보기 →'}
                </div>
              </div>
            </button>
          </div>

          {/* 통합 CTA */}
          <div className="text-center mt-10">
            <button
              onClick={handleCtaClick}
              className="px-12 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-2xl hover:shadow-amber-500/50 hover:-translate-y-1 transform"
            >
              3분 무료 체험하기
            </button>
            <p className="text-xs mt-3" style={{ color: 'rgba(245, 245, 240, 0.5)' }}>
              {expandedCard === 'new' && '썸 단계 전략을 먼저 확인해보세요'}
              {expandedCard === 'dating' && '연애 관계 분석을 먼저 확인해보세요'}
              {expandedCard === 'problem' && '갈등 해결법을 먼저 확인해보세요'}
              {expandedCard === 'self' && '나 자신을 먼저 이해해보세요'}
              {!expandedCard && '위 카드를 선택하고 시작하세요'}
            </p>
          </div>

          {/* 신뢰 지표 */}
          <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#d4af37' }}>160가지</div>
              <div className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>유형 조합</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#d4af37' }}>100%</div>
              <div className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>자체 엔진</div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: '#d4af37' }}>24시간</div>
              <div className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>이내 발송</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 2. SOCIAL PROOF - 후기 ========== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #0a0f1a 0%, #050810 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-5 border border-amber-500/30">
              Real Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
              이미 많은 분들이 확인했어요
            </h2>
            <p className="text-lg" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
              연애의 답, 데이터로 찾았습니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <div key={idx} 
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="mb-4 leading-relaxed text-sm" style={{ color: 'rgba(245, 245, 240, 0.85)' }}>
                  {review.text}
                </p>
                <p className="text-xs" style={{ color: 'rgba(245, 245, 240, 0.5)' }}>
                  {review.author}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/reviews" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-amber-400/50"
              style={{ color: '#F5F5F0' }}
            >
              <span>후기 더보기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 3. PREVIEW - 리포트 샘플 ========== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #050810 0%, #0a1628 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-sm font-medium mb-5 border border-purple-500/30">
              Report Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
              이런 리포트를 받게 됩니다
            </h2>
            <p className="text-lg" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
              복잡한 사주, 한눈에 정리
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex justify-center gap-4 mb-10 flex-wrap">
            {reportPreviews.map((preview, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === idx 
                    ? 'bg-gradient-to-r text-white shadow-lg' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
                style={activeTab === idx ? { 
                  backgroundImage: `linear-gradient(135deg, ${preview.gradient.includes('blue') ? '#3b82f6' : preview.gradient.includes('emerald') ? '#10b981' : '#ec4899'}, ${preview.gradient.includes('purple') ? '#9333ea' : preview.gradient.includes('teal') ? '#14b8a6' : '#f43f5e'})`
                } : { color: 'rgba(245, 245, 240, 0.7)' }}
              >
                {preview.title}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
            {activeTab === 0 && (
              <div className="p-10">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="inline-block px-5 py-2 rounded-full mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(244, 63, 94, 0.15))', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                      <span className="text-sm font-medium" style={{ color: '#f9a8d4' }}>{reportPreviews[0].content.type}</span>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-6xl font-bold mb-2" style={{ color: '#f472b6' }}>
                        {reportPreviews[0].content.score}
                      </div>
                      <div className="text-lg" style={{ color: '#f9a8d4' }}>
                        {reportPreviews[0].content.grade}
                      </div>
                    </div>

                    <p className="text-base leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.8)' }}>
                      {reportPreviews[0].content.summary}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="p-10">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
                      {reportPreviews[1].content.strength}
                    </h3>
                    <div className="flex gap-2 justify-center flex-wrap mb-6">
                      {reportPreviews[1].content.keywords.map((keyword: string, i: number) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs" 
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl" 
                    style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <p className="text-base leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.8)' }}>
                      {reportPreviews[1].content.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="p-10">
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-6 mb-8">
                    <div className="p-6 rounded-xl"
                      style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div className="text-lg font-bold mb-3" style={{ color: '#93c5fd' }}>💡 공략 팁</div>
                      <p className="text-base leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.8)' }}>
                        {reportPreviews[2].content.tip}
                      </p>
                    </div>
                    
                    <div className="p-6 rounded-xl"
                      style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <div className="text-lg font-bold mb-3" style={{ color: '#fcd34d' }}>⚠️ 주의사항</div>
                      <p className="text-base leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.8)' }}>
                        {reportPreviews[2].content.warning}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl text-center"
                    style={{ background: 'rgba(107, 114, 128, 0.1)', border: '1px solid rgba(107, 114, 128, 0.2)' }}>
                    <div className="text-2xl mb-3">🔒</div>
                    <p className="font-bold mb-3" style={{ color: '#F5F5F0' }}>전체 리포트에서 확인하세요</p>
                    <div className="space-y-2">
                      {reportPreviews[2].content.locked.map((item: string, idx: number) => (
                        <p key={idx} className="text-sm" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
                          • {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm mb-6" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
              무료 체험에서 핵심 요약을 먼저 확인하세요
            </p>
            <Link 
              href="/free"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1"
            >
              <span>무료로 시작하기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 4. USE CASES ========== */}
      <UseCasesSection />

      {/* ========== 5. PRODUCTS - 가격표 ========== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #050810 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-5 border border-amber-500/30">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
              합리적인 가격으로 시작하세요
            </h2>
            <p className="text-lg" style={{ color: 'rgba(245, 245, 240, 0.6)' }}>
              철학관 방문 대비 1/10 가격, 훨씬 정밀한 분석
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-amber-400/50"
              style={{ color: '#F5F5F0' }}
            >
              <span>전체 상품 보기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 6. HOW IT WORKS ========== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #050810 0%, #0a1628 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-sm font-medium mb-5 border border-blue-500/30">
              How it Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
              3분이면 충분합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}>
                1
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>정보 입력</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                생년월일시, MBTI 입력<br/>
                (생시는 선택사항)
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', color: 'white' }}>
                2
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>정밀 계산</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                절기 만세력 기반<br/>
                160가지 유형 분석
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-2xl font-bold"
                style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)', color: 'white' }}>
                3
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#F5F5F0' }}>리포트 수령</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                24시간 내 이메일로<br/>
                PDF 발송
              </p>
            </div>
          </div>

          <div className="text-center mt-14">
            <Link 
              href="/free"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>지금 바로 시작</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== 7. TRUST - 신뢰 지표 ========== */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #050810 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-500/10 text-green-300 rounded-full text-sm font-medium mb-5 border border-green-500/30">
              Trust Signals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#F5F5F0' }}>
              안전하고 투명하게 운영됩니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 재현성 보장 */}
            <div className="relative group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                boxShadow: '0 0 40px rgba(147, 51, 234, 0.05)'
              }}>
              {/* 글로우 효과 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 40px rgba(147, 51, 234, 0.1)' }}></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
                    border: '2px solid rgba(147, 51, 234, 0.4)',
                    boxShadow: '0 0 30px rgba(147, 51, 234, 0.15)'
                  }}>
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#F5F5F0' }}>재현성 보장</h3>
                <div className="space-y-2" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#c084fc' }}>◆</span>
                    <span>같은 입력 → 같은 결과</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#c084fc' }}>◆</span>
                    <span>AI 랜덤 없음</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#c084fc' }}>◆</span>
                    <span>검증 가능한 로직</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 안전 결제 */}
            <div className="relative group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                boxShadow: '0 0 40px rgba(212, 175, 55, 0.05)'
              }}>
              {/* 글로우 효과 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.1)' }}></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)'
                  }}>
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#F5F5F0' }}>안전 결제 · 환불</h3>
                <div className="space-y-2" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#d4af37' }}>◆</span>
                    <span>토스페이먼츠 안전 거래</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#d4af37' }}>◆</span>
                    <span>불만족 시 100% 환불</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#d4af37' }}>◆</span>
                    <span>No-Risk 만족 보장</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 계산 근거 */}
            <div className="relative group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(100, 200, 150, 0.2)',
                boxShadow: '0 0 40px rgba(100, 200, 150, 0.05)'
              }}>
              {/* 글로우 효과 */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 40px rgba(100, 200, 150, 0.1)' }}></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(100, 200, 150, 0.1) 0%, rgba(100, 200, 150, 0.05) 100%)',
                    border: '2px solid rgba(100, 200, 150, 0.3)',
                    boxShadow: '0 0 30px rgba(100, 200, 150, 0.1)'
                  }}>
                  <span className="text-4xl">🧭</span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#F5F5F0' }}>계산 근거</h3>
                <div className="space-y-2" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#64c896' }}>◆</span>
                    <span>절기 · 만세력 정밀 계산</span>
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <span style={{ color: '#64c896' }}>◆</span>
                    <span>100% 자체 엔진 로직</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 보증 문구 */}
          <div className="text-center mt-12 pt-8 border-t border-white/5">
            <p className="text-sm" style={{ color: 'rgba(245, 245, 240, 0.4)' }}>
              우리는 당신의 운명을 소중히 다루며, 개인정보를 상업적으로 이용하지 않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* ========== 8. FAQ - 프리미엄 다크 ========== */}
      <section className="py-28 px-4"
        style={{ background: 'linear-gradient(180deg, #050810 0%, #0a1628 50%, #050810 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-5 border border-amber-500/30">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: '#F5F5F0' }}>
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} 
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center transition-colors"
                  style={{ background: openFaq === idx ? 'rgba(212, 175, 55, 0.05)' : 'transparent' }}
                >
                  <span className="font-semibold text-lg" style={{ color: '#F5F5F0' }}>{faq.q}</span>
                  <span className={`text-2xl transition-transform ${openFaq === idx ? 'rotate-45' : ''}`} style={{ color: '#d4af37' }}>+</span>
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-6 leading-relaxed" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 9. FINAL CTA - 프리미엄 네이비+골드 ========== */}
      <section className="py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #1a2744 50%, #243b61 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-6 border border-amber-500/30">
            지금 시작하세요
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#F5F5F0' }}>
            당신의 연애, 감에만 맡기지 마세요.<br />데이터로 읽으면, 방향이 보입니다.
          </h2>
          <p className="text-xl mb-10" style={{ color: 'rgba(245, 245, 240, 0.7)' }}>
            무료 1페이지로 먼저 확인하고, 필요하면 전체 리포트로 확장하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              href="/free"
              className="px-10 py-4 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              무료 체험하기
            </Link>
            <Link 
              href="/products" 
              className="px-10 py-4 text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 border-2"
              style={{ 
                background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)',
                borderColor: '#d4af37',
                color: '#0a0f1a'
              }}
            >
              전체 상품 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== STICKY CTA BAR ========== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-3 px-4 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-gray-600 hidden sm:block">
            무료로 먼저 체험해 보세요
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link 
              href="/free" 
              className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              무료 체험
            </Link>
            <Link 
              href="/products" 
              className="flex-1 sm:flex-none px-6 py-3 font-semibold rounded-lg transition-colors text-center"
              style={{ 
                background: 'linear-gradient(135deg, #d4af37 0%, #b8960c 100%)',
                color: '#0a0f1a'
              }}
            >
              전체 상품 보기
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Bar 공간 확보 */}
      <div className="h-20"></div>
    </div>
  );
}
