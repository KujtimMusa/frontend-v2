'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MarginCalculationResult, ProductCostData } from '@/types/models';

interface EnhancedMarginAnalysisProps {
  price: number;
  costs?: ProductCostData;
  marginResult: MarginCalculationResult;
  onEdit: () => void;
}

export function EnhancedMarginAnalysis({
  price,
  costs,
  marginResult,
  onEdit,
}: EnhancedMarginAnalysisProps) {
  if (!marginResult.has_cost_data) {
    return (
      <Card className="border-slate-800 bg-slate-900/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg">
              <span className="text-lg">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-100 mb-1">Noch präziser mit Kostendaten</h3>
              <p className="text-xs text-slate-400 mb-3">
                Die Preisempfehlung funktioniert auch ohne Kosten. Mit Kostendaten können wir
                zusätzlich deine Marge optimieren und sicherstellen, dass du immer profitabel
                bleibst.
              </p>
              <Button variant="outline" size="sm" onClick={onEdit} className="border-slate-700 hover:bg-slate-800 text-slate-100">
                Kosten hinterlegen (optional)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const marginPercent = marginResult.margin.percent;
  const marginEuro = marginResult.margin.euro;
  const netRevenue = marginResult.net_revenue;
  const totalCosts = marginResult.costs.total_variable;
  const vatRate = 0.19; // 19% MwSt
  const vatAmount = price * vatRate;
  const isHealthy = marginResult.is_above_min_margin;
  const isAboveBreakEven = marginResult.is_above_break_even;

  // Calculate percentages for cost bars
  const costItems = [
    {
      label: 'Einkauf',
      value: marginResult.costs.purchase,
      icon: Package,
      percentage: totalCosts > 0 ? (marginResult.costs.purchase / totalCosts) * 100 : 0,
    },
    {
      label: 'Versand',
      value: marginResult.costs.shipping,
      icon: Truck,
      percentage: totalCosts > 0 ? (marginResult.costs.shipping / totalCosts) * 100 : 0,
    },
    {
      label: 'Verpackung',
      value: marginResult.costs.packaging,
      icon: Package,
      percentage: totalCosts > 0 ? (marginResult.costs.packaging / totalCosts) * 100 : 0,
    },
    {
      label: 'Payment Fee (Stripe)',
      value: marginResult.costs.payment_fee,
      icon: CreditCard,
      percentage: totalCosts > 0 ? (marginResult.costs.payment_fee / totalCosts) * 100 : 0,
    },
  ];

  // Benchmarks (mock data - in real app, these would come from API)
  const overMinimum = marginPercent - 20;
  const vsIndustry = marginPercent - 45; // Assuming industry average is 45%
  const trend30d = 5.2; // Mock trend

  return (
    <div className="space-y-6">
      {/* TEIL 1: PREIS-FLUSS */}
      <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wide">PREIS-FLUSS</h3>

        <div className="flex items-center gap-4">
          {/* Verkaufspreis */}
          <div className="flex-1 p-4 rounded-lg bg-slate-900/50">
            <div className="text-sm text-slate-400 mb-1">Verkaufspreis (Brutto)</div>
            <div className="text-2xl font-bold text-slate-100">{price.toFixed(2)} €</div>
          </div>

          {/* Arrow + MwSt */}
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="w-5 h-5 text-slate-500" />
            <div className="text-xs text-slate-500 whitespace-nowrap">-{vatRate * 100}% MwSt</div>
            <div className="text-xs text-red-400">-{vatAmount.toFixed(2)} €</div>
          </div>

          {/* Nettoerlös */}
          <div className="flex-1 p-4 rounded-lg bg-slate-900/50">
            <div className="text-sm text-slate-400 mb-1">Nettoerlös (Netto)</div>
            <div className="text-2xl font-bold text-slate-100">{netRevenue.toFixed(2)} €</div>
          </div>
        </div>
      </div>

      {/* TEIL 2: VARIABLE KOSTEN */}
      <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">VARIABLE KOSTEN</h3>
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-slate-400 hover:text-slate-100">
            <Edit className="w-4 h-4 mr-2" />
            Bearbeiten
          </Button>
        </div>

        <div className="space-y-4">
          {costItems.map((cost, idx) => {
            const Icon = cost.icon;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-300">{cost.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400">{cost.percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium text-slate-100 w-16 text-right">
                      {cost.value.toFixed(2)} €
                    </span>
                    <button
                      onClick={onEdit}
                      className="p-1 hover:bg-slate-700 rounded transition-colors"
                    >
                      <Edit className="w-3 h-3 text-slate-500" />
                    </button>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full transition-all"
                    style={{ width: `${cost.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Gesamt */}
          <div className="pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">GESAMT</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">100.0%</span>
                <span className="text-sm font-bold text-slate-100 w-16 text-right">
                  {totalCosts.toFixed(2)} €
                </span>
                <div className="w-[28px]" /> {/* Spacer for edit button */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TEIL 3: DECKUNGSBEITRAG */}
      <div className="p-6 rounded-xl bg-emerald-900/10 border border-emerald-800/30">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100 mb-1">Deckungsbeitrag I</h3>
            <p className="text-sm text-slate-400">Gewinn nach variablen Kosten</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold text-emerald-400 mb-1">{marginEuro.toFixed(2)} €</div>
          <div className="text-xl text-emerald-400/70">({marginPercent.toFixed(1)}%)</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
              style={{ width: `${Math.min(marginPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Benchmarks */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/50">
          <div>
            <div className="text-xs text-slate-500 mb-1">Über Minimum</div>
            <div className="text-sm font-bold text-emerald-400">
              +{overMinimum.toFixed(1)}pp
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">vs. Branche</div>
            <div className="text-sm font-bold text-emerald-400">
              +{vsIndustry.toFixed(1)}pp
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Trend (30d)</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{trend30d.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* TEIL 4: PREIS-BENCHMARKS */}
      {marginResult.break_even_price && marginResult.recommended_min_price && (
        <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-6 uppercase tracking-wide">
            PREIS-BENCHMARKS
          </h3>

          {/* Scale */}
          <div className="relative mb-8">
            {/* Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 rounded-full" />

            {/* Markers */}
            <div className="relative flex justify-between items-center">
              {[
                {
                  label: 'Break-Even',
                  value: marginResult.break_even_price,
                  color: 'bg-amber-600',
                  current: false,
                },
                {
                  label: 'Min. 20%',
                  value: marginResult.recommended_min_price,
                  color: 'bg-slate-600',
                  current: false,
                },
                {
                  label: 'Aktuell',
                  value: price,
                  color: 'bg-emerald-600',
                  current: true,
                },
                {
                  label: 'Optimal',
                  value: price * 1.1, // Mock optimal price (10% above current)
                  color: 'bg-slate-500',
                  current: false,
                },
              ].map((marker, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 border-slate-900',
                      marker.color,
                      marker.current && 'w-6 h-6 ring-4 ring-emerald-600/30'
                    )}
                  />
                  <div className="mt-2 text-xs font-medium text-slate-300">{marker.label}</div>
                  <div className="text-xs text-slate-500">{marker.value.toFixed(2)} €</div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-amber-900/10 border border-amber-800/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-slate-200">Break-Even</span>
              </div>
              <div className="text-xs text-slate-400">Mindestpreis um Kosten zu decken</div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-900/10 border border-emerald-800/30">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">Min. empfohlen</span>
              </div>
              <div className="text-xs text-slate-400">Preis für 20% Marge (Minimum)</div>
            </div>
          </div>
        </div>
      )}

      {/* TEIL 5: STATUS & INSIGHTS */}
      {isHealthy ? (
        <div className="p-6 rounded-xl bg-emerald-900/10 border border-emerald-800/30">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">✅ Gesunde Marge</h3>
              <p className="text-sm text-slate-400">Deine Marge ({marginPercent.toFixed(1)}%) ist ausgezeichnet!</p>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5" />
              <span className="text-sm text-slate-300">
                {overMinimum.toFixed(0)} Prozentpunkte über Minimum (20%)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5" />
              <span className="text-sm text-slate-300">
                {vsIndustry.toFixed(0)}-{overMinimum.toFixed(0)}pp über Branchenschnitt (40-50%)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
              <span className="text-sm text-slate-300">Genug Puffer für unerwartete Kosten</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="flex-1 bg-slate-100 hover:bg-white text-slate-900 font-bold">
              <Zap className="w-4 h-4 mr-2" />
              Preis optimieren
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-100">
              <DollarSign className="w-4 h-4 mr-2" />
              Kosten senken
            </Button>
          </div>
        </div>
      ) : isAboveBreakEven ? (
        <div className="p-6 rounded-xl bg-amber-900/10 border border-amber-800/30">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">⚠️ Niedrige Marge</h3>
              <p className="text-sm text-slate-400">
                Deine Marge ({marginPercent.toFixed(1)}%) liegt unter der empfohlenen Mindestmarge von 20%.
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
              <span className="text-sm text-slate-300">
                {(20 - marginPercent).toFixed(1)} Prozentpunkte unter Minimum
              </span>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-amber-400 mt-0.5" />
              <span className="text-sm text-slate-300">
                Berücksichtige Fixkosten und unerwartete Ausgaben
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="flex-1 bg-slate-100 hover:bg-white text-slate-900 font-bold">
              <Zap className="w-4 h-4 mr-2" />
              Preis erhöhen
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-100">
              <DollarSign className="w-4 h-4 mr-2" />
              Kosten senken
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-red-900/10 border border-red-800/30">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">❌ KRITISCH: Unter Break-Even</h3>
              <p className="text-sm text-slate-400">
                Dieser Preis liegt unter deinen Kosten. Du machst Verlust bei jedem Verkauf!
              </p>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
              <span className="text-sm text-slate-300">
                Preis muss mindestens {marginResult.break_even_price?.toFixed(2)} € betragen
              </span>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-red-400 mt-0.5" />
              <span className="text-sm text-slate-300">Sofortige Preisänderung erforderlich!</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="flex-1 bg-slate-100 hover:bg-white text-slate-900 font-bold">
              <Zap className="w-4 h-4 mr-2" />
              Preis erhöhen
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-100">
              <DollarSign className="w-4 h-4 mr-2" />
              Kosten senken
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
