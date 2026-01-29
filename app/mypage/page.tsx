'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/products');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">이동 중...</p>
    </div>
  );
}
