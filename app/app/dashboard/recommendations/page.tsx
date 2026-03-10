'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, getRecommendations, acceptRecommendation, rejectRecommendation } from '@/lib/api';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useShopStore } from '@/stores/shopStore';
import { switchShop } from '@/lib/api';

export default function AppDashboardRecommendationsPage() {
  const queryClient = useQueryClient();
  const { shopId } = useAuthStore();
  const { currentShop, setCurrentShop } = useShopStore();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const sid = shopId || localStorage.getItem('shop_id');
  const shopIdNum = sid ? parseInt(String(sid), 10) : undefined;

  useEffect(() => {
    if (sid && !currentShop) {
      const id = parseInt(String(sid), 10);
      setCurrentShop({ id, shop_url: null, shop_name: 'Shop', type: 'shopify', is_demo: false } as any);
      switchShop(id, false).catch(() => {});
    }
  }, [sid, currentShop, setCurrentShop]);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', shopIdNum],
    queryFn: () => fetchProducts(shopIdNum),
    enabled: !!shopIdNum,
  });

  const productIds = products?.map((p) => p.id) || [];
  const { data: allRecs } = useQuery({
    queryKey: ['recommendations-bulk', productIds],
    queryFn: async () => {
      const results = await Promise.all(
        productIds.map((id) => getRecommendations(id))
      );
      return results.flat();
    },
    enabled: productIds.length > 0 && !!products,
  });

  const allRecommendations = useMemo(() => {
    if (!allRecs || !Array.isArray(allRecs)) return [];
    return allRecs.map((rec: any) => ({
      ...rec,
      productName: products?.find((p) => p.id === rec.product_id)?.title,
    }));
  }, [allRecs, products]);

  const filteredRecommendations =
    activeTab === 'all'
      ? allRecommendations
      : allRecommendations.filter((rec: any) => {
          if (activeTab === 'pending') return rec.status === 'pending';
          if (activeTab === 'accepted') return rec.status === 'accepted' || rec.status === 'applied';
          if (activeTab === 'rejected') return rec.status === 'rejected';
          return true;
        });

  const handleAccept = async (recommendationId: number) => {
    try {
      await acceptRecommendation(recommendationId);
      toast.success('Empfehlung akzeptiert');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations-bulk'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Akzeptieren');
    }
  };

  const handleReject = async (recommendationId: number) => {
    try {
      await rejectRecommendation(recommendationId);
      toast.success('Empfehlung abgelehnt');
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['recommendations-bulk'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Ablehnen');
    }
  };

  const isLoading = productsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const pendingCount = allRecommendations.filter((r: any) => r.status === 'pending').length;
  const acceptedCount = allRecommendations.filter((r: any) => r.status === 'accepted' || r.status === 'applied').length;
  const rejectedCount = allRecommendations.filter((r: any) => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Preisempfehlungen</h1>
          <p className="text-slate-400">
            {allRecommendations.length} Empfehlungen für {products?.length || 0} Produkte
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">Alle ({allRecommendations.length})</TabsTrigger>
            <TabsTrigger value="pending">Offen ({pendingCount})</TabsTrigger>
            <TabsTrigger value="accepted">Umgesetzt ({acceptedCount})</TabsTrigger>
            <TabsTrigger value="rejected">Abgelehnt ({rejectedCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>Keine Empfehlungen gefunden</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((recommendation: any) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    productName={recommendation.productName}
                    onAccept={() => handleAccept(recommendation.id)}
                    onReject={() => handleReject(recommendation.id)}
                    showActions={recommendation.status === 'pending'}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
