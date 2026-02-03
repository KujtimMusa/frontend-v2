'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Loader2 } from 'lucide-react';

interface GenerateRecommendationCTAProps {
  lastAnalysis?: Date | string;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function GenerateRecommendationCTA({
  lastAnalysis,
  onGenerate,
  isGenerating,
}: GenerateRecommendationCTAProps) {
  const formatDate = (date: Date | string) => {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mb-6 p-6 rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-100">Neue Empfehlung generieren</h3>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Erstelle eine aktualisierte Preisempfehlung basierend auf aktuellen Marktdaten
          </p>
          {lastAnalysis && (
            <div className="text-xs text-slate-500">
              Letzte Analyse: {formatDate(lastAnalysis)}
            </div>
          )}
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-slate-100 hover:bg-white text-slate-900 font-bold"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generiere...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Empfehlung generieren
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
