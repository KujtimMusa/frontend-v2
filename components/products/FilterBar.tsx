'use client';

import { Search, SlidersHorizontal, Download, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'table';

interface FilterBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export function FilterBar({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {/* Search - Minimal */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" strokeWidth={2} />
        <input
          type="text"
          placeholder="Produkte durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-700/50 transition-all text-sm"
        />
      </div>
      
      {/* Status Filter - Minimal */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 text-slate-300 text-sm font-medium focus:outline-none focus:border-slate-700/50 transition-all appearance-none cursor-pointer"
      >
        <option className="bg-slate-900 text-slate-300" value="all">Status: Alle</option>
        <option className="bg-slate-900 text-slate-300" value="good">Gut</option>
        <option className="bg-slate-900 text-slate-300" value="ok">OK</option>
        <option className="bg-slate-900 text-slate-300" value="low">Niedrig</option>
        <option className="bg-slate-900 text-slate-300" value="with">Mit Empfehlung</option>
        <option className="bg-slate-900 text-slate-300" value="without">Ohne Empfehlung</option>
      </select>
      
      {/* Sort - Minimal */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 text-slate-300 text-sm font-medium focus:outline-none focus:border-slate-700/50 transition-all appearance-none cursor-pointer"
      >
        <option className="bg-slate-900 text-slate-300" value="name">Name (A-Z)</option>
        <option className="bg-slate-900 text-slate-300" value="price-asc">Preis ↑</option>
        <option className="bg-slate-900 text-slate-300" value="price-desc">Preis ↓</option>
        <option className="bg-slate-900 text-slate-300" value="margin">Marge ↓</option>
      </select>
      
      {/* Filter Button */}
      <button className="p-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 text-slate-500 hover:text-slate-400 hover:border-slate-700/50 transition-all">
        <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
      </button>
      
      {/* Export Button */}
      <button className="p-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 text-slate-500 hover:text-slate-400 hover:border-slate-700/50 transition-all">
        <Download className="w-4 h-4" strokeWidth={2} />
      </button>
      
      {/* View Toggle - Minimal */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50">
        <button
          onClick={() => setViewMode('grid')}
          className={cn(
            "p-2 rounded-lg transition-all",
            viewMode === 'grid'
              ? 'bg-slate-800 text-slate-300'
              : 'text-slate-600 hover:text-slate-500'
          )}
        >
          <Grid className="w-4 h-4" strokeWidth={2} />
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={cn(
            "p-2 rounded-lg transition-all",
            viewMode === 'table'
              ? 'bg-slate-800 text-slate-300'
              : 'text-slate-600 hover:text-slate-500'
          )}
        >
          <List className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
