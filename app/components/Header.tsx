'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartProvider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <div className="text-xl font-light text-black tracking-tight">
              K-Saju
            </div>
          </Link>

          {/* 네비게이션 - 데스크톱 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-black transition-colors font-light">
              상품
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors font-light">
              소개
            </Link>
            <Link href="/reviews" className="text-gray-600 hover:text-black transition-colors font-light">
              후기
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-black transition-colors font-light">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-black transition-colors font-light">
              문의하기
            </Link>
          </nav>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-6">
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-600 hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center font-light">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* 모바일 메뉴 버튼 */}
            <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-gray-600 hover:text-black transition-colors font-light">상품</Link>
              <Link href="/about" className="text-gray-600 hover:text-black transition-colors font-light">소개</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-black transition-colors font-light">후기</Link>
              <Link href="/faq" className="text-gray-600 hover:text-black transition-colors font-light">FAQ</Link>
              <Link href="/contact" className="text-gray-600 hover:text-black transition-colors font-light">문의하기</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
