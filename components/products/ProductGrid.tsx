'use client';

import { ProductCard } from './ProductCard';

interface Product {
  id: number | string;
  title: string;
  sku?: string;
  price: number;
  cost?: number;
  image?: string;
  image_url?: string;
  recommendation?: {
    recommended_price: number;
    change_percentage: number;
  };
  status?: 'Gut' | 'OK' | 'Niedrig' | string;
}

interface ProductGridProps {
  products: Product[];
  marginMap?: Record<number | string, number>;
}

export function ProductGrid({ products, marginMap }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          margin={marginMap?.[product.id]}
        />
      ))}
    </div>
  );
}
