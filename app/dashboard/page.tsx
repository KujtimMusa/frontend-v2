'use client';

import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/dashboard/StatCard';
import { TrustLadder } from '@/components/dashboard/TrustLadder';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { getDashboardStats } from '@/lib/api';
import { TrendingUp, Package, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const revenueData = [
    { date: 'Tag 1', value: stats?.missed_revenue?.total || 1000 },
    { date: 'Tag 2', value: (stats?.missed_revenue?.total || 1000) * 1.2 },
    { date: 'Tag 3', value: (stats?.missed_revenue?.total || 1000) * 1.1 },
    { date: 'Tag 4', value: (stats?.missed_revenue?.total || 1000) * 1.3 },
    { date: 'Tag 5', value: stats?.missed_revenue?.total || 1234 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht über deine Preisoptimierung
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Verpasster Umsatz (letzte 30 Tage)"
          value={`€${stats?.missed_revenue?.total?.toFixed(2) || '0.00'}`}
          change={{ value: 5.2, trend: 'up' }}
          icon={<TrendingUp />}
          chart={<RevenueChart data={revenueData} />}
          action={{
            label: 'Alle Empfehlungen ansehen',
            onClick: () => {},
          }}
          className="col-span-2"
        />

        <TrustLadder
          level="bronze"
          points={stats?.progress?.points || 0}
          nextLevelPoints={5}
          completedSteps={stats?.progress?.steps || []}
          pendingSteps={stats?.next_steps?.map((step) => ({
            text: step,
            points: 5,
            action: '',
          })) || []}
        />

        <StatCard
          title="Produkte"
          value={stats?.products_count || 0}
          icon={<Package />}
          action={{ label: 'Jetzt synchronisieren', onClick: () => {} }}
        />

        <StatCard
          title="Preisempfehlungen"
          value={`${stats?.recommendations_pending || 0} offen`}
          icon={<Lightbulb />}
          action={{
            label: 'Alle Empfehlungen ansehen',
            onClick: () => {},
          }}
        />
      </div>
    </div>
  );
}
