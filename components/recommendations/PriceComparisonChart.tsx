'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CompetitorPrice } from '@/types/models';

interface PriceComparisonChartProps {
  competitors: CompetitorPrice[];
  currentPrice: number;
  chartType?: 'line' | 'bar';
}

export function PriceComparisonChart({
  competitors,
  currentPrice,
  chartType = 'line',
}: PriceComparisonChartProps) {
  if (competitors.length === 0) {
    return null;
  }

  // Prepare chart data
  const chartData = [
    {
      name: 'Dein Preis',
      price: currentPrice,
      yourPrice: currentPrice,
      type: 'Dein Preis',
    },
    ...competitors.slice(0, 10).map((comp, idx) => ({
      name: comp.source || `Anbieter ${idx + 1}`,
      price: comp.price,
      yourPrice: currentPrice,
      type: 'Wettbewerber',
    })),
  ];

  // Calculate statistics
  const prices = competitors.map((c) => c.price);
  const minPrice = Math.min(...prices, currentPrice);
  const maxPrice = Math.max(...prices, currentPrice);
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-xl"
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <p className="font-semibold mb-1 text-slate-200">{payload[0].payload.name}</p>
          <p className="text-sm text-slate-400">
            Preis: <span className="font-bold text-slate-200">€{payload[0].value.toFixed(2)}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-slate-400">
              Dein Preis: <span className="font-bold text-slate-200">€{payload[1].value.toFixed(2)}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preisvergleich</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(51, 65, 85)" /> {/* slate-800 */}
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    className="text-xs"
                    tick={{ fill: 'rgb(148, 163, 184)' }} // slate-400
                  />
                  <YAxis
                    domain={[minPrice * 0.9, maxPrice * 1.1]}
                    tick={{ fill: 'rgb(148, 163, 184)' }} // slate-400
                    className="text-xs"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {/* Competitor Prices - SUBTIL */}
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="rgb(148, 163, 184)" // slate-400
                    strokeWidth={2}
                    name="Wettbewerber-Preise"
                    dot={{ r: 4, fill: 'rgb(148, 163, 184)', stroke: 'rgb(30, 41, 59)', strokeWidth: 2 }}
                  />
                  
                  {/* ✅ FIX 3: YOUR PRICE LINE - HIGHLIGHTED! */}
                  <Line
                    type="monotone"
                    dataKey="yourPrice"
                    stroke="rgb(99, 102, 241)"  // Indigo
                    strokeWidth={4}
                    strokeDasharray="5 5"
                    name="🔵 Dein Preis"
                    dot={{
                      r: 6,
                      fill: 'rgb(99, 102, 241)',
                      stroke: 'rgb(30, 41, 59)',
                      strokeWidth: 3
                    }}
                    filter="drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))"
                  />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(51, 65, 85)" /> {/* slate-800 */}
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    className="text-xs"
                    tick={{ fill: 'rgb(148, 163, 184)' }} // slate-400
                  />
                  <YAxis
                    domain={[minPrice * 0.9, maxPrice * 1.1]}
                    tick={{ fill: 'rgb(148, 163, 184)' }} // slate-400
                    className="text-xs"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="price" fill="rgb(148, 163, 184)" name="Wettbewerber-Preise" /> {/* slate-400 */}
                  <Bar
                    dataKey="yourPrice"
                    fill="rgb(226, 232, 240)"
                    name="Dein Preis"
                    opacity={0.8}
                  /> {/* slate-200 */}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Durchschnitt</p>
              <p className="text-lg font-bold">€{avgPrice.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Minimum</p>
              <p className="text-lg font-bold text-emerald-400">€{minPrice.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Maximum</p>
              <p className="text-lg font-bold text-red-400">€{maxPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
