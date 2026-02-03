'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Recommendation } from '@/types/models';
import { applyRecommendedPrice } from '@/lib/shopifyService';

interface PriceRecommendationCardProps {
  recommendation: Recommendation;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  onApply?: () => Promise<void>;
  productId?: number;
  recommendationId?: number;
  isDemo?: boolean;
}

export function PriceRecommendationCard({
  recommendation,
  onAccept,
  onReject,
  onApply,
  productId,
  recommendationId,
  isDemo = false,
}: PriceRecommendationCardProps) {
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await onAccept();
      toast.success('Empfehlung akzeptiert');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Akzeptieren');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPrice = async () => {
    const recommendedPrice = recommendation.recommended_price ?? recommendation.recommendation;
    if (!productId || !recommendedPrice) return;
    
    setApplying(true);
    try {
      const result = await applyRecommendedPrice({
        product_id: productId,
        recommended_price: recommendedPrice,
        recommendation_id: recommendationId,
      });
      
      toast.success(
        `Preis erfolgreich zu Shopify gesendet! Neuer Preis: €${result.new_price.toFixed(2)}`
      );
      
      // Refresh recommendation
      if (onAccept) await onAccept();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Fehler beim Anwenden des Preises'
      );
    } finally {
      setApplying(false);
    }
  };

  // Safe access to recommendation values with fallbacks
  const recommendedPrice = recommendation.recommended_price ?? recommendation.recommendation ?? 0;
  const currentPrice = recommendation.current_price ?? 0;
  const confidence = recommendation.confidence ?? 0;
  const status = recommendation.status || 'pending';
  
  // Calculate price change safely
  const priceChange = recommendedPrice - currentPrice;
  const priceChangePct = currentPrice > 0 ? (priceChange / currentPrice) * 100 : 0;

  // Early return if essential data is missing
  if (!recommendedPrice || !currentPrice) {
    return (
      <Card className="border-2 border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-slate-100">Keine Empfehlung verfügbar</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Die Empfehlungsdaten sind unvollständig. Bitte generiere eine neue Empfehlung.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-slate-700 bg-slate-900/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <CardTitle>KI-Preisempfehlung</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-2">Empfohlener Preis:</p>
          <div className="text-5xl font-bold text-primary">
            €{recommendedPrice.toFixed(2)}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Erwarteter Uplift:</span>
            <span
              className={cn(
                'font-bold',
                priceChange > 0 ? 'text-success' : 'text-error'
              )}
            >
              {priceChange > 0 ? '+' : ''}€{priceChange.toFixed(2)} pro Verkauf
            </span>
          </div>
          <div className="flex justify-between">
            <span>Preisänderung:</span>
            <span
              className={cn(
                'font-bold',
                priceChangePct > 0 ? 'text-success' : 'text-error'
              )}
            >
              {priceChangePct > 0 ? '+' : ''}
              {priceChangePct.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Vertrauen:</span>
            <Badge
              variant={
                confidence > 0.8
                  ? 'success'
                  : confidence > 0.6
                  ? 'warning'
                  : 'default'
              }
            >
              {Math.round(confidence * 100)}%
            </Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Begründung:</h4>
          <p className="text-sm text-muted-foreground">
            {recommendation.reasoning || 'Keine Begründung verfügbar.'}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button
            className="flex-1"
            size="lg"
            variant="default"
            onClick={handleAccept}
            disabled={loading || applying}
          >
            {loading ? 'Wird akzeptiert...' : 'Empfehlung annehmen'}
          </Button>
          <Button
            className="flex-1"
            size="lg"
            variant="outline"
            onClick={onReject}
            disabled={loading || applying}
          >
            Ablehnen
          </Button>
          {!isDemo && status === 'accepted' && (
            <Button
              className="flex-1"
              size="lg"
              variant="default"
              onClick={handleApplyPrice}
              disabled={applying || loading}
            >
              {applying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wende an...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Preis zu Shopify senden
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
