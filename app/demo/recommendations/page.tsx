'use client';

import { useQuery } from '@tanstack/react-query';
import { getDemoProducts, getDemoRecommendation } from '@/lib/api';
import { RecommendationCard } from '@/components/recommendations/RecommendationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { acceptRecommendation, rejectRecommendation } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function DemoRecommendationsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['demo', 'products'],
    queryFn: getDemoProducts,
  });

  // Lade Empfehlungen für alle Produkte
  const productIds = products?.map((p) => p.id) || [];
  const recommendationsQueries = productIds.map((productId) =>
    useQuery({
      queryKey: ['demo', 'recommendation', productId],
      queryFn: () => getDemoRecommendation(productId),
      enabled: !!productId && !!products,
    })
  );

  const isLoading = productsLoading || recommendationsQueries.some((q) => q.isLoading);

  // Sammle alle Empfehlungen
  const allRecommendations = recommendationsQueries
    .map((query, index) => ({
      ...query.data,
      productName: products?.[index]?.title,
    }))
    .filter((rec) => rec && rec.id) as Array<{
    id: number;
    product_id: number;
    productName?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'applied';
    [key: string]: any;
  }>;

  // Filter nach Tab
  const filteredRecommendations =
    activeTab === 'all'
      ? allRecommendations
      : allRecommendations.filter((rec) => {
          if (activeTab === 'pending') return rec.status === 'pending';
          if (activeTab === 'accepted') return rec.status === 'accepted' || rec.status === 'applied';
          if (activeTab === 'rejected') return rec.status === 'rejected';
          return true;
        });

  const handleAccept = async (recommendationId: number) => {
    try {
      await acceptRecommendation(recommendationId);
      toast.success('Empfehlung akzeptiert');
      queryClient.invalidateQueries({ queryKey: ['demo', 'recommendation'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Akzeptieren');
    }
  };

  const handleReject = async (recommendationId: number) => {
    try {
      await rejectRecommendation(recommendationId);
      toast.success('Empfehlung abgelehnt');
      queryClient.invalidateQueries({ queryKey: ['demo', 'recommendation'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Ablehnen');
    }
  };

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

  const pendingCount = allRecommendations.filter((r) => r.status === 'pending').length;
  const acceptedCount = allRecommendations.filter((r) => r.status === 'accepted' || r.status === 'applied').length;
  const rejectedCount = allRecommendations.filter((r) => r.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* ✅ VOLLE BREITE CONTAINER */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Preisempfehlungen</h1>
          <p className="text-slate-400">
            Demo-Shop mit {allRecommendations.length} Empfehlungen
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">
              Alle ({allRecommendations.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Offen ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Umgesetzt ({acceptedCount})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Abgelehnt ({rejectedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p>Keine Empfehlungen gefunden</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation as any}
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
