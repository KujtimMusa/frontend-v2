'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useShopStore } from '@/stores/shopStore';
import { useQuery } from '@tanstack/react-query';
import { getAvailableShops, switchShop } from '@/lib/api';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function ShopSwitcher() {
  const { currentShop, setCurrentShop, setShops } = useShopStore();

  const { data: shopsData } = useQuery({
    queryKey: ['shops'],
    queryFn: getAvailableShops,
  });

  useEffect(() => {
    if (shopsData?.shops) {
      setShops(shopsData.shops);
      if (!currentShop && shopsData.shops.length > 0) {
        const demoShop = shopsData.shops.find((s) => s.type === 'demo');
        if (demoShop) {
          setCurrentShop(demoShop);
        }
      }
    }
  }, [shopsData, currentShop, setCurrentShop, setShops]);

  const handleSwitch = async (shopId: string) => {
    const shop = shopsData?.shops.find((s) => s.id === parseInt(shopId));
    if (!shop) return;

    try {
      await switchShop(shop.id, shop.type === 'demo');
      setCurrentShop(shop);
      toast.success(`Zu ${shop.name} gewechselt`);
      window.dispatchEvent(new CustomEvent('shop-switched'));
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Wechseln des Shops');
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="text-sm text-slate-100">Aktiver Shop</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={currentShop?.id.toString()}
          onValueChange={handleSwitch}
        >
          <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
            <SelectValue>
              {currentShop?.name || 'Kein Shop ausgewählt'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            {shopsData?.shops.map((shop) => (
              <SelectItem 
                key={shop.id} 
                value={shop.id.toString()}
                className="text-slate-100 hover:bg-slate-800 focus:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  {shop.type === 'demo' && (
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">Demo</Badge>
                  )}
                  <span>{shop.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
