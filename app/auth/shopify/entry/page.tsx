'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function EntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, shopId: storeShopId } = useAuthStore();
  const [status, setStatus] = useState<'checking' | 'redirecting'>('checking');

  useEffect(() => {
    const handleEntry = async () => {
      try {
        // Get shop from URL (Shopify sends ?shop=DOMAIN)
        const shopParam = searchParams.get('shop');
        const hmac = searchParams.get('hmac');
        const timestamp = searchParams.get('timestamp');

        console.log('[Entry] Shopify entry point accessed:', { 
          shopParam, 
          hasHmac: !!hmac,
          hasTimestamp: !!timestamp 
        });

        // Check if user already has auth in this browser
        const localShopId = typeof window !== 'undefined' 
          ? localStorage.getItem('shop_id') 
          : null;
        const localShopDomain = typeof window !== 'undefined'
          ? localStorage.getItem('shop_domain')
          : null;

        console.log('[Entry] Current auth state:', {
          isAuthenticated,
          storeShopId,
          localShopId,
          localShopDomain
        });

        // CASE 1: User already authenticated AND same shop
        if ((isAuthenticated || localShopId) && shopParam) {
          // Check if it's the same shop
          if (localShopDomain === shopParam || !shopParam) {
            console.log('[Entry] User already authenticated for this shop → Dashboard');
            toast.success('Welcome back!');
            setStatus('redirecting');
            router.replace('/dashboard');
            return;
          }
        }

        // CASE 2: User already authenticated but DIFFERENT shop
        if ((isAuthenticated || localShopId) && shopParam && localShopDomain !== shopParam) {
          console.log('[Entry] Different shop detected, re-authenticating...');
          toast.info('Switching to new store...');
          // Continue to OAuth flow below
        }

        // CASE 3: User NOT authenticated OR new shop → OAuth flow
        if (!shopParam) {
          // No shop parameter → redirect to login page
          console.log('[Entry] No shop parameter, redirect to login');
          toast.error('No shop domain provided');
          router.replace('/auth/shopify/login');
          return;
        }

        // CASE 4: Start OAuth flow
        console.log('[Entry] Starting OAuth flow for shop:', shopParam);
        setStatus('redirecting');
        toast.loading('Connecting to Shopify...', { id: 'entry-oauth' });

        // Save shop domain for later comparison
        if (typeof window !== 'undefined') {
          localStorage.setItem('shop_domain', shopParam);
        }

        // Redirect to backend OAuth with all Shopify params
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Build OAuth URL with all params (shop, hmac, timestamp, etc.)
        const params = new URLSearchParams();
        params.set('shop', shopParam);
        if (hmac) params.set('hmac', hmac);
        if (timestamp) params.set('timestamp', timestamp);
        
        // Copy any other params from Shopify
        searchParams.forEach((value, key) => {
          if (!['shop', 'hmac', 'timestamp'].includes(key)) {
            params.set(key, value);
          }
        });

        const oauthUrl = `${apiUrl}/auth/shopify/install?${params.toString()}`;
        
        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to backend
        window.location.href = oauthUrl;

      } catch (error) {
        console.error('[Entry] Error:', error);
        toast.error('Failed to connect. Please try again.', { id: 'entry-oauth' });
        router.replace('/auth/shopify/login');
      }
    };

    handleEntry();
  }, [searchParams, router, isAuthenticated, storeShopId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            {status === 'checking' && 'Checking authentication...'}
            {status === 'redirecting' && 'Redirecting...'}
          </h2>
          <p className="text-slate-400 text-sm">
            Please wait while we connect your Shopify store
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ShopifyEntryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <EntryContent />
    </Suspense>
  );
}
