'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Download, Share2, Settings, Zap, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductAnalysisHeaderProps {
  productTitle: string;
  currentPrice: number;
  productImage?: string;
  productSku?: string;
  productCost?: number;
  productMargin?: number;
  productPotential?: number;
  onBack?: () => void;
  onGenerate?: () => void;
  isGenerating?: boolean;
}

export function ProductAnalysisHeader({
  productTitle,
  currentPrice,
  productImage,
  productSku,
  productCost,
  productMargin = 0,
  productPotential = 0,
  onBack,
  onGenerate,
  isGenerating = false,
}: ProductAnalysisHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="mb-8">
      {/* Clean Header - No Breadcrumbs */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Produkt-Analysen
          </h1>
          <p className="text-slate-400 text-sm">
            Vollständige Analyse für optimale Preisentscheidungen
          </p>
        </div>
        
        {/* Action Buttons - Clean & Minimal */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700/50 transition-all"
          >
            <Download className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700/50 transition-all"
          >
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/50 text-slate-400 hover:text-slate-300 hover:border-slate-700/50 transition-all"
          >
            <Settings className="w-5 h-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Enhanced Product Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
              {productImage ? (
                <img src={productImage} alt={productTitle} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Package className="w-8 h-8 text-slate-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-1">{productTitle}</h2>
              {productSku && <p className="text-sm text-slate-500">{productSku}</p>}
            </div>
          </div>

          {/* Status Badge & Action Button */}
          <div className="flex items-center gap-3">
            {productMargin > 0 && (
              <Badge
                className={cn(
                  productMargin >= 30
                    ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                    : productMargin >= 20
                    ? 'bg-amber-900/30 text-amber-400 border-amber-800'
                    : 'bg-red-900/30 text-red-400 border-red-800'
                )}
              >
                {productMargin >= 30 ? '✅ Gut' : productMargin >= 20 ? '⚠️ OK' : '❌ Niedrig'}
              </Badge>
            )}
            
            {/* Neu analysieren Button - Integrated */}
            {onGenerate && (
              <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 font-medium transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    Generiere...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" strokeWidth={2} />
                    Neu analysieren
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-slate-400 mb-1">Aktueller Preis</div>
            <div className="text-2xl font-bold text-slate-100">€{currentPrice.toFixed(2)}</div>
          </div>
          {productCost !== undefined && (
            <div>
              <div className="text-sm text-slate-400 mb-1">Kosten</div>
              <div className="text-2xl font-bold text-slate-100">€{productCost.toFixed(2)}</div>
            </div>
          )}
          {productMargin > 0 && (
            <div>
              <div className="text-sm text-slate-400 mb-1">Marge</div>
              <div className="text-2xl font-bold text-emerald-400">{productMargin.toFixed(1)}%</div>
            </div>
          )}
          {productPotential > 0 && (
            <div>
              <div className="text-sm text-slate-400 mb-1">Potenzial</div>
              <div className="text-2xl font-bold text-emerald-400">+€{productPotential.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
