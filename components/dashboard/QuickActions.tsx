'use client';

import Link from 'next/link';
import { Zap, BarChart3, Settings, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
  available?: boolean;
}

const actions: QuickAction[] = [
  {
    icon: Zap,
    label: 'Neue Empfehlung',
    description: 'Generiere Empfehlung',
    href: '/demo/products',
    available: true, // Only show functional cards
  },
  // Disabled non-functional cards
  // {
  //   icon: BarChart3,
  //   label: 'Report erstellen',
  //   description: 'Performance-Analyse',
  //   href: '/demo/reports',
  //   available: false,
  // },
  // {
  //   icon: Settings,
  //   label: 'Einstellungen',
  //   description: 'App konfigurieren',
  //   href: '/demo/settings',
  //   available: false,
  // },
  // {
  //   icon: MessageCircle,
  //   label: 'Support',
  //   description: 'Hilfe erhalten',
  //   href: '/support',
  //   available: false,
  // },
];

export function QuickActions() {
  const availableActions = actions.filter(a => a.available);
  
  // Don't render if no actions available
  if (availableActions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-100 mb-4">Schnellzugriff</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all group"
            >
              <Icon className="w-6 h-6 text-slate-400 group-hover:text-slate-300 mb-2 transition-colors" />
              <div className="text-sm font-medium text-slate-200 mb-1">{action.label}</div>
              <div className="text-xs text-slate-500">{action.description}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
