'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, shopId } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Skip auth check if not required
    if (!requireAuth) {
      setIsReady(true);
      setIsChecking(false);
      return;
    }

    const checkAuth = () => {
      // Check zustand store
      const storeAuth = isAuthenticated;
      const storeShopId = shopId;
      
      // Also check localStorage as fallback
      const localShopId = typeof window !== 'undefined' 
        ? localStorage.getItem('shop_id') 
        : null;
      
      const isAuth = storeAuth && (storeShopId || localShopId);
      
      console.log('[AuthGuard] Check:', {
        requireAuth,
        storeAuth,
        storeShopId,
        localShopId,
        isAuth,
        pathname
      });

      if (!isAuth) {
        // Save intended destination
        if (typeof window !== 'undefined' && pathname !== '/auth/shopify/login') {
          localStorage.setItem('intended_destination', pathname);
        }
        
        // Redirect to login
        console.log('[AuthGuard] Not authenticated, redirecting to login');
        router.push('/auth/shopify/login');
      } else {
        // Authenticated, show content
        setIsReady(true);
        setIsChecking(false);
      }
    };

    // Small delay for hydration (zustand initialization)
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [requireAuth, isAuthenticated, shopId, router, pathname]);

  // Show loading while checking
  if (requireAuth && isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children until ready
  if (requireAuth && !isReady) {
    return null;
  }

  return <>{children}</>;
}
