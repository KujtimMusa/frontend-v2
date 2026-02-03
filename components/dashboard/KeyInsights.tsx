'use client';

import Link from 'next/link';
import { AlertTriangle, TrendingUp, BarChart3, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  type: 'warning' | 'success' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  href: string;
}

const insights: Insight[] = [
  {
    type: 'warning',
    icon: AlertTriangle,
    title: '3 Produkte haben zu niedrigen Preis',
    description: 'Du verlierst €234.50 pro Monat',
    action: 'Empfehlungen ansehen',
    href: '/demo/recommendations',
  },
  {
    type: 'success',
    icon: TrendingUp,
    title: '5 Empfehlungen umgesetzt diese Woche',
    description: '+€1,234.56 zusätzlicher Umsatz',
    action: 'Details',
    href: '/demo/analytics',
  },
  {
    type: 'info',
    icon: BarChart3,
    title: 'Deine durchschnittliche Marge stieg um 2.3%',
    description: 'von 21.1% → 23.4%',
    action: 'Analyse',
    href: '/demo/margins',
  },
];

export function KeyInsights() {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-bold text-slate-100">Wichtige Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-3 mb-2">
                <Icon
                  className={cn(
                    'w-5 h-5 mt-0.5 flex-shrink-0',
                    insight.type === 'warning' && 'text-amber-400',
                    insight.type === 'success' && 'text-emerald-400',
                    insight.type === 'info' && 'text-slate-400'
                  )}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200 mb-1">{insight.title}</div>
                  <div className="text-sm text-slate-400 mb-3">{insight.description}</div>
                  <Link
                    href={insight.href}
                    className="text-sm text-slate-300 hover:text-slate-100 inline-flex items-center transition-colors"
                  >
                    {insight.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
