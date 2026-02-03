'use client';

import Link from 'next/link';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  type: 'success' | 'warning' | 'error';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    type: 'success',
    icon: CheckCircle2,
    title: 'Empfehlung angewendet',
    description: 'Adidas Samba OG: €89.99 → €95.99',
    time: 'vor 2 Stunden',
  },
  {
    type: 'warning',
    icon: AlertCircle,
    title: 'Neue Empfehlung verfügbar',
    description: 'iPhone 15 Pro: Preis könnte erhöht werden',
    time: 'vor 5 Stunden',
  },
  {
    type: 'error',
    icon: AlertTriangle,
    title: 'Wettbewerber-Alert',
    description: 'Nike Air Max: Konkurrenz 15% günstiger',
    time: 'vor 1 Tag',
  },
];

const iconColors = {
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  error: 'text-red-400',
};

export function RecentActivity() {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-100">Letzte Aktivitäten</h3>
        <Link
          href="/demo/activity"
          className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
        >
          Alle ansehen →
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconColors[activity.type])} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 mb-1">{activity.title}</div>
                <div className="text-xs text-slate-400 mb-1">{activity.description}</div>
                <div className="text-xs text-slate-500">{activity.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
