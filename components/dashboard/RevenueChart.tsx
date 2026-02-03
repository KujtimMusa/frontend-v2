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
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RevenueChartProps {
  data?: Array<{ date: string; value: number }>;
  height?: number;
  showControls?: boolean;
}

export function RevenueChart({
  data = [
    { date: 'Tag 1', value: 1000 },
    { date: 'Tag 2', value: 1200 },
    { date: 'Tag 3', value: 1100 },
    { date: 'Tag 4', value: 1300 },
    { date: 'Tag 5', value: 1234 },
  ],
  height = 100,
  showControls = false,
}: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // If mini chart (no controls), return simple version
  if (!showControls) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgb(148, 163, 184)" // slate-400
            strokeWidth={2}
            dot={false}
          />
          <XAxis dataKey="date" hide />
          <YAxis hide />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Full chart with controls
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1">Verpasster Umsatz</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-100">€1,234.56</span>
            <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
              +5.2%
            </Badge>
          </div>
        </div>

        {/* Date Range Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setTimeRange('7d')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              timeRange === '7d'
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            7 Tage
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              timeRange === '30d'
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            30 Tage
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={cn(
              'px-3 py-1.5 rounded text-sm font-medium transition-colors',
              timeRange === '90d'
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-300'
            )}
          >
            90 Tage
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(51, 65, 85)" /> {/* slate-800 */}
            <XAxis
              dataKey="date"
              stroke="rgb(148, 163, 184)" // slate-400
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(148, 163, 184)" // slate-400
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a', // slate-950
                border: '1px solid #334155', // slate-700
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#e2e8f0' }} // slate-200
              itemStyle={{ color: '#94a3b8' }} // slate-400
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="rgb(148, 163, 184)" // slate-400
              strokeWidth={2}
              dot={{ fill: '#94a3b8', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-6 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-slate-700 hover:bg-slate-800 text-slate-100"
          asChild
        >
          <Link href="/demo/recommendations">
            Alle Empfehlungen ansehen
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
