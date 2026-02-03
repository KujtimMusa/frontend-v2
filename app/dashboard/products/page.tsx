'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts, syncProducts } from '@/lib/api';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useMemo } from 'react';
import { useShopStore } from '@/stores/shopStore';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function DashboardProductsPage() {
  const queryClient = useQueryClient();
  const { currentShop } = useShopStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const shopId = currentShop?.id;

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', shopId],
    queryFn: () => fetchProducts(shopId),
    enabled: !!shopId,
  });

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => (p.status || 'optimal') === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'margin_asc':
          return (a.cost || 0) - (b.cost || 0);
        case 'margin_desc':
          return (b.cost || 0) - (a.cost || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleSync = async () => {
    if (!shopId) {
      toast.error('Kein Shop ausgewählt');
      return;
    }

    try {
      await syncProducts(shopId);
      toast.success('Produkte synchronisiert');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Synchronisieren');
    }
  };

  const handleExport = () => {
    if (filteredProducts.length === 0) {
      toast.error('Keine Produkte zum Exportieren');
      return;
    }

    const csv = [
      ['Name', 'Preis', 'Kosten', 'Margin', 'Status'].join(','),
      ...filteredProducts.map((p) =>
        [
          p.title,
          p.price.toFixed(2),
          p.cost?.toFixed(2) || '',
          p.cost ? `${((p.price - p.cost) / p.price * 100).toFixed(1)}%` : '',
          p.status || 'optimal',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produkte-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('CSV exportiert');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Produkte</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} von {products?.length || 0} Produkten
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Synchronisieren
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categories={categories}
      />

      {selectedIds.length > 0 && (
        <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm">
            {selectedIds.length} Produkt{selectedIds.length !== 1 ? 'e' : ''} ausgewählt
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
              Auswahl aufheben
            </Button>
            <Button variant="outline" size="sm">
              Bulk-Aktion
            </Button>
          </div>
        </div>
      )}

      <ProductTable
        products={filteredProducts}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        showCheckboxes={true}
      />
    </div>
  );
}
