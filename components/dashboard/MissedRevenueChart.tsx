'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingDown, Info, ArrowRight, HelpCircle } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip
} from 'recharts';
import { cn } from '@/lib/utils';

type Period = '7d' | '30d' | '90d';

// Metric mit Erklärung
interface MetricWithDescription {
  name: string;
  value: number;
  fill: string;
  description: string;
  impact: string; // Was bedeutet der Wert?
}

interface MissedRevenueChartProps {
  data?: any;
}

export function MissedRevenueChart({ data }: MissedRevenueChartProps) {
  const [period, setPeriod] = useState<Period>('7d');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  
  // Radial Chart Data - STÄRKERE FARBEN für besseren Kontrast!
  const radialData: MetricWithDescription[] = [
    {
      name: 'Wettbewerb',
      value: 85,
      fill: 'rgb(148, 163, 184)', // slate-400 (heller!)
      description: 'Konkurrenzdruck',
      impact: 'Deine Preise sind 15% unter dem Marktdurchschnitt. Hier kannst du optimieren.'
    },
    {
      name: 'Nachfrage',
      value: 72,
      fill: 'rgb(203, 213, 225)', // slate-300 (noch heller!)
      description: 'Kaufbereitschaft',
      impact: 'Hohe Nachfrage bei einigen Produkten ermöglicht Preiserhöhungen.'
    },
    {
      name: 'Marge',
      value: 65,
      fill: 'rgb(226, 232, 240)', // slate-200 (sehr hell!)
      description: 'Gewinnspanne',
      impact: 'Durchschnittliche Marge von 35% ist ausbaufähig.'
    },
    {
      name: 'Trends',
      value: 58,
      fill: 'rgb(241, 245, 249)', // slate-100 (am hellsten!)
      description: 'Markt-Trends',
      impact: 'Saisonale Preisanpassungen könnten zusätzlichen Umsatz bringen.'
    },
  ];
  
  const totalMissed = data?.total || 5234.56;
  const changePercent = data?.change || 12.5;
  const potentialPercent = Math.round(radialData.reduce((acc, item) => acc + item.value, 0) / radialData.length);
  
  return (
    <div className="h-full rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Ungenutztes Potenzial
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-white tracking-tight">
                €{totalMissed.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +{changePercent}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/50">
          {(['7d', '30d', '90d'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                period === p
                  ? 'bg-slate-700 text-slate-300'
                  : 'text-slate-600 hover:text-slate-400'
              )}
            >
              {p === '7d' ? '7T' : p === '30d' ? '30T' : '90T'}
            </button>
          ))}
        </div>
      </div>
      
      {/* ✅ 2-COLUMN LAYOUT: Chart Left, Stats Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6 min-h-0">
        {/* LEFT: Radial Chart - Größer & ohne Center Text */}
        <div className="relative flex items-center justify-center order-2 lg:order-1">
          <div className="w-full h-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="25%"
                outerRadius="95%"
                barSize={22}
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: 'rgb(15, 23, 42)' }} // Dunkler Background für besseren Kontrast
                  dataKey="value"
                  cornerRadius={12}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as MetricWithDescription;
                      return (
                        <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-xl max-w-[250px]">
                          <div className="text-sm font-semibold text-slate-200 mb-1">
                            {data.name}: {data.value}%
                          </div>
                          <div className="text-xs text-slate-400 mb-2">
                            {data.description}
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed">
                            {data.impact}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* RIGHT: Potential Stats + Legend */}
        <div className="flex flex-col justify-center order-1 lg:order-2">
          {/* Big Potential Number - NICHT im Chart! */}
          <div className="mb-6 p-6 rounded-xl bg-slate-800/30 border border-slate-800/50">
            <div className="flex items-end justify-between mb-4">
              {/* Left: Score */}
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                  Potenzial-Score
                </div>
                <div className="text-5xl font-bold text-white tracking-tight">
                  {potentialPercent}%
                </div>
              </div>
              
              {/* Right: Description */}
              <div className="text-xs text-slate-600 text-right leading-tight">
                Durchschnitt<br/>
                über alle<br/>
                Faktoren
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-700/30 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${potentialPercent}%` }}
              />
            </div>
          </div>
          
          {/* Legend mit Details */}
          <div className="space-y-2">
            {radialData.map((item) => (
              <div
                key={item.name}
                className="group relative"
                onMouseEnter={() => setHoveredMetric(item.name)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-all cursor-help">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-slate-300">
                        {item.name}
                      </div>
                      <HelpCircle className="w-3 h-3 text-slate-600" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-200">
                    {item.value}%
                  </div>
                </div>
                
                {/* Tooltip on Hover */}
                {hoveredMetric === item.name && (
                  <div className="absolute left-0 right-0 top-full mt-2 p-3 rounded-lg bg-slate-900 border border-slate-700 shadow-xl z-10">
                    <div className="text-xs font-semibold text-slate-300 mb-1">
                      {item.description}
                    </div>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {item.impact}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Info Card - VERBESSERT */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800/50 mb-4">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="text-sm font-medium text-slate-400 mb-2">
              So liest du den Chart
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jeder Ring zeigt eine Optimierungs-Dimension. Je höher der Wert, 
              desto größer das Potenzial für Umsatzsteigerung. Fahre über die 
              Metriken für Details.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Button - Elegant */}
      <Link
        href="/demo/recommendations"
        className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 font-medium transition-all group"
      >
        <span className="flex items-center justify-center gap-2 text-sm">
          Alle Empfehlungen ansehen
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </span>
      </Link>
    </div>
  );
}
