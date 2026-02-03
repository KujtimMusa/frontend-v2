'use client';

import { Package, Sparkles, AlertCircle, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    withRecommendations: number;
    withoutRecommendations: number;
    optimizationPotential?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {/* Total Products */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
        <Package className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
        <div>
          <div className="text-xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-slate-600">Gesamt</div>
        </div>
      </div>
      
      {/* With Recommendations */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
        <Sparkles className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
        <div>
          <div className="text-xl font-bold text-white">{stats.withRecommendations}</div>
          <div className="text-xs text-slate-600">Analysiert</div>
        </div>
      </div>
      
      {/* Without Recommendations */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
        <AlertCircle className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
        <div>
          <div className="text-xl font-bold text-white">{stats.withoutRecommendations}</div>
          <div className="text-xs text-slate-600">Ausstehend</div>
        </div>
      </div>
      
      {/* Optimization Potential */}
      {stats.optimizationPotential !== undefined && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
          <TrendingUp className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
          <div>
            <div className="text-xl font-bold text-white">
              €{(stats.optimizationPotential / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-slate-600">Potenzial</div>
          </div>
        </div>
      )}
    </div>
  );
}
