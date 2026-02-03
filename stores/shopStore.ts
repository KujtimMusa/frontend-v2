import { create } from 'zustand';
import type { Shop } from '@/types/models';

interface ShopState {
  currentShop: Shop | null;
  isDemoMode: boolean;
  shops: Shop[];
  setCurrentShop: (shop: Shop | null) => void;
  setIsDemoMode: (isDemo: boolean) => void;
  setShops: (shops: Shop[]) => void;
}

export const useShopStore = create<ShopState>((set) => ({
  currentShop: null,
  isDemoMode: true,
  shops: [],
  setCurrentShop: (shop) => set({ currentShop: shop }),
  setIsDemoMode: (isDemo) => set({ isDemoMode: isDemo }),
  setShops: (shops) => set({ shops }),
}));
