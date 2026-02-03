'use client';

import { Package, Lightbulb, AlertCircle, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductsHeaderProps {
  totalProducts: number;
  withRecommendations: number;
  withoutRecommendations: number;
}

export function ProductsHeader({
  totalProducts,
  withRecommendations,
  withoutRecommendations,
}: ProductsHeaderProps) {
  return (
    <div className="mb-8">
      {/* Title & Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-1">Produkte</h1>
          <p className="text-slate-400">Verwalte und optimiere deine Shopify-Produkte</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="border-slate-700 hover:bg-slate-800 text-slate-100">
            <Link href="/demo/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Produkt
            </Link>
          </Button>

          <Button size="sm" className="bg-slate-100 hover:bg-white text-slate-900 font-bold">
            <Zap className="w-4 h-4 mr-2" />
            Alle analysieren
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-100">{totalProducts}</div>
              <div className="text-sm text-slate-400">Produkte</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'p-4 rounded-lg border',
            withRecommendations === 0
              ? 'bg-amber-900/10 border-amber-800/30'
              : 'bg-slate-900/50 border-slate-800'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                withRecommendations === 0 ? 'bg-amber-900/20' : 'bg-slate-800'
              )}
            >
              <Lightbulb
                className={cn(
                  'w-5 h-5',
                  withRecommendations === 0 ? 'text-amber-400' : 'text-slate-300'
                )}
              />
            </div>
            <div>
              <div
                className={cn(
                  'text-2xl font-bold',
                  withRecommendations === 0 ? 'text-amber-400' : 'text-slate-100'
                )}
              >
                {withRecommendations}
              </div>
              <div className="text-sm text-slate-400">Mit Empfehlungen</div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'p-4 rounded-lg border',
            withoutRecommendations > 0
              ? 'bg-red-900/10 border-red-800/30'
              : 'bg-slate-900/50 border-slate-800'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                withoutRecommendations > 0 ? 'bg-red-900/20' : 'bg-slate-800'
              )}
            >
              <AlertCircle
                className={cn(
                  'w-5 h-5',
                  withoutRecommendations > 0 ? 'text-red-400' : 'text-slate-300'
                )}
              />
            </div>
            <div>
              <div
                className={cn(
                  'text-2xl font-bold',
                  withoutRecommendations > 0 ? 'text-red-400' : 'text-slate-100'
                )}
              >
                {withoutRecommendations}
              </div>
              <div className="text-sm text-slate-400">Ohne Empfehlungen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
