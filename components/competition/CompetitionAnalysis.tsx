'use client';

import { useState } from 'react';
import { 
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CompetitorPrice } from '@/types/models';

interface CompetitionAnalysisProps {
  your_price: number;
  competitors: CompetitorPrice[];
}

export function CompetitionAnalysis({ 
  your_price,
  competitors
}: CompetitionAnalysisProps) {
  const [showAllCompetitors, setShowAllCompetitors] = useState(false);
  
  if (competitors.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 text-center text-slate-400">
        <p>Keine Wettbewerber gefunden</p>
      </div>
    );
  }
  
  // Calculate market statistics
  const prices = competitors.map((c) => c.price);
  const average_price = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const cheapest_price = Math.min(...prices);
  const most_expensive_price = Math.max(...prices);
  
  const price_diff = your_price - average_price;
  const price_diff_pct = ((your_price - average_price) / average_price) * 100;
  
  const cheaper_count = competitors.filter(c => c.price < your_price).length;
  const more_expensive_count = competitors.filter(c => c.price > your_price).length;
  
  // Calculate position percentage for visualization
  const range = most_expensive_price - cheapest_price;
  const your_position_pct = range > 0 ? ((your_price - cheapest_price) / range) * 100 : 50;
  const avg_position_pct = range > 0 ? ((average_price - cheapest_price) / range) * 100 : 50;
  
  // Sort competitors by price
  const sortedCompetitors = [...competitors].sort((a, b) => a.price - b.price);
  
  return (
    <div className="space-y-6">
      {/* ✅ DEINE MARKTPOSITION - HEADER CARD */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
        <h3 className="text-base font-bold text-white mb-6">
          Deine Marktposition auf einen Blick
        </h3>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Dein Preis */}
          <div className="text-center">
            <div className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">
              Dein Preis
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {your_price.toFixed(2)}€
            </div>
            <div className={cn(
              "text-sm font-medium",
              price_diff > 0 ? 'text-red-400' : price_diff < 0 ? 'text-emerald-400' : 'text-slate-500'
            )}>
              {price_diff === 0 ? 'Im Durchschnitt' : (
                <>
                  {price_diff > 0 ? '+' : ''}{price_diff.toFixed(2)}€ vom Ø
                </>
              )}
            </div>
          </div>
          
          {/* Marktdurchschnitt */}
          <div className="text-center">
            <div className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">
              Marktdurchschnitt
            </div>
            <div className="text-3xl font-bold text-slate-400 mb-2">
              {average_price.toFixed(2)}€
            </div>
            <div className="text-sm text-slate-500">
              von {competitors.length} Anbietern
            </div>
          </div>
          
          {/* Preisspanne */}
          <div className="text-center">
            <div className="text-xs text-slate-600 uppercase tracking-wider font-medium mb-2">
              Preisspanne
            </div>
            <div className="text-lg font-bold text-white mb-2">
              {cheapest_price.toFixed(2)}€ - {most_expensive_price.toFixed(2)}€
            </div>
            <div className="text-sm text-slate-500">
              Niedrigster bis Höchster
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ PRICE POSITIONING - KLARE VISUALISIERUNG */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white">
            Wo stehst du im Vergleich?
          </h3>
          
          {price_diff !== 0 && (
            price_diff > 0 ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <TrendingUp className="w-4 h-4 text-red-400" strokeWidth={2} />
                <span className="text-sm font-semibold text-red-400">
                  {price_diff_pct.toFixed(1)}% über Durchschnitt
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <TrendingDown className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                <span className="text-sm font-semibold text-emerald-400">
                  {Math.abs(price_diff_pct).toFixed(1)}% unter Durchschnitt
                </span>
              </div>
            )
          )}
        </div>
        
        {/* ✅ SIMPLE RANGE VISUALIZATION */}
        <div className="space-y-6">
          {/* Labels oben */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
              <span>Günstigster: {cheapest_price.toFixed(2)}€</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Durchschnitt: {average_price.toFixed(2)}€</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <span>Teuerster: {most_expensive_price.toFixed(2)}€</span>
            </div>
          </div>
          
          {/* ✅ ELEGANTE VISUALISIERUNG - SLATE-TÖNE */}
          <div className="relative">
            {/* Background bar - Subtiler Gradient */}
            <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500/10 via-slate-700/50 to-red-500/10 border border-slate-700/50" />
            
            {/* ✅ Durchschnitt Marker - JETZT SICHTBAR */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-slate-500"
              style={{ left: `${avg_position_pct}%` }}
            />
            
            {/* ✅ Dein Preis Marker - ELEGANTER (SLATE STATT WEISS) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all"
              style={{ left: `${your_position_pct}%` }}
            >
              <div className="relative">
                {/* Subtiler Glow */}
                <div className="absolute inset-0 bg-slate-400 blur-md opacity-30" />
                {/* ✅ SLATE-TON STATT WEISS */}
                <div className="relative w-6 h-6 rounded-full bg-slate-300 border-4 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Label unter dem Marker - Eleganter */}
          <div className="relative h-8">
            <div 
              className="absolute -translate-x-1/2"
              style={{ left: `${your_position_pct}%` }}
            >
              {/* ✅ SLATE-TON STATT WEISS */}
              <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold whitespace-nowrap shadow-lg">
                Dein Preis: {your_price.toFixed(2)}€
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400/70 mb-1">
                {cheaper_count}
              </div>
              <div className="text-xs text-slate-500">
                Günstiger als du
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {your_price.toFixed(2)}€
              </div>
              <div className="text-xs text-slate-500">
                Dein aktueller Preis
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400/70 mb-1">
                {more_expensive_count}
              </div>
              <div className="text-xs text-slate-500">
                Teurer als du
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ KONKURRENTEN-LISTE - KLARE TABELLE */}
      <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-white">
            Konkurrenten im Detail
          </h3>
          
          <button
            onClick={() => setShowAllCompetitors(!showAllCompetitors)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition-all"
          >
            {showAllCompetitors ? (
              <>
                Weniger anzeigen
                <ChevronUp className="w-4 h-4" strokeWidth={2} />
              </>
            ) : (
              <>
                Alle anzeigen ({competitors.length})
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-2">
          {sortedCompetitors
            .slice(0, showAllCompetitors ? sortedCompetitors.length : 5)
            .map((competitor, index) => {
              const diff = competitor.price - your_price;
              const diff_pct = ((competitor.price - your_price) / your_price) * 100;
              const isCheapest = competitor.price === cheapest_price;
              const isMostExpensive = competitor.price === most_expensive_price;
              
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* ✅ RANK - ELEGANT */}
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-slate-500">
                        #{index + 1}
                      </span>
                    </div>
                    
                    {/* ✅ INFO - CLEAN */}
                    <div>
                      <div className="text-sm font-medium text-white mb-0.5">
                        {competitor.source || `Konkurrent ${index + 1}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isCheapest && 'Günstigster Anbieter'}
                        {isMostExpensive && 'Teuerster Anbieter'}
                        {!isCheapest && !isMostExpensive && (
                          <>Aktualisiert: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}</>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ PRICE - ELEGANT, KEINE GRELLEN FARBEN */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-white mb-1">
                      {competitor.price.toFixed(2)}€
                    </div>
                    {/* ✅ SUBTILE FARBEN */}
                    <div className={cn(
                      "text-xs font-medium",
                      diff < 0 ? 'text-emerald-400/70' : diff > 0 ? 'text-red-400/70' : 'text-slate-500'
                    )}>
                      {diff === 0 ? 'Gleicher Preis' : (
                        <>
                          {diff < 0 ? '' : '+'}
                          {diff.toFixed(2)}€ ({diff_pct > 0 ? '+' : ''}
                          {diff_pct.toFixed(1)}%)
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        
        {!showAllCompetitors && sortedCompetitors.length > 5 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllCompetitors(true)}
              className="text-sm text-slate-400 hover:text-white font-medium transition-colors"
            >
              + {sortedCompetitors.length - 5} weitere Anbieter anzeigen
            </button>
          </div>
        )}
      </div>
      
      {/* ✅ EMPFEHLUNG - ELEGANT */}
      <div className="p-6 rounded-xl bg-slate-800/20 border border-slate-700/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-700/30 border border-slate-600/30 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-slate-500" strokeWidth={2} />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-2">
              Dein Preis ist wettbewerbsfähig
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              {price_diff > 0 ? (
                <>
                  Dein Preis liegt <span className="text-white font-medium">{price_diff.toFixed(2)}€</span> über 
                  dem Durchschnitt. {cheaper_count} Anbieter sind günstiger.
                </>
              ) : price_diff < 0 ? (
                <>
                  Dein Preis liegt <span className="text-white font-medium">{Math.abs(price_diff).toFixed(2)}€</span> unter 
                  dem Durchschnitt. {more_expensive_count} Anbieter sind teurer.
                </>
              ) : (
                <>
                  Dein Preis entspricht genau dem Marktdurchschnitt.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
