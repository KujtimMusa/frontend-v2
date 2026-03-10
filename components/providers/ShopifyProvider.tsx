'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ShopifyCtx {
  shop: string | null;
  host: string | null;
  sessionToken: string | null;
  appBridge: any;
  isLoading: boolean;
  isEmbedded: boolean;
}

const ShopifyContext = createContext<ShopifyCtx>({
  shop: null,
  host: null,
  sessionToken: null,
  appBridge: null,
  isLoading: true,
  isEmbedded: false,
});

export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [shop, setShop] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [appBridge, setAppBridge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const s = searchParams.get('shop');
    const h = searchParams.get('host');
    setShop(s);
    setHost(h);

    if (!s || !h || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    import('@shopify/app-bridge')
      .then(({ createApp }) => {
        const app = createApp({
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID!,
          host: h,
        });
        setAppBridge(app);

        import('@shopify/app-bridge/utilities').then(({ getSessionToken }) => {
          getSessionToken(app)
            .then(setSessionToken)
            .finally(() => setIsLoading(false));
        });
      })
      .catch(() => setIsLoading(false));
  }, [searchParams]);

  return (
    <ShopifyContext.Provider
      value={{
        shop,
        host,
        sessionToken,
        appBridge,
        isLoading,
        isEmbedded: !!(shop && host),
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
}

export function useShopify() {
  const context = useContext(ShopifyContext);
  if (!context)
    throw new Error('useShopify must be used within ShopifyProvider');
  return context;
}
