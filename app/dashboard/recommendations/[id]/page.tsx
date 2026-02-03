'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchProducts,
  getRecommendations,
  generateRecommendation,
  calculateMargin,
  saveProductCosts,
  getProductCosts,
  acceptRecommendation,
  rejectRecommendation,
  searchCompetitors,
} from '@/lib/api';
import { ProductAnalysisHeader } from '@/components/recommendations/ProductAnalysisHeader';
import { EnhancedMarginAnalysis } from '@/components/recommendations/EnhancedMarginAnalysis';
import { EnhancedPriceRecommendationCard } from '@/components/recommendations/EnhancedPriceRecommendationCard';
import { StrategyBreakdown } from '@/components/recommendations/StrategyBreakdown';
import { MarketPositionDashboard } from '@/components/recommendations/MarketPositionDashboard';
import { PriceComparisonChart } from '@/components/recommendations/PriceComparisonChart';
import { CostInputModal } from '@/components/recommendations/CostInputModal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, ShoppingCart, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useShopStore } from '@/stores/shopStore';
import { toast } from 'sonner';
import { applyRecommendedPrice } from '@/lib/shopifyService';
import type { MarginCalculationResult, ProductCostData } from '@/types/models';

export default function DashboardRecommendationPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const queryClient = useQueryClient();
  const { currentShop } = useShopStore();
  const [generating, setGenerating] = useState(false);
  const [isEditingCosts, setIsEditingCosts] = useState(false);
  const [marginResult, setMarginResult] = useState<MarginCalculationResult | null>(null);
  const [costs, setCosts] = useState<ProductCostData | null>(null);

  const shopId = currentShop?.id;

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', shopId],
    queryFn: () => fetchProducts(shopId),
    enabled: !!shopId,
  });

  const { data: recommendations, isLoading: recLoading } = useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => getRecommendations(productId),
    enabled: !!productId && !!shopId,
  });

  const { data: competitorsData, isLoading: competitorsLoading } = useQuery({
    queryKey: ['competitors', productId],
    queryFn: () => searchCompetitors(productId),
    enabled: !!productId && !!shopId,
  });

  const product = products?.find((p) => p.id === productId);
  const recommendation = recommendations?.[0]; // Neueste Empfehlung
  const competitors = competitorsData?.competitors || [];

  // Load margin data
  useEffect(() => {
    if (product?.price && product?.id) {
      calculateMargin(product.id.toString(), product.price)
        .then(setMarginResult)
        .catch(() => {
          // Silent fail
        });
    }
  }, [product?.id, product?.price]);

  // Load costs
  useEffect(() => {
    if (product?.id) {
      getProductCosts(product.id.toString())
        .then((data) => {
          if (data) setCosts(data);
        })
        .catch(() => {
          // Silent fail
        });
    }
  }, [product?.id]);

  const handleGenerateRecommendation = async () => {
    setGenerating(true);
    try {
      const result = await generateRecommendation(productId);
      toast.success('Empfehlung erfolgreich generiert!');
      queryClient.invalidateQueries({ queryKey: ['recommendations', productId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Generieren der Empfehlung');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!recommendation) return;
    try {
      await acceptRecommendation(recommendation.id);
      toast.success('Empfehlung akzeptiert');
      queryClient.invalidateQueries({ queryKey: ['recommendations', productId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Akzeptieren');
    }
  };

  const handleReject = async () => {
    if (!recommendation) return;
    try {
      await rejectRecommendation(recommendation.id);
      toast.success('Empfehlung abgelehnt');
      queryClient.invalidateQueries({ queryKey: ['recommendations', productId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Ablehnen');
    }
  };

  const handleUpdate = async () => {
    await handleGenerateRecommendation();
  };

  const handleApply = async () => {
    if (!recommendation || !product) return;
    try {
      await applyRecommendedPrice({
        product_id: product.id,
        recommended_price: recommendation.recommended_price,
        recommendation_id: recommendation.id,
      });
      toast.success('Preis erfolgreich zu Shopify gesendet!');
      queryClient.invalidateQueries({ queryKey: ['recommendations', productId] });
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Anwenden des Preises');
    }
  };

  const handleCostsSave = async (costData: ProductCostData) => {
    if (!product) return;
    try {
      await saveProductCosts(product.id.toString(), costData);
      setCosts(costData);
      toast.success('Kosten gespeichert');
      // Recalculate margin
      const newMargin = await calculateMargin(product.id.toString(), product.price);
      setMarginResult(newMargin);
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern');
    }
  };

  if (productsLoading || recLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-48 w-full" />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Produkt nicht gefunden</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare strategy details for StrategyBreakdown
  const strategyDetails = Array.isArray(recommendation?.strategy_details)
    ? recommendation.strategy_details
    : recommendation?.strategy_details
    ? [recommendation.strategy_details]
    : [];
  const totalImpact = recommendation
    ? recommendation.recommended_price - recommendation.current_price
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <ProductAnalysisHeader
        productTitle={product.title}
        currentPrice={product.price}
        productImage={product.image}
        productSku={product.sku}
        productCost={costs?.purchase || product.cost}
        productMargin={marginResult?.margin?.percent || 0}
        productPotential={recommendation ? recommendation.recommended_price - recommendation.current_price : 0}
        onBack={() => router.back()}
        onGenerate={handleGenerateRecommendation}
        isGenerating={generating}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Generate Recommendation Card - REMOVED */}
        {/* ✅ Card removed - Button now integrated in ProductAnalysisHeader */}

        {/* Accordion Sections - Alle standardmäßig zugeklappt */}
        <Accordion type="multiple" defaultValue={[]}>
          {/* 1. MARGEN-ANALYSE */}
          <AccordionItem value="margin">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <span>Margen-Analyse</span>
                {marginResult && (
                  <Badge variant="outline" className="ml-2">
                    {marginResult.margin?.percent.toFixed(1) || '0.0'}%
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <EnhancedMarginAnalysis
                price={product.price}
                costs={costs || undefined}
                marginResult={
                  marginResult || {
                    has_cost_data: false,
                    selling_price: product.price,
                    net_revenue: 0,
                    costs: {
                      purchase: 0,
                      shipping: 0,
                      packaging: 0,
                      payment_fee: 0,
                      total_variable: 0,
                    },
                    margin: { euro: 0, percent: 0 },
                    break_even_price: 0,
                    recommended_min_price: 0,
                    is_above_break_even: false,
                    is_above_min_margin: false,
                  }
                }
                onEdit={() => setIsEditingCosts(true)}
              />
            </AccordionContent>
          </AccordionItem>

          {/* 2. PREISEMPFEHLUNG */}
          <AccordionItem value="recommendation">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Preisempfehlung</span>
                <Badge variant="default" className="ml-2">
                  KI-basiert
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {recommendation ? (
                  <>
                    <EnhancedPriceRecommendationCard
                      productTitle={product.title}
                      currentPrice={product.price}
                      recommendedPrice={recommendation.recommended_price}
                      priceChangePct={recommendation.price_change_pct}
                      confidence={recommendation.confidence}
                      strategyDetails={strategyDetails}
                      reasoning={recommendation.reasoning}
                      createdAt={recommendation.created_at}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onUpdate={handleUpdate}
                      onApply={handleApply}
                      isDemo={false}
                    />

                    {/* Strategy Breakdown */}
                    {strategyDetails.length > 0 && (
                      <StrategyBreakdown
                        strategies={strategyDetails}
                        totalImpact={totalImpact}
                        priceChangePercentage={recommendation.price_change_pct}
                      />
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        Für dieses Produkt wurde noch keine Preisempfehlung generiert.
                      </p>
                      <Button onClick={handleGenerateRecommendation} disabled={generating}>
                        {generating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generiere...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Empfehlung generieren
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. WETTBEWERBSANALYSE */}
          <AccordionItem value="competitors">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>Wettbewerbsanalyse</span>
                <Badge variant="outline" className="ml-2">
                  {competitors.length} Anbieter
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {competitorsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Market Position Dashboard */}
                  <MarketPositionDashboard
                    currentPrice={product.price}
                    competitors={competitors}
                  />

                  {/* Price Comparison Chart */}
                  <PriceComparisonChart
                    competitors={competitors}
                    currentPrice={product.price}
                    chartType="line"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Cost Input Modal */}
      <CostInputModal
        isOpen={isEditingCosts}
        onClose={() => setIsEditingCosts(false)}
        productId={product.id.toString()}
        productTitle={product.title}
        currentPrice={product.price}
        existingCosts={costs}
        onSave={handleCostsSave}
      />
    </div>
  );
}
