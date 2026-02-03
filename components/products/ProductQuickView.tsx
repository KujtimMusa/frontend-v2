'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  sku?: string;
  image?: string;
  price: number;
  cost?: number;
  recommendation?: number;
}

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickView({ product, onClose }: ProductQuickViewProps) {
  if (!product) return null;

  const margin = product.cost
    ? ((product.price - product.cost) / product.price) * 100
    : 0;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <div>
              <div className="text-lg font-bold text-slate-100">{product.title}</div>
              {product.sku && <div className="text-sm text-slate-400">{product.sku}</div>}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Comparison */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <div className="text-sm text-slate-400 mb-1">Aktuell</div>
              <div className="text-2xl font-bold text-slate-100">
                €{product.price.toFixed(2)}
              </div>
            </div>

            {product.recommendation && (
              <>
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Empfohlen</div>
                  <div className="text-2xl font-bold text-slate-100">
                    €{product.recommendation.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-800">
                  <div className="text-sm text-emerald-400 mb-1">Ersparnis</div>
                  <div className="text-2xl font-bold text-emerald-400">
                    +€{(product.recommendation - product.price).toFixed(2)}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Kosten-Breakdown */}
          {product.cost && (
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Kosten-Breakdown</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-300">Einkauf</span>
                  <span className="text-sm font-medium text-slate-100">
                    €{product.cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                  <span className="text-sm text-slate-300">Margin</span>
                  <span className="text-sm font-medium text-slate-100">{margin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!product.recommendation && (
              <Button className="flex-1 bg-slate-100 hover:bg-white text-slate-900 font-bold">
                <Zap className="w-4 h-4 mr-2" />
                Empfehlung generieren
              </Button>
            )}

            <Button variant="outline" asChild className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-100">
              <Link href={`/demo/recommendations/${product.id}`}>
                Details ansehen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
