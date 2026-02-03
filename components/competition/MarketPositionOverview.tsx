'use client';

import { TrendingDown, CircleDot, TrendingUp, AlertTriangle, Info } from 'lucide-react';

interface MarketPositionProps {
  yourPrice: number;
  lowestPrice: number;
  averagePrice: number;
  highestPrice: number;
  competitorCount: number;
  cheaperCount: number;
  expensiveCount: number;
}

export function MarketPositionOverview({
  yourPrice,
  lowestPrice,
  averagePrice,
  highestPrice,
  competitorCount,
  cheaperCount,
  expensiveCount
}: MarketPositionProps) {
  // Calculate position percentage (0-100)
  const range = highestPrice - lowestPrice;
  const yourPosition = range > 0 ? ((yourPrice - lowestPrice) / range) * 100 : 50;
  
  // Determine if price is competitive
  const priceRatio = averagePrice > 0 ? ((yourPrice / averagePrice) * 100) - 100 : 0;
  const isExpensive = priceRatio > 10;
  const isCheap = priceRatio < -10;
  const isCompetitive = !isExpensive && !isCheap;
  
  return (
    <div className="rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <CircleDot className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-white">
            Deine Marktposition auf einen Blick
          </h3>
        </div>
      </div>
      
      {/* Slider Visualization */}
      <div className="p-6 pb-8">
        {/* Price Labels */}
        <div className="relative mb-8">
          <div className="flex items-end justify-between mb-3">
            {/* Lowest Price */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Günstigster
                </span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {lowestPrice.toFixed(2)} €
              </div>
            </div>
            
            {/* Average Price */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
                  <CircleDot className="w-4 h-4 text-slate-400" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ø-Preis
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-300 tracking-tight">
                {averagePrice.toFixed(2)} €
              </div>
            </div>
            
            {/* Highest Price */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Teuerster
                </span>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-red-400" strokeWidth={2} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {highestPrice.toFixed(2)} €
              </div>
            </div>
          </div>
          
          {/* ✅ Slider Track mit PADDING & LABEL */}
          <div className="relative">
            {/* Padding wrapper damit Punkt nicht abgeschnitten wird */}
            <div className="relative px-10 py-12">
              {/* Slider Track */}
              <div className="relative h-3 rounded-full bg-gradient-to-r from-emerald-500/20 via-slate-700/30 to-red-500/20 overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-red-500/10" />
              </div>
              
              {/* ✅ Your Price Position - NICHT ABGESCHNITTEN (außerhalb overflow-hidden) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all z-20"
                style={{ left: `${yourPosition}%` }}
              >
                {/* ✅ LABEL OBEN - "DEIN PREIS" */}
                <div className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-30">
                  <div className="relative">
                    {/* Arrow pointing down */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-10">
                      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-500/30" />
                    </div>
                    
                    {/* Label Card */}
                    <div className="px-5 py-3 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/30 backdrop-blur-sm shadow-xl">
                      <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Dein Preis
                      </div>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        {yourPrice.toFixed(2)} €
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 w-14 h-14 -translate-x-1/2 -translate-y-1/2 bg-indigo-500/30 rounded-full blur-xl animate-pulse" />
                
                {/* ✅ Marker Circle - GRÖSSER & AUFFÄLLIGER */}
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-[3px] border-slate-900 shadow-2xl shadow-indigo-500/40 flex items-center justify-center ring-4 ring-indigo-500/20">
                  <div className="w-3.5 h-3.5 rounded-full bg-white shadow-inner" />
                </div>
              </div>
            </div>
          </div>
          
          {/* ✅ LEGENDE - Damit klar ist was was ist */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              <span className="text-xs text-slate-500">Günstigster Preis</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-500/40" />
              <span className="text-xs text-slate-500">Durchschnitt</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 ring-2 ring-indigo-500/30" />
              <span className="text-xs font-semibold text-indigo-400">Dein Preis</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <span className="text-xs text-slate-500">Teuerster Preis</span>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-xs text-slate-500 mb-1">Anbieter gesamt</div>
            <div className="text-2xl font-bold text-white">{competitorCount}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <div className="text-xs text-emerald-400/70 mb-1">Günstiger</div>
            <div className="text-2xl font-bold text-emerald-400">{cheaperCount}</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="text-xs text-red-400/70 mb-1">Teurer</div>
            <div className="text-2xl font-bold text-red-400">{expensiveCount}</div>
          </div>
        </div>
        
        {/* Insight Card */}
        {isExpensive && (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-amber-400 mb-1">
                  Du bist {Math.abs(priceRatio).toFixed(1)}% teurer als der Durchschnitt
                </div>
                <div className="text-xs text-amber-400/70 leading-relaxed">
                  Kunden werden wahrscheinlich zur Konkurrenz wechseln. 
                  Erwäge eine Preisanpassung für bessere Wettbewerbsfähigkeit.
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isCheap && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-4 h-4 text-emerald-400" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-emerald-400 mb-1">
                  Du bist {Math.abs(priceRatio).toFixed(1)}% günstiger als der Durchschnitt
                </div>
                <div className="text-xs text-emerald-400/70 leading-relaxed">
                  Du könntest deine Preise erhöhen, ohne Wettbewerbsfähigkeit zu verlieren. 
                  Mehr Marge möglich!
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isCompetitive && (
          <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-slate-400" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-300 mb-1">
                  Dein Preis ist wettbewerbsfähig
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  Du liegst nahe am Marktdurchschnitt ({priceRatio > 0 ? '+' : ''}{priceRatio.toFixed(1)}%). 
                  Gute Balance zwischen Marge und Wettbewerbsfähigkeit.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
