'use client';

import { useState, useMemo, useEffect } from 'react';
import { MerchantGrid } from '@/components/merchants/MerchantGrid';
import { MerchantFilters } from '@/components/merchants/MerchantFilters';
import { SearchBar } from '@/components/merchants/SearchBar';
import { MerchantStats } from '@/components/merchants/MerchantStats';
import { filterMerchants } from '@/lib/utils/filter';
import { analytics } from '@/lib/utils/analytics';
import { Funnel, X } from '@phosphor-icons/react';
import type { Merchant, DirectoryMetadata, FilterState } from '@/lib/types/merchant';

interface BrowsePageProps {
  merchants: Merchant[];
  metadata: DirectoryMetadata;
}

export function BrowsePage({ merchants, metadata }: BrowsePageProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    categories: [],
    capabilities: [],
    paymentProviders: [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredMerchants = useMemo(
    () => filterMerchants(merchants, filters),
    [merchants, filters]
  );

  // Track search queries with debounce
  useEffect(() => {
    if (filters.searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        analytics.search(filters.searchQuery, filteredMerchants.length);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters.searchQuery, filteredMerchants.length]);

  const handleFilterChange = (newFilters: FilterState) => {
    // Track new filter selections
    const filterTypes: Array<{ key: keyof FilterState; type: string }> = [
      { key: 'categories', type: 'category' },
      { key: 'capabilities', type: 'capability' },
      { key: 'paymentProviders', type: 'payment' },
    ];

    filterTypes.forEach(({ key, type }) => {
      if (key === 'searchQuery') return;
      const oldValues = filters[key] as string[];
      const newValues = newFilters[key] as string[];

      // Track newly added filters
      newValues.forEach(value => {
        if (!oldValues.includes(value)) {
          analytics.filter(type, value);
        }
      });
    });

    setFilters(newFilters);
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.capabilities.length +
    filters.paymentProviders.length;

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      capabilities: [],
      paymentProviders: [],
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero Section */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4 text-zinc-900 dark:text-zinc-100">
            UCP Merchant Directory
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto px-2">
            Discover stores ready for AI commerce. Browse verified UCP-enabled
            merchants compatible with AI shopping agents.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <MerchantFilters
                metadata={metadata}
                filterState={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Search Bar + Stats + Mobile Filter Button */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <SearchBar
                    value={filters.searchQuery}
                    onChange={query => setFilters({ ...filters, searchQuery: query })}
                  />
                </div>
                {/* Mobile Filter Button */}
                <button
                  onClick={toggleMobileFilters}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Funnel size={20} weight="regular" />
                  <span className="font-medium">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
              <MerchantStats
                total={filteredMerchants.length}
                totalMerchants={metadata.totalMerchants}
              />
            </div>

            {/* Merchant Grid */}
            {filteredMerchants.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                  No merchants found matching your filters.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                  Try adjusting your search or clearing some filters.
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <MerchantGrid merchants={filteredMerchants} />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMobileFilters}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-zinc-900 z-50 lg:hidden overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Filters
              </h2>
              <div className="flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={toggleMobileFilters}
                  className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  aria-label="Close filters"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <MerchantFilters
                metadata={metadata}
                filterState={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4">
              <button
                onClick={toggleMobileFilters}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Show {filteredMerchants.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
