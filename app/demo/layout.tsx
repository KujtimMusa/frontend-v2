'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useEffect } from 'react';
import { switchShop } from '@/lib/api';
import { useShopStore } from '@/stores/shopStore';
import { toast } from 'sonner';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCurrentShop, setIsDemoMode } = useShopStore();

  useEffect(() => {
    // Automatisch Demo-Shop aktivieren wenn in /demo Route
    const activateDemoShop = async () => {
      try {
        console.log('Aktiviere Demo-Shop...');
        
        // Warte auf switchShop Response
        const response = await switchShop(999, true);
        console.log('Demo-Shop aktiviert:', response);
        
        // Warte 500ms damit Backend Context aktualisiert ist
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update lokaler State
        setIsDemoMode(true);
        setCurrentShop({
          id: 999,
          name: 'Demo Shop',
          type: 'demo',
          shop_url: null,
          product_count: 0,
          is_active: true,
        });
        
        console.log('Demo-Mode aktiviert!');
      } catch (error) {
        console.error('Fehler beim Aktivieren des Demo-Shops:', error);
        toast.error('Demo-Shop konnte nicht aktiviert werden');
      }
    };

    activateDemoShop();
  }, [setCurrentShop, setIsDemoMode]);

  return <DashboardLayout requireAuth={false}>{children}</DashboardLayout>;
}
