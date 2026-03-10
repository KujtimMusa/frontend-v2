'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShopify } from '@/components/providers/ShopifyProvider';
import { useAuthStore } from '@/stores/authStore';

export default function AppEntry() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { shop, host, appBridge, isLoading } = useShopify();
  const { login, isAuthenticated } = useAuthStore();
  const shopId = searchParams.get('shop_id');
  const installed = searchParams.get('installed');

  useEffect(() => {
    if (isLoading) return;

    if (!shop || !host) return router.replace('/landing');

    // OAuth-Callback
    if (installed === 'true' && shopId) {
      localStorage.setItem('shop_id', shopId);
      login(
        { id: parseInt(shopId), name: shop, email: null },
        'session',
        shopId
      );
      return router.replace(`/app/dashboard?shop=${shop}&host=${host}`);
    }

    // Bereits authentifiziert
    if (isAuthenticated || localStorage.getItem('shop_id')) {
      return router.replace(`/app/dashboard?shop=${shop}&host=${host}`);
    }

    // OAuth starten (App Bridge!)
    const oauthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/shopify/install?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`;

    if (appBridge) {
      import('@shopify/app-bridge/actions').then(({ Redirect }) => {
        Redirect.create(appBridge).dispatch(Redirect.Action.REMOTE, oauthUrl);
      });
    } else {
      window.location.href = oauthUrl;
    }
  }, [
    shop,
    host,
    isLoading,
    shopId,
    installed,
    appBridge,
    router,
    login,
    isAuthenticated,
  ]);

  return <div>Shopify App Initializing...</div>;
}
