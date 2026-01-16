'use client';

import { useState, useMemo } from 'react';
import { MerchantGrid } from '@/components/merchants/MerchantGrid';
import { MerchantFilters } from '@/components/merchants/MerchantFilters';
import { SearchBar } from '@/components/merchants/SearchBar';
import { MerchantStats } from '@/components/merchants/MerchantStats';
import { filterMerchants } from '@/lib/utils/filter';
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

  const filteredMerchants = useMemo(
    () => filterMerchants(merchants, filters),
    [merchants, filters]
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Hero Section */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">
            UCP Merchant Directory
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Discover stores ready for AI commerce. Browse verified UCP-enabled
            merchants compatible with AI shopping agents.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Filters
              </h2>
              <MerchantFilters
                metadata={metadata}
                filterState={filters}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {/* Search Bar + Stats */}
            <div className="mb-6 space-y-4">
              <SearchBar
                value={filters.searchQuery}
                onChange={query => setFilters({ ...filters, searchQuery: query })}
              />
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
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  Try adjusting your search or clearing some filters.
                </p>
              </div>
            ) : (
              <MerchantGrid merchants={filteredMerchants} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
