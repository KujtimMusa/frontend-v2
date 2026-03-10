'use client';

import { ShopifyProvider } from '@/components/providers/ShopifyProvider';
import { Suspense } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading App...</div>}>
      <ShopifyProvider>{children}</ShopifyProvider>
    </Suspense>
  );
}
