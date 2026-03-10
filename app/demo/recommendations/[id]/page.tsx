'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDemoProducts,
  getDemoRecommendation,
  generateRecommendation,
  calculateMargin,
  saveProductCosts,
  getProductCosts,
  acceptRecommendation,
  rejectRecommendation,
  searchCompetitors,
} from '@/lib/api';
import { ProductAnalysisHeader } from '@/components/recommendations/ProductAnalysisHeader';
import { GenerateRecommendationCTA } from '@/components/recommendations/GenerateRecommendationCTA';
import { EnhancedMarginAnalysis } from '@/components/recommendations/EnhancedMarginAnalysis';
import { EnhancedPriceRecommendationCard } from '@/components/recommendations/EnhancedPriceRecommendationCard';
import { StrategyBreakdown } from '@/components/recommendations/StrategyBreakdown';
import { MarketPositionDashboard } from '@/components/recommendations/MarketPositionDashboard';
import { PriceComparisonChart } from '@/components/recommendations/PriceComparisonChart';
import { CompetitorPriceChart } from '@/components/recommendations/CompetitorPriceChart';
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
import { DollarSign, TrendingUp, ShoppingCart, Sparkles, Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { MarginCalculationResult, ProductCostData } from '@/types/models';

export default function DemoRecommendationPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [isEditingCosts, setIsEditingCosts] = useState(false);
  const [marginResult, setMarginResult] = useState<MarginCalculationResult | null>(null);
  const [costs, setCosts] = useState<ProductCostData | null>(null);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['demo', 'products'],
    queryFn: getDemoProducts,
  });

  const { data: recommendation, isLoading: recLoading } = useQuery({
    queryKey: ['demo', 'recommendation', productId],
    queryFn: () => getDemoRecommendation(productId),
    enabled: !!productId,
  });

  const { data: competitorsData, isLoading: competitorsLoading } = useQuery({
    queryKey: ['demo', 'competitors', productId],
    queryFn: () => searchCompetitors(productId),
    enabled: !!productId,
  });

  const product = products?.find((p) => p.id === productId);
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
      queryClient.invalidateQueries({ queryKey: ['demo', 'recommendation', productId] });
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
      queryClient.invalidateQueries({ queryKey: ['demo', 'recommendation', productId] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Akzeptieren');
    }
  };

  const handleReject = async () => {
    if (!recommendation) return;
    try {
      await rejectRecommendation(recommendation.id);
      toast.success('Empfehlung abgelehnt');
      queryClient.invalidateQueries({ queryKey: ['demo', 'recommendation', productId] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Ablehnen');
    }
  };

  const handleUpdate = async () => {
    await handleGenerateRecommendation();
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
      <div className="min-h-screen bg-slate-950">
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">Produkt nicht gefunden</p>
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

  // Calculate margin and potential
  const margin = marginResult?.margin?.percent || 0;
  const potential = recommendation
    ? recommendation.recommended_price - recommendation.current_price
    : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Header */}
        <ProductAnalysisHeader
          productTitle={product.title}
          currentPrice={product.price}
          productImage={product.image}
          productSku={product.sku}
          productCost={costs?.purchase_cost ?? product.cost}
          productMargin={margin}
          productPotential={potential}
          onBack={() => router.back()}
          onGenerate={handleGenerateRecommendation}
          isGenerating={generating}
        />

        {/* Generate Recommendation CTA - REMOVED */}
        {/* ✅ Card removed - Button now integrated in ProductAnalysisHeader */}

        {/* Accordion Sections - Alle standardmäßig zugeklappt */}
        <Accordion type="multiple" defaultValue={[]}>
          {/* 1. MARGEN-ANALYSE */}
          <AccordionItem value="margin" className="border-slate-800">
            <AccordionTrigger className="hover:no-underline group">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100">Margen-Analyse</div>
                    <div className="text-sm text-slate-400">
                      {marginResult?.is_above_min_margin
                        ? 'Deine Marge ist überdurchschnittlich gut'
                        : 'Marge könnte optimiert werden'}
                    </div>
                  </div>
                </div>
                {marginResult && (
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                      {marginResult.margin?.percent.toFixed(1) || '0.0'}%
                    </Badge>
                    {marginResult.is_above_min_margin && (
                      <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                        ✅
                      </Badge>
                    )}
                  </div>
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
          <AccordionItem value="recommendation" className="border-slate-800">
            <AccordionTrigger className="hover:no-underline group">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100">Preisempfehlung</div>
                    <div className="text-sm text-slate-400">
                      {recommendation
                        ? `€${recommendation.recommended_price.toFixed(2)} empfohlen (+€${(recommendation.recommended_price - recommendation.current_price).toFixed(2)} Uplift)`
                        : 'Noch keine Empfehlung vorhanden'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-800 text-slate-300 border-slate-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    KI
                  </Badge>
                  {recommendation && (
                    <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                      Neu
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {recommendation ? (
                  <>
                    <EnhancedPriceRecommendationCard
                      productTitle={product.title}
                      productId={product.id}
                      currentPrice={product.price}
                      recommendedPrice={recommendation.recommended_price}
                      priceChangePct={recommendation.price_change_pct}
                      confidence={recommendation.confidence}
                      strategyDetails={strategyDetails}
                      reasoning={recommendation.reasoning}
                      strategy={recommendation.strategy}
                      createdAt={recommendation.created_at}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onUpdate={handleUpdate}
                      onApply={async () => {
                        await handleAccept();
                      }}
                      isDemo={true}
                      salesData={{ count: recommendation.sales_30d }}
                      competitorData={competitors}
                      currentMargin={marginResult?.margin?.percent}
                      targetMargin={marginResult?.margin?.percent ? marginResult.margin.percent + 5 : undefined}
                      dataSource="Live-Daten"
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
                  <Card className="border-slate-800 bg-slate-900/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-slate-400 mb-4">
                        Für dieses Produkt wurde noch keine Preisempfehlung generiert.
                      </p>
                      <Button
                        onClick={handleGenerateRecommendation}
                        disabled={generating}
                        className="bg-slate-100 hover:bg-white text-slate-900 font-bold"
                      >
                        {generating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generiere...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
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
          <AccordionItem value="competitors" className="border-slate-800">
            <AccordionTrigger className="hover:no-underline group">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100">Wettbewerbsanalyse</div>
                    <div className="text-sm text-slate-400">
                      {competitors.length > 0
                        ? `${competitors.filter((c) => c.price > product.price).length} teurer, ${competitors.filter((c) => c.price < product.price).length} günstiger als du`
                        : 'Keine Konkurrenten gefunden'}
                    </div>
                  </div>
                </div>
                <Badge className="bg-slate-800 text-slate-300 border-slate-700">
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

                  {/* Price Comparison Chart with Filters */}
                  <CompetitorPriceChart competitors={competitors} currentPrice={product.price} />
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
