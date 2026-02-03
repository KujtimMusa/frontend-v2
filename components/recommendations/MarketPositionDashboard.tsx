'use client';

import { CompetitionAnalysis } from '@/components/competition/CompetitionAnalysis';
import type { CompetitorPrice } from '@/types/models';

interface MarketPositionDashboardProps {
  currentPrice: number;
  competitors: CompetitorPrice[];
}

export function MarketPositionDashboard({
  currentPrice,
  competitors,
}: MarketPositionDashboardProps) {
  return (
    <CompetitionAnalysis
      your_price={currentPrice}
      competitors={competitors}
    />
  );
}
