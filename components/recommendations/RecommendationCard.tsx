'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Recommendation } from '@/types/models';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { EnhancedPriceRecommendationCard } from './EnhancedPriceRecommendationCard';
import { getRecommendations } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface RecommendationCardProps {
  recommendation: Recommendation;
  productName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function RecommendationCard({
  recommendation,
  productName,
  onAccept,
  onReject,
  showActions = true,
  compact = false,
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const priceChange = recommendation.recommended_price - recommendation.current_price;
  const priceChangePct = recommendation.price_change_pct;
  const isIncrease = priceChange > 0;
  const isDecrease = priceChange < 0;
  const confidencePercent = Math.round((recommendation.confidence || 0) * 100);

  const statusConfig = {
    pending: { label: 'Offen', icon: Clock, variant: 'warning' as const, color: 'text-warning' },
    accepted: { label: 'Akzeptiert', icon: CheckCircle2, variant: 'success' as const, color: 'text-success' },
    rejected: { label: 'Abgelehnt', icon: XCircle, variant: 'default' as const, color: 'text-muted-foreground' },
    applied: { label: 'Umgesetzt', icon: CheckCircle2, variant: 'success' as const, color: 'text-success' },
  };

  const status = statusConfig[recommendation.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  // Lade vollständige Empfehlungsdaten für EnhancedPriceRecommendationCard
  const { data: fullRecommendation } = useQuery({
    queryKey: ['recommendation', recommendation.product_id],
    queryFn: () => getRecommendations(recommendation.product_id),
    enabled: isExpanded && !!recommendation.product_id,
    select: (data) => Array.isArray(data) ? data[0] : data,
  });

  if (compact) {
    return (
      <div className="w-full p-5 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-900 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-white">{productName || recommendation.product_name || 'Produkt'}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-slate-400">
                €{recommendation.current_price.toFixed(2)} →{' '}
                <span className="font-semibold text-white">€{recommendation.recommended_price.toFixed(2)}</span>
              </span>
              {isIncrease && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +€{Math.abs(priceChange).toFixed(2)} (+{Math.abs(priceChangePct).toFixed(1)}%)
                </span>
              )}
              {isDecrease && (
                <span className="text-red-400 flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  -€{Math.abs(priceChange).toFixed(2)} (-{Math.abs(priceChangePct).toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Badge variant={status.variant} className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </Badge>
            <Badge variant="outline" className={cn('text-xs', status.color)}>
              {confidencePercent}% Vertrauen
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    // ✅ VOLLE BREITE - KEIN max-w-4xl LIMIT
    <div className="w-full p-5 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-900 transition-all">
      {/* ✅ HEADER - NUR HIER TITEL */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-slate-400" strokeWidth={2} />
          </div>
          
          <div>
            {/* ✅ NUR HIER TITEL */}
            <h3 className="text-base font-bold text-white">Preisempfehlung</h3>
            <p className="text-xs text-slate-500">KI-gestützte Analyse</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-sm font-semibold text-slate-300">{confidencePercent}% Sicherheit</span>
          </div>
          
          <button className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all flex items-center justify-center">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
      
      {/* ✅ CONTENT - KEIN TITEL MEHR HIER */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-800/50">
          {/* ✅ DIREKT CONTENT, KEIN HEADER MEHR */}
          {fullRecommendation ? (
            <EnhancedPriceRecommendationCard
              productTitle={productName || recommendation.product_name || 'Produkt'}
              productId={recommendation.product_id}
              currentPrice={recommendation.current_price}
              recommendedPrice={recommendation.recommended_price}
              priceChangePct={recommendation.price_change_pct}
              confidence={recommendation.confidence || 0}
              strategyDetails={fullRecommendation.strategy_details}
              reasoning={fullRecommendation.reasoning}
              createdAt={recommendation.created_at}
              onAccept={async () => {
                if (onAccept) onAccept();
              }}
              onReject={async () => {
                if (onReject) onReject();
              }}
              onUpdate={async () => {}}
              onApply={async () => {
                if (onAccept) onAccept();
              }}
              showHeader={false} // ✅ KEIN HEADER IN CONTENT
            />
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>Lade Empfehlungsdetails...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
