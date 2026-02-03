'use client';

import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

interface Product {
  id: number | string;
  title?: string;
  name?: string;
  sku?: string;
  price: number;
  current_price?: number;
  image?: string;
  image_url?: string;
  status?: 'Gut' | 'OK' | 'Niedrig' | string;
  confidence?: number;
  recommendation?: {
    recommended_price?: number;
    change_percentage?: number;
  };
  has_recommendation?: boolean;
  margin?: number;
  cost?: number;
}

export function ProductCardGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">
          Keine Produkte gefunden
        </h3>
        <p className="text-slate-500">
          Füge dein erstes Produkt hinzu oder passe deine Filter an.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
