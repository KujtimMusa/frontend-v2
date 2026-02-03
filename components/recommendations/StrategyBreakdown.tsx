'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Package, DollarSign, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Strategy {
  name: string;
  impact: number;
  data_quality: 'Gut' | 'Sehr gut' | 'Mittel' | 'Schlecht';
  weight: number;
  weighted_impact: number;
  reasoning?: string;
}

interface StrategyBreakdownProps {
  strategies: Strategy[];
  totalImpact: number;
  priceChangePercentage: number;
}

const getStrategyIcon = (name: string) => {
  if (name.toLowerCase().includes('nachfrage') || name.toLowerCase().includes('demand')) {
    return TrendingUp;
  }
  if (name.toLowerCase().includes('lager') || name.toLowerCase().includes('inventory')) {
    return Package;
  }
  if (name.toLowerCase().includes('kosten') || name.toLowerCase().includes('cost')) {
    return DollarSign;
  }
  return TrendingUp;
};

const getDataQualityColor = (quality: string) => {
  switch (quality) {
    case 'Sehr gut':
      return 'bg-emerald-500';
    case 'Gut':
      return 'bg-slate-500';
    case 'Mittel':
      return 'bg-amber-500';
    case 'Schlecht':
      return 'bg-red-500';
    default:
      return 'bg-slate-500';
  }
};

export function StrategyBreakdown({
  strategies,
  totalImpact,
  priceChangePercentage,
}: StrategyBreakdownProps) {
  // Filter out any recommendation objects that might have slipped through
  const safeStrategies = Array.isArray(strategies)
    ? strategies.filter((s): s is Strategy => {
        if (typeof s !== 'object' || s === null) return false;
        // Filter out recommendation objects
        if ('current_price' in s || 'recommended_price' in s || 'price_change_pct' in s) {
          return false;
        }
        // Ensure it has required Strategy properties
        return 'name' in s && 'impact' in s && 'weight' in s;
      })
    : [];
  
  if (safeStrategies.length === 0) {
    return null;
  }
  
  const maxWeight = Math.max(...safeStrategies.map((s) => s.weight), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">
          📊 Wie wird {totalImpact > 0 ? '+' : ''}
          {totalImpact.toFixed(2)} € berechnet?
        </h3>
        <p className="text-sm text-muted-foreground">
          Die Preisempfehlung basiert auf einer gewichteten Analyse mehrerer Strategien.
        </p>
      </div>

      {/* Info Box */}
      <Card className="bg-slate-800/50 border-slate-700 dark:bg-slate-900/50 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 dark:text-slate-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-slate-200 dark:text-slate-100 mb-1">
                Warum nicht die einfache Summe?
              </h4>
              <p className="text-sm text-slate-300 dark:text-slate-400">
                Jede Strategie wird basierend auf ihrer Datenqualität unterschiedlich stark
                gewichtet. Strategien mit höherer Datenqualität haben mehr Einfluss auf die finale
                Empfehlung.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy List */}
      <Card>
        <CardHeader>
          <CardTitle>Einzelne Strategien-Empfehlungen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeStrategies.map((strategy, index) => {
            const Icon = getStrategyIcon(strategy.name);
            const qualityColor = getDataQualityColor(strategy.data_quality);

            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className={cn('p-2 rounded-lg', qualityColor, 'bg-opacity-10')}>
                  <Icon className={cn('w-5 h-5', qualityColor.replace('bg-', 'text-'))} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{strategy.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {strategy.data_quality}
                    </Badge>
                  </div>
                  {strategy.reasoning && (
                    <p className="text-sm text-muted-foreground mb-2">{strategy.reasoning}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        'font-bold text-lg',
                        strategy.impact > 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {strategy.impact > 0 ? '+' : ''}
                      {strategy.impact.toFixed(2)} €
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Gewicht: {(strategy.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Weighted Contributions */}
      <Card>
        <CardHeader>
          <CardTitle>Gewichtete Beiträge (Datenqualität × Basis-Gewicht)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeStrategies.map((strategy, index) => {
            const weightedPercent = (strategy.weighted_impact / totalImpact) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{strategy.name}</span>
                  <span className="text-sm font-bold">
                    {strategy.weighted_impact > 0 ? '+' : ''}
                    {strategy.weighted_impact.toFixed(2)} € ({Math.abs(weightedPercent).toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress 
                  value={Math.abs(weightedPercent)} 
                  className="h-2 bg-slate-800"
                  style={{
                    background: 'linear-gradient(to right, rgb(71, 85, 105), rgb(100, 116, 139))',
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Final Sum */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Finale Summe (Gewichteter Durchschnitt)</p>
            <div className="text-4xl font-bold text-slate-100 mb-1">
              {totalImpact > 0 ? '+' : ''}
              {totalImpact.toFixed(2)} €
            </div>
            <p className="text-lg text-muted-foreground">
              ({priceChangePercentage > 0 ? '+' : ''}
              {priceChangePercentage.toFixed(1)}%)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
