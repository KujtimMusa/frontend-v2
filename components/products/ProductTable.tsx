'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Product } from '@/types/models';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  showCheckboxes?: boolean;
  onProductClick?: (product: Product) => void;
}

export function ProductTable({
  products,
  selectedIds = [],
  onSelectionChange,
  showCheckboxes = false,
  onProductClick,
}: ProductTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: any = a[sortField as keyof Product];
    let bVal: any = b[sortField as keyof Product];

    if (sortField === 'price' || sortField === 'cost') {
      aVal = aVal || 0;
      bVal = bVal || 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(products.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, productId]);
    } else {
      onSelectionChange(selectedIds.filter((id) => id !== productId));
    }
  };

  const getStatusBadge = (product: Product) => {
    const status = product.status || 'optimal';
    const variants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
      optimal: 'default',
      recommended: 'warning',
      applied: 'success',
      low: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status === 'optimal' ? 'Optimal' : status === 'recommended' ? 'Empfohlen' : status === 'applied' ? 'Umgesetzt' : 'Niedrig'}
      </Badge>
    );
  };

  const calculateMargin = (product: Product) => {
    if (!product.cost) return null;
    const margin = ((product.price - product.cost) / product.price) * 100;
    return margin.toFixed(1);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckboxes && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            <TableHead>Name</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('price')}
            >
              Aktueller Preis
              {sortField === 'price' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead>Kosten</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('cost')}
            >
              Margin
              {sortField === 'cost' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
            </TableHead>
            <TableHead>Empfehlung</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showCheckboxes ? 8 : 7} className="text-center py-8 text-muted-foreground">
                Keine Produkte gefunden
              </TableCell>
            </TableRow>
          ) : (
            sortedProducts.map((product) => (
              <TableRow
                key={product.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  if (onProductClick) {
                    onProductClick(product);
                  } else {
                    router.push(`/dashboard/recommendations/${product.id}`);
                  }
                }}
              >
                {showCheckboxes && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>€{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  {product.cost ? `€${product.cost.toFixed(2)}` : '-'}
                </TableCell>
                <TableCell>
                  {product.cost ? `${calculateMargin(product)}%` : '-'}
                </TableCell>
                <TableCell>
                  {product.recommendation ? (
                    <span className="text-success font-semibold">
                      €{product.recommendation.toFixed(2)}
                    </span>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(product)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (onProductClick) {
                        onProductClick(product);
                      } else {
                        router.push(`/dashboard/recommendations/${product.id}`);
                      }
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
