'use client';

import { Badge } from '@/components/ui/badge';
import { Trophy, DollarSign, CheckCircle2, AlertCircle, AlertTriangle, Store, BarChart3, ArrowLeftRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CompetitorPrice } from '@/types/models';

interface CompetitorAnalysisHeaderProps {
  competitors: CompetitorPrice[];
  yourPrice: number;
}

export function CompetitorAnalysisHeader({
  competitors,
  yourPrice,
}: CompetitorAnalysisHeaderProps) {
  if (competitors.length === 0) {
    return null;
  }

  const prices = competitors.map((c) => c.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  const cheapestCompetitor = competitors.find((c) => c.price === minPrice);
  const mostExpensiveCompetitor = competitors.find((c) => c.price === maxPrice);

  // Calculate position (0-100%, where 0% = cheapest, 100% = most expensive)
  const yourPosition = ((yourPrice - minPrice) / (maxPrice - minPrice)) * 100;

  const competitorsCheaper = competitors.filter((c) => c.price < yourPrice).length;
  const competitorsMoreExpensive = competitors.filter((c) => c.price > yourPrice).length;
  const deviation = yourPrice - averagePrice;

  return (
    <div className="space-y-6">
      {/* Price Comparison Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Günstigster */}
        <div className="p-6 rounded-xl border border-emerald-800/30 bg-emerald-900/10 relative">
          <div className="absolute top-4 right-4">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">GÜNSTIGSTER</div>
          <div className="text-3xl font-bold text-emerald-400 mb-3">{minPrice.toFixed(2)} €</div>
          <div className="text-sm text-emerald-400/70">
            {((yourPrice - minPrice) / yourPrice * 100).toFixed(0)}% günstiger
          </div>
          {cheapestCompetitor && (
            <div className="text-xs text-slate-500 mt-1 truncate">{cheapestCompetitor.source}</div>
          )}
        </div>

        {/* Dein Preis */}
        <div className="p-6 rounded-xl border-2 border-slate-600 bg-slate-800/50 relative">
          <div className="absolute top-4 right-4">
            <Badge className="bg-slate-700 text-slate-100 border-slate-600">📍 DU</Badge>
          </div>
          <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">DEIN PREIS</div>
          <div className="text-3xl font-bold text-slate-100 mb-3">{yourPrice.toFixed(2)} €</div>
          <div
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              yourPosition >= 40 && yourPosition <= 60
                ? 'text-emerald-400'
                : yourPosition < 40
                ? 'text-amber-400'
                : 'text-red-400'
            )}
          >
            {yourPosition >= 40 && yourPosition <= 60 ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Gut positioniert (Mittelfeld)</span>
              </>
            ) : yourPosition < 40 ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Günstiger als Durchschnitt</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Teurer als Durchschnitt</span>
              </>
            )}
          </div>
        </div>

        {/* Teuerster */}
        <div className="p-6 rounded-xl border border-red-800/30 bg-red-900/10 relative">
          <div className="absolute top-4 right-4">
            <DollarSign className="w-6 h-6 text-red-400" />
          </div>
          <div className="text-sm text-slate-400 mb-2 uppercase tracking-wide">TEUERSTER</div>
          <div className="text-3xl font-bold text-red-400 mb-3">{maxPrice.toFixed(2)} €</div>
          <div className="text-sm text-red-400/70">
            {((maxPrice - yourPrice) / yourPrice * 100).toFixed(0)}% teurer
          </div>
          {mostExpensiveCompetitor && (
            <div className="text-xs text-slate-500 mt-1 truncate">{mostExpensiveCompetitor.source}</div>
          )}
        </div>
      </div>

      {/* Stats Cards Enhanced */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 uppercase tracking-wide">ANBIETER</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">{competitors.length}</div>
          <div className="text-xs text-emerald-400">✅ Genug Daten für Analyse</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 uppercase tracking-wide">DURCHSCHNITT</span>
          </div>
          <div className="text-2xl font-bold text-slate-100 mb-1">{averagePrice.toFixed(2)} €</div>
          <div
            className={cn(
              'text-xs font-medium',
              yourPrice < averagePrice
                ? 'text-emerald-400'
                : yourPrice > averagePrice
                ? 'text-amber-400'
                : 'text-slate-400'
            )}
          >
            Du: {yourPrice < averagePrice ? '-' : '+'}
            {Math.abs(yourPrice - averagePrice).toFixed(2)}€
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 uppercase tracking-wide">PREISSPANNE</span>
          </div>
          <div className="text-lg font-bold text-slate-100 mb-1">
            {minPrice.toFixed(0)}-{maxPrice.toFixed(0)} €
          </div>
          <div className="text-xs text-slate-400">Range: {(maxPrice - minPrice).toFixed(2)}€</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400 uppercase tracking-wide">POSITION</span>
          </div>
          <div
            className={cn(
              'text-2xl font-bold mb-1',
              deviation < 0 ? 'text-emerald-400' : 'text-amber-400'
            )}
          >
            {deviation < 0 ? '' : '+'}
            {deviation.toFixed(2)}€
          </div>
          <div className="text-xs text-slate-400">
            {competitorsCheaper} günstiger, {competitorsMoreExpensive} teurer
          </div>
        </div>
      </div>
    </div>
  );
}
