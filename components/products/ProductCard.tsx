'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ArrowUpRight, Sparkles, TrendingUp, TrendingDown, ShoppingCart, Eye, Edit, Trash2, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  category?: string;
  trend?: 'up' | 'down' | 'stable';
  sales30d?: number;
  selected?: boolean;
  onSelect?: (id: number | string) => void;
}

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const productName = product.name || product.title;
  const productPrice = product.current_price || product.price;
  const imageUrl = product.image_url || product.image;
  const hasRecommendation = product.has_recommendation ?? !!product.recommendation;
  
  // Calculate margin if not provided
  const margin = product.margin ?? (product.cost ? ((productPrice - product.cost) / productPrice) * 100 : undefined);
  
  // Determine status
  const status = product.status || 
    (margin !== undefined 
      ? margin >= 50 ? 'Gut' 
      : margin >= 30 ? 'OK' 
      : 'Niedrig'
      : 'OK');
  
  // ✅ Status Color Mapping - DEZENT (nur grau!)
  const statusConfig = {
    'Gut': {
      text: 'text-slate-400',
      dot: 'bg-slate-600'
    },
    'OK': {
      text: 'text-slate-400',
      dot: 'bg-slate-600'
    },
    'Niedrig': {
      text: 'text-slate-400',
      dot: 'bg-slate-600'
    }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['OK'];
  
  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.onSelect) {
      product.onSelect(product.id);
    }
  };
  
  return (
    <div
      className={cn(
        "group relative h-full rounded-xl bg-slate-900/40 backdrop-blur-sm border transition-all duration-300 overflow-hidden",
        product.selected ? 'border-indigo-500/50 bg-indigo-900/10' : 'border-slate-800/50 hover:border-slate-700/50'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/0 via-slate-800/0 to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-slate-800/30 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={productName || 'Product'}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-700" strokeWidth={1.5} />
            </div>
          )}
          
          {/* ✅ Checkbox - Top Left */}
          {product.onSelect && (
            <button
              onClick={handleSelect}
              className={cn(
                "absolute top-3 left-3 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                product.selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                product.selected 
                  ? "bg-indigo-500 border-indigo-500" 
                  : "bg-slate-900/80 border-slate-600 backdrop-blur-sm"
              )}
            >
              {product.selected && <CheckSquare className="w-3 h-3 text-white" strokeWidth={3} />}
            </button>
          )}
          
          {/* ✅ Status Badge - SUBTIL (nur Dot + Text) */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <div className={cn(
              "flex items-center gap-1.5 text-xs",
              config.text
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
              <span className="uppercase tracking-wider font-medium">
                {status}
              </span>
            </div>
            
            {hasRecommendation && (
              <Sparkles className="w-3.5 h-3.5 text-slate-600" strokeWidth={2} />
            )}
          </div>
          
          {/* ✅ Hover Actions */}
          <div className={cn(
            "absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center gap-2 transition-all",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Link
              href={`/demo/recommendations/${product.id}`}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-all">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-4">
          {/* ✅ Category - SUBTIL (Trend entfernt) */}
          {product.category && (
            <div className="mb-3">
              <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
                {product.category}
              </span>
            </div>
          )}
          
          {/* Product Name */}
          <Link href={`/demo/recommendations/${product.id}`}>
            <h3 className="font-semibold text-white text-sm mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
              {productName}
            </h3>
            {/* ✅ SKU removed! */}
          </Link>
          
          {/* Price & Margin */}
          <div className="flex items-end justify-between pt-2 border-t border-slate-800/50 mb-3">
            <div>
              <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">
                Preis
              </div>
              <div className="text-lg font-bold text-white">
                €{productPrice.toFixed(2)}
              </div>
            </div>
              {margin !== undefined && (
                <div className="text-right">
                  <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">
                    Marge
                  </div>
                  <div className={cn(
                    "text-lg font-bold",
                    config.text
                  )}>
                    {margin.toFixed(1)}%
                  </div>
                </div>
              )}
          </div>
          
          {/* ✅ Sales Info */}
          {product.sales30d !== undefined && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/50 mb-3">
              <div className="flex items-center gap-1">
                <ShoppingCart className="w-3 h-3" />
                <span>{product.sales30d} Verkäufe</span>
              </div>
              <span className="text-[10px]">30 Tage</span>
            </div>
          )}
          
          {/* CTA */}
          {!hasRecommendation ? (
            <Link
              href={`/demo/recommendations/${product.id}`}
              className="block w-full py-2.5 px-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/50 text-white text-sm font-medium text-center transition-all group/btn"
            >
              <span className="flex items-center justify-center gap-2">
                Keine Empfehlung
                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          ) : (
            <Link
              href={`/demo/recommendations/${product.id}`}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 group-hover:bg-slate-800 group-hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-600" strokeWidth={2} />
                <span className="text-sm font-medium text-slate-300">
                  Empfehlung verfügbar
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
