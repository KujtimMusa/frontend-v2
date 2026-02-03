'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CompetitorPrice } from '@/types/models';

interface CompetitorListProps {
  competitors: CompetitorPrice[];
  currentPrice: number;
  showTabs?: boolean;
}

const getCondition = (competitor: CompetitorPrice): 'new' | 'used' | 'refurbished' => {
  const titleLower = (competitor.title || '').toLowerCase();
  const sourceLower = (competitor.source || '').toLowerCase();

  if (
    titleLower.includes('gebraucht') ||
    titleLower.includes('used') ||
    sourceLower.includes('kleinanzeigen') ||
    sourceLower.includes('willhaben')
  ) {
    return 'used';
  } else if (
    titleLower.includes('refurbished') ||
    titleLower.includes('generalüberholt')
  ) {
    return 'refurbished';
  }
  return 'new';
};

const getConditionBadge = (condition: string) => {
  switch (condition) {
    case 'new':
      return { label: 'Neuware', variant: 'default' as const, color: 'bg-emerald-900/30 text-emerald-400 border-emerald-800' };
    case 'refurbished':
      return { label: 'Refurbished', variant: 'default' as const, color: 'bg-amber-900/30 text-amber-400 border-amber-800' };
    case 'used':
      return { label: 'Gebraucht', variant: 'default' as const, color: 'bg-slate-800 text-slate-400 border-slate-700' };
    default:
      return { label: 'Unbekannt', variant: 'default' as const, color: 'bg-slate-800 text-slate-400 border-slate-700' };
  }
};

export function CompetitorList({ competitors, currentPrice, showTabs = true }: CompetitorListProps) {
  if (competitors.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">Keine Wettbewerber gefunden</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by price
  const sortedCompetitors = [...competitors].sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">

      {/* Competitor Cards */}
      <div className="space-y-3">
        {sortedCompetitors.map((competitor, index) => {
          const condition = getCondition(competitor);
          const conditionBadge = getConditionBadge(condition);
          const priceDiff = competitor.price - currentPrice;
          const priceDiffPercent = (priceDiff / currentPrice) * 100;
          const rank = index + 1;

          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0',
                    rank === 1
                      ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  )}
                >
                  #{rank}
                </div>

                {/* Product Image */}
                <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Package className="w-8 h-8 text-slate-600" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={competitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-slate-100 hover:text-slate-300 truncate"
                    >
                      {competitor.source}
                    </a>
                    {competitor.rating && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{competitor.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-slate-300 mb-2 line-clamp-2">{competitor.title}</div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={cn('text-xs', conditionBadge.color)}>
                      {condition === 'new' ? '🟢 Neuware' : condition === 'refurbished' ? '🟡 Refurbished' : '🟡 Gebraucht'}
                    </Badge>

                    {competitor.in_stock !== undefined && (
                      <Badge
                        className={cn(
                          'text-xs',
                          competitor.in_stock
                            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                            : 'bg-red-900/30 text-red-400 border-red-800'
                        )}
                      >
                        {competitor.in_stock ? '✅ Auf Lager' : '❌ Nicht verfügbar'}
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    Aktualisiert: {new Date(competitor.scraped_at).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-slate-100 mb-1">
                    {competitor.price.toFixed(2)} €
                  </div>

                  {priceDiff !== 0 && (
                    <div
                      className={cn(
                        'text-sm font-medium mb-2',
                        priceDiff < 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {priceDiff < 0 ? '' : '+'}
                      {priceDiff.toFixed(2)}€ ({priceDiff < 0 ? '' : '+'}
                      {priceDiffPercent.toFixed(1)}%)
                    </div>
                  )}

                  {Math.abs(priceDiffPercent) > 30 && (
                    <Badge
                      className={cn(
                        'mb-2 text-xs',
                        priceDiff < 0
                          ? 'bg-red-900/30 text-red-400 border-red-800'
                          : 'bg-amber-900/30 text-amber-400 border-amber-800'
                      )}
                    >
                      {priceDiff < 0 ? '⚠️ VIEL GÜNSTIGER!' : '💰 Viel teurer'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
