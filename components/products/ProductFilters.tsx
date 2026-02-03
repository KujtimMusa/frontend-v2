'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter?: string;
  onCategoryChange?: (value: string) => void;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  categories?: string[];
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  categories = [],
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Produkte suchen..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {onCategoryChange && categories.length > 0 && (
        <Select value={categoryFilter || 'all'} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Kategorien</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onStatusChange && (
        <Select value={statusFilter || 'all'} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="optimal">Optimal</SelectItem>
            <SelectItem value="recommended">Empfohlen</SelectItem>
            <SelectItem value="applied">Umgesetzt</SelectItem>
            <SelectItem value="low">Niedrig</SelectItem>
          </SelectContent>
        </Select>
      )}

      {onSortChange && (
        <Select value={sortBy || 'name'} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price_asc">Preis (niedrig → hoch)</SelectItem>
            <SelectItem value="price_desc">Preis (hoch → niedrig)</SelectItem>
            <SelectItem value="margin_asc">Margin (niedrig → hoch)</SelectItem>
            <SelectItem value="margin_desc">Margin (hoch → niedrig)</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
