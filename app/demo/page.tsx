'use client';

import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { OptimizationProgress } from '@/components/dashboard/OptimizationProgress';
import { MissedRevenueChart } from '@/components/dashboard/MissedRevenueChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { KeyInsights } from '@/components/dashboard/KeyInsights';
import { TopPerformers } from '@/components/dashboard/TopPerformers';
import { DemoBanner } from '@/components/demo/DemoBanner';
import { getDashboardStats } from '@/lib/api';
import { TrendingUp, Package, Lightbulb, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DemoDashboard() {
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
    { date: 'Tag 1', value: 1000 },
    { date: 'Tag 2', value: 1200 },
    { date: 'Tag 3', value: 1100 },
    { date: 'Tag 4', value: 1300 },
    { date: 'Tag 5', value: 1234 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Cool Demo Banner */}
        <div className="mb-8">
          <DemoBanner />
        </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Verpasster Umsatz"
          value={`€${stats?.missed_revenue?.total?.toFixed(2) || '5,234.56'}`}
          change={12.5}
          icon={TrendingUp}
          href="/demo/recommendations"
          sparklineData={revenueData}
          chartColor="rgb(16, 185, 129)" // emerald-500
        />
        <MetricCard
          title="Produkte"
          value={stats?.products_count || 24}
          icon={Package}
          href="/demo/products"
          sparklineData={revenueData}
          chartColor="rgb(148, 163, 184)" // slate-400
        />
        <MetricCard
          title="Preisempfehlungen"
          value={`${stats?.recommendations_pending || 8} offen`}
          icon={Lightbulb}
          href="/demo/recommendations"
          sparklineData={revenueData}
          chartColor="rgb(251, 191, 36)" // amber-400
        />
        <MetricCard
          title="Durchschnittliche Margin"
          value="23.4%"
          change={2.1}
          icon={DollarSign}
          sparklineData={revenueData}
          chartColor="rgb(16, 185, 129)" // emerald-500
        />
      </div>

      {/* Main Grid - 50/50 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Verpasster Umsatz - 50% */}
        <div className="h-full">
          <MissedRevenueChart data={{
            total: stats?.missed_revenue?.total || 5234.56,
            change: 12.5
          }} />
        </div>

        {/* Optimierungs-Fortschritt - 50% */}
        <div className="h-full">
          <OptimizationProgress
            points={stats?.progress?.points || 3}
            maxPoints={5}
            level="Bronze"
            nextLevel="Silber"
            totalXP={stats?.progress?.points || 3}
            tasks={[
              { id: 1, title: 'Produkte synchronisiert', completed: true, xp: 0 },
              {
                id: 2,
                title: 'Empfehlungen umgesetzt',
                completed: false,
                current: 2,
                total: 10,
                xp: 10,
              },
              { id: 3, title: 'Monitoring aktiv', completed: true, xp: 5 },
            ]}
          />
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-8">
        <KeyInsights />
      </div>

      {/* Top Performers & Low Performers */}
      <div className="mb-8">
        <TopPerformers />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
      </div>
    </div>
  );
}
