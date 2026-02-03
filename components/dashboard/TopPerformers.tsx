'use client';

import { Trophy, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Product {
  name: string;
  price: string;
  margin: string;
  change: string;
}

const topProducts: Product[] = [
  { name: 'Adidas Samba', price: '€95.99', margin: '45%', change: '+25%' },
  { name: 'iPhone 15 Pro', price: '€1,199', margin: '29%', change: '+18%' },
  { name: 'Nike Air Max', price: '€149.99', margin: '50%', change: '+12%' },
];

const lowPerformers: Product[] = [
  { name: 'Dyson V15', price: '€749', margin: '-5%', change: '-15%' },
  { name: 'Canada Goose', price: '€1,295', margin: '12%', change: '-8%' },
  { name: 'GoPro Hero12', price: '€449', margin: '15%', change: '-3%' },
];

export function TopPerformers() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Top Performers */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-slate-100">Top 3 Produkte</h3>
        </div>
        <div className="space-y-3">
          {topProducts.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 font-bold">{idx + 1}.</span>
                  <span className="text-sm font-medium text-slate-200">{product.name}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {product.price} · {product.margin} Marge
                </div>
              </div>
              <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                {product.change}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Low Performers */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/70">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-slate-100">Sorgenkinder</h3>
        </div>
        <div className="space-y-3">
          {lowPerformers.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 font-bold">{idx + 1}.</span>
                  <span className="text-sm font-medium text-slate-200">{product.name}</span>
                </div>
                <div className="text-xs text-slate-400">
                  {product.price} · {product.margin} Marge
                </div>
              </div>
              <Badge className="bg-red-900/30 text-red-400 border-red-800">
                {product.change}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
