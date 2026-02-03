'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { cn } from '@/lib/utils';
import type { CompetitorPrice } from '@/types/models';

interface CompetitorPriceChartProps {
  competitors: CompetitorPrice[];
  yourPrice?: number;
  currentPrice?: number; // Alternative prop name
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

export function CompetitorPriceChart({ competitors, yourPrice, currentPrice }: CompetitorPriceChartProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'used'>('all');
  const [minRating, setMinRating] = useState(0);

  // Use currentPrice if provided, otherwise yourPrice, otherwise calculate from competitors
  const safeYourPrice = currentPrice ?? yourPrice ?? (competitors.length > 0 ? competitors[0].price : 0);

  if (competitors.length === 0) {
    return null;
  }

  const filteredCompetitors = competitors.filter((c) => {
    if (filter !== 'all' && getCondition(c) !== filter) return false;
    if (c.rating && c.rating < minRating) return false;
    return true;
  });

  // Prepare chart data
  const chartData = filteredCompetitors.slice(0, 10).map((comp, idx) => ({
    name: comp.source || `Anbieter ${idx + 1}`,
    price: comp.price,
    rating: comp.rating || 0,
    condition: getCondition(comp),
  }));

  const prices = filteredCompetitors.map((c) => c.price);
  const minPrice = Math.min(...prices, safeYourPrice);
  const maxPrice = Math.max(...prices, safeYourPrice);

  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
      {/* Header with Filters */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-100">Preisvergleich</h3>

        <div className="flex items-center gap-2">
          {/* Condition Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              Alle
            </button>
            <button
              onClick={() => setFilter('new')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                filter === 'new'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              Neuware
            </button>
            <button
              onClick={() => setFilter('used')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                filter === 'used'
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:text-slate-300'
              )}
            >
              Gebraucht
            </button>
          </div>

          {/* Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm"
          >
            <option value={0}>Alle Bewertungen</option>
            <option value={4.0}>⭐ 4.0+</option>
            <option value={4.5}>⭐ 4.5+</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              domain={[minPrice * 0.9, maxPrice * 1.1]}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-700">
                      <div className="font-bold text-slate-100 mb-1">{data.name}</div>
                      <div className="text-sm text-slate-300 mb-2">{data.price.toFixed(2)} €</div>
                      {data.rating > 0 && (
                        <div className="text-xs text-slate-400">
                          ⭐ {data.rating.toFixed(1)} - {data.condition === 'new' ? 'Neuware' : 'Gebraucht'}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Competitor Prices - SUBTIL */}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={{ fill: '#94a3b8', r: 4, stroke: '#1e293b', strokeWidth: 2 }}
              activeDot={{ r: 7 }}
              name="Wettbewerber"
            />

            {/* ✅ FIX 3: YOUR PRICE LINE - HIGHLIGHTED! */}
            {safeYourPrice > 0 && (
              <ReferenceLine
                y={safeYourPrice}
                stroke="rgb(99, 102, 241)"  // Indigo
                strokeDasharray="5 5"
                strokeWidth={4}
                label={{
                  value: `🔵 Dein Preis: ${safeYourPrice.toFixed(2)}€`,
                  position: 'right',
                  fill: 'rgb(99, 102, 241)',
                  style: { 
                    fontSize: '12px',
                    fontWeight: 'bold',
                  },
                }}
                filter="drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - CUSTOM */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {/* Competitor Legend */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-slate-400 rounded-full" />
          <span className="text-xs text-slate-500">Wettbewerber</span>
        </div>
        
        {/* ✅ YOUR PRICE Legend - HIGHLIGHTED */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
          <div className="w-8 h-1 bg-indigo-500 rounded-full" />
          <span className="text-xs font-semibold text-indigo-400">🔵 Dein Preis</span>
        </div>
      </div>
    </div>
  );
}
