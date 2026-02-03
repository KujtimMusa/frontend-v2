import { create } from 'zustand';
import type { User } from '@/types/models';

interface AuthState {
  user: User | null;
  token: string | null;
  shopId: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string, shopId: string) => void;
  logout: () => void;
  setShopId: (shopId: string) => void;
}

// Initialize from localStorage if available
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      shopId: null,
      isAuthenticated: false,
    };
  }

  const shopId = localStorage.getItem('shop_id');
  const token = localStorage.getItem('auth_token');
  
  return {
    user: shopId ? { id: parseInt(shopId), email: null, name: 'Shop' } : null,
    token: token || null,
    shopId: shopId || null,
    isAuthenticated: !!shopId,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  
  login: (user: User, token: string, shopId: string) => {
    console.log('[AuthStore] Login called:', { user, shopId });
    set({ 
      user, 
      token, 
      shopId,
      isAuthenticated: true 
    });
    
    // Also save to localStorage (for backwards compatibility)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('shop_id', shopId);
    }
  },
  
  setShopId: (shopId: string) => {
    console.log('[AuthStore] SetShopId called:', shopId);
    set((state) => ({ 
      ...state,
      shopId,
      isAuthenticated: !!shopId 
    }));
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('shop_id', shopId);
    }
  },
  
  logout: () => {
    console.log('[AuthStore] Logout called');
    set({ 
      user: null, 
      token: null, 
      shopId: null,
      isAuthenticated: false 
    });
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('shop_id');
      localStorage.removeItem('current_shop_id');
      localStorage.removeItem('session_id');
      localStorage.removeItem('shop_mode');
      localStorage.removeItem('shop_domain');
      localStorage.removeItem('intended_destination');
    }
  },
}));

// Helper: Check if user is authenticated
export const checkAuth = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const shopId = localStorage.getItem('shop_id');
  const storeAuth = useAuthStore.getState().isAuthenticated;
  
  return !!(shopId && storeAuth);
};
