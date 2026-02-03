'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get params from URL
        const shopId = searchParams.get('shop_id');
        const installed = searchParams.get('installed');
        const mode = searchParams.get('mode');
        const error = searchParams.get('error');

        console.log('[Callback] Received params:', { 
          shopId, 
          installed, 
          mode, 
          error 
        });

        // Handle error from backend
        if (error) {
          console.error('[Callback] OAuth error:', error);
          setStatus('error');
          setErrorMessage(error);
          toast.error(`Authentication failed: ${error}`);
          setTimeout(() => router.push('/auth/shopify/login'), 3000);
          return;
        }

        // Validate required params
        if (!shopId) {
          console.error('[Callback] No shop_id received');
          setStatus('error');
          setErrorMessage('No shop ID received from Shopify');
          toast.error('Authentication failed: No shop ID');
          setTimeout(() => router.push('/auth/shopify/login'), 3000);
          return;
        }

        if (installed !== 'true') {
          console.warn('[Callback] App not marked as installed');
        }

        // ✅ WICHTIG: Save to localStorage (für API-Calls)
        localStorage.setItem('shop_id', shopId);
        localStorage.setItem('current_shop_id', shopId);
        
        // Optional: Save mode (demo/live)
        if (mode) {
          localStorage.setItem('shop_mode', mode);
        }
        
        // Get shop domain from localStorage (wurde in entry/login gesetzt)
        const shopDomain = localStorage.getItem('shop_domain');
        if (shopDomain) {
          // Keep it for future reference
        }
        
        // ✅ WICHTIG: Update authStore (für AuthGuard)
        login(
          { 
            id: parseInt(shopId), 
            name: 'Shop', // Backend sendet kein Shop-Name, aber OK
            email: null 
          },
          'session-token', // Backend sendet keinen Token, aber Store braucht es
          shopId
        );
        
        console.log('[Callback] Auth successful, shopId saved:', shopId);
        
        // Dispatch event for other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('shop-switched', { 
            detail: { shopId } 
          }));
        }
        
        // Success!
        setStatus('success');
        toast.success('Successfully connected to Shopify!');
        
        // Check if there's an intended destination
        const intendedDestination = typeof window !== 'undefined'
          ? localStorage.getItem('intended_destination')
          : null;
        
        // Clear intended destination
        if (intendedDestination) {
          localStorage.removeItem('intended_destination');
        }
        
        // Redirect after short delay (for UX)
        setTimeout(() => {
          router.replace(intendedDestination || '/dashboard');
        }, 1500);
        
      } catch (error) {
        console.error('[Callback] Error:', error);
        setStatus('error');
        setErrorMessage('Failed to complete authentication');
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => router.push('/auth/shopify/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            {status === 'loading' && 'Connecting to Shopify...'}
            {status === 'success' && 'Successfully Connected!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          
          <CardDescription className="text-slate-400">
            {status === 'loading' && 'Please wait while we complete the setup'}
            {status === 'success' && 'Redirecting to your dashboard...'}
            {status === 'error' && (
              <span className="text-red-400">
                {errorMessage || 'An error occurred. Please try again.'}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        {status === 'loading' && (
          <CardContent>
            <div className="space-y-3">
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse transition-all duration-1000" 
                  style={{ width: '60%' }} 
                />
              </div>
              <p className="text-xs text-center text-slate-500">
                Setting up your store...
              </p>
            </div>
          </CardContent>
        )}

        {status === 'error' && (
          <CardContent>
            <p className="text-sm text-center text-slate-400">
              Redirecting to login page in 3 seconds...
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function ShopifyCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
