'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDemoProducts } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  SlidersHorizontal,
  X,
  Zap,
  Eye,
  MoreVertical,
  FileText,
  Edit,
  Copy,
  Trash,
  Download,
  Settings,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Plus,
  Filter as FilterIcon,
  BarChart3,
  DollarSign,
  ShoppingCart,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProductCardGrid } from '@/components/products/ProductCardGrid';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductQuickView } from '@/components/products/ProductQuickView';
import { StatsCards } from '@/components/products/StatsCards';
import { FilterBar } from '@/components/products/FilterBar';

type ViewMode = 'grid' | 'table';

interface Product {
  id: number;
  title: string;
  sku?: string;
  image?: string;
  price: number;
  cost?: number;
  recommendation?: number;
  status?: string;
}

export default function DemoProductsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['demo', 'products'],
    queryFn: getDemoProducts,
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ✅ Status filter - KORRIGIERT!
    if (statusFilter !== 'all') {
      if (statusFilter === 'with') {
        filtered = filtered.filter((p) => p.recommendation);
      } else if (statusFilter === 'without') {
        filtered = filtered.filter((p) => !p.recommendation);
      } else if (statusFilter === 'good') {
        // ✅ Filter "Gut" → Zeigt nur Produkte mit margin >= 50%
        filtered = filtered.filter((p) => {
          const margin = p.cost ? ((p.price - p.cost) / p.price) * 100 : 0;
          return margin >= 50;
        });
      } else if (statusFilter === 'ok') {
        // ✅ Filter "OK" → Zeigt nur Produkte mit margin 30-49%
        filtered = filtered.filter((p) => {
          const margin = p.cost ? ((p.price - p.cost) / p.price) * 100 : 0;
          return margin >= 30 && margin < 50;
        });
      } else if (statusFilter === 'low') {
        // ✅ Filter "Niedrig" → Zeigt nur Produkte mit margin < 30%
        filtered = filtered.filter((p) => {
          const margin = p.cost ? ((p.price - p.cost) / p.price) * 100 : 0;
          return margin < 30;
        });
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'margin':
          const marginA = a.cost ? ((a.price - a.cost) / a.price) * 100 : 0;
          const marginB = b.cost ? ((b.price - b.cost) / b.price) * 100 : 0;
          return marginB - marginA;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchQuery, statusFilter, sortBy]);

  const productsWithRecommendation = products?.filter((p) => p.recommendation).length || 0;
  const productsWithoutRecommendation = (products?.length || 0) - productsWithRecommendation;

  const getStatusBadge = (product: Product) => {
    const margin = product.cost ? ((product.price - product.cost) / product.price) * 100 : 0;

    // ✅ NEUTRAL GRAU - Keine Farben mehr!
    let statusText = 'OK';
    if (margin >= 50) {
      statusText = 'Gut';
    } else if (margin >= 30) {
      statusText = 'OK';
    } else {
      statusText = 'Niedrig';
    }

    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        <span className="uppercase tracking-wider font-medium">
          {statusText}
        </span>
      </div>
    );
  };

  // ✅ NEUTRAL GRAU - Keine Farben mehr!
  const getMarginColor = (margin: number) => {
    return 'text-slate-400';
  };

  // ✅ getMarginIcon removed - nicht mehr benötigt (keine Icons mehr!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* ✅ KOMPAKTER HEADER */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Produkte</h1>
              <p className="text-sm text-slate-500">
                Verwalte und optimiere deine Shopify-Produkte
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-900/50 transition-all">
                + Produkt
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all">
                <Sparkles className="w-4 h-4" />
                Alle analysieren
              </button>
            </div>
          </div>
          
          {/* Stats Cards - Elegant */}
          <StatsCards stats={{
            total: products?.length || 0,
            withRecommendations: productsWithRecommendation,
            withoutRecommendations: productsWithoutRecommendation,
            optimizationPotential: 5234,
          }} />
          
          {/* Filter Bar - Elegant */}
          <FilterBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* ✅ BULK ACTION BAR - SUBTILER */}
        {selectedProducts.size > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800/50">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">
                {selectedProducts.size} Produkt(e) ausgewählt
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Analysieren
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>
          </div>
        )}

        {/* Content - Conditional Rendering */}
        {viewMode === 'grid' ? (
          <ProductCardGrid 
            products={filteredAndSortedProducts.map(p => ({
              id: p.id,
              title: p.title,
              name: p.title,
              sku: p.sku,
              price: p.price,
              current_price: p.price,
              image: p.image,
              image_url: p.image,
              status: p.status || (p.cost ? ((p.price - p.cost) / p.price) * 100 >= 50 ? 'Gut' : ((p.price - p.cost) / p.price) * 100 >= 30 ? 'OK' : 'Niedrig' : 'OK'),
              recommendation: p.recommendation ? { recommended_price: p.recommendation } : undefined,
              has_recommendation: !!p.recommendation,
              margin: p.cost ? ((p.price - p.cost) / p.price) * 100 : undefined,
              cost: p.cost,
              category: 'Produkt', // Placeholder - sollte aus API kommen
              trend: 'up' as const, // Placeholder - sollte aus API kommen
              sales30d: 145, // Placeholder - sollte aus API kommen
              selected: selectedProducts.has(p.id),
              onSelect: (id) => {
                const newSelected = new Set(selectedProducts);
                if (newSelected.has(id as number)) {
                  newSelected.delete(id as number);
                } else {
                  newSelected.add(id as number);
                }
                setSelectedProducts(newSelected);
              },
            }))} 
          />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900/50 border-b border-slate-800 hover:bg-slate-900/50">
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider w-12">
                    <Checkbox
                      checked={selectedProducts.size === filteredAndSortedProducts.length && filteredAndSortedProducts.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(new Set(filteredAndSortedProducts.map((p) => p.id)));
                        } else {
                          setSelectedProducts(new Set());
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    PRODUKT
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-300">
                      AKTUELLER PREIS
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    KOSTEN
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-slate-300">
                      MARGIN
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    EMPFEHLUNG
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    STATUS
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    AKTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-800">
                {filteredAndSortedProducts.map((product) => {
                  const margin = product.cost ? ((product.price - product.cost) / product.price) * 100 : 0;

                  return (
                    <TableRow
                      key={product.id}
                      className={cn(
                        'group hover:bg-slate-800/50 transition-colors',
                        selectedProducts.has(product.id) && 'bg-slate-800/30'
                      )}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.has(product.id)}
                          onCheckedChange={(checked) => {
                            const newSelected = new Set(selectedProducts);
                            if (checked) {
                              newSelected.add(product.id);
                            } else {
                              newSelected.delete(product.id);
                            }
                            setSelectedProducts(newSelected);
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-100 group-hover:text-slate-50">
                              {product.title}
                            </div>
                            {/* ✅ SKU removed! */}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-slate-100 font-medium">
                        €{product.price.toFixed(2)}
                      </TableCell>

                      <TableCell className="text-slate-400">
                        {product.cost ? `€${product.cost.toFixed(2)}` : '-'}
                      </TableCell>

                      <TableCell>
                        {product.cost ? (
                          <div className="flex items-center gap-2">
                            {/* ✅ NEUTRAL GRAU - Keine Icons mehr! */}
                            <span className="text-sm font-bold text-slate-400">
                              {margin.toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {product.recommendation ? (
                          <div>
                            <div className="font-medium text-slate-100">
                              €{product.recommendation.toFixed(2)}
                            </div>
                            <div className="text-sm text-emerald-400">
                              +€{(product.recommendation - product.price).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Keine</span>
                        )}
                      </TableCell>

                      <TableCell>{getStatusBadge(product)}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/demo/recommendations/${product.id}`);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                            title="Empfehlung generieren"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
                            title="Schnellansicht"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
}
