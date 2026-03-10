'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  sparklineData?: Array<{ date: string; value: number }>;
  chartColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  href,
  sparklineData = [],
  chartColor = 'rgb(148, 163, 184)', // slate-400
}: MetricCardProps) {
  const className = cn(
    'group relative p-6 rounded-xl border border-slate-800 bg-slate-900/70',
    'transition-all duration-300',
    href && 'cursor-pointer hover:bg-slate-900 hover:border-slate-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50'
  );

  return href ? (
    <Link href={href} className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
          <Icon className="w-6 h-6 text-slate-300" />
        </div>
        {change !== undefined && (
          <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800 text-xs">
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </Badge>
        )}
      </div>

      <div className="text-3xl font-bold text-slate-100 mb-1">{value}</div>
      <div className="text-sm text-slate-400 mb-4">{title}</div>

      {/* Sparkline Chart */}
      {sparklineData.length > 0 && (
        <div className="mt-4 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Action Link (if clickable) */}
      {href && (
        <div className="mt-4 flex items-center text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          Details ansehen
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* Hover Gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-700/0 to-slate-800/0 group-hover:from-slate-700/5 group-hover:to-slate-800/5 transition-all pointer-events-none" />
    </Link>
  ) : (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
          <Icon className="w-6 h-6 text-slate-300" />
        </div>
        {change !== undefined && (
          <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800 text-xs">
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </Badge>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-100 mb-1">{value}</div>
      <div className="text-sm text-slate-400 mb-4">{title}</div>
      {sparklineData.length > 0 && (
        <div className="mt-4 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-700/0 to-slate-800/0 group-hover:from-slate-700/5 group-hover:to-slate-800/5 transition-all pointer-events-none" />
    </div>
  );
}
