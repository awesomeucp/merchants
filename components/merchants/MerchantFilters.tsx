'use client';

import { Button } from '@/components/ui/Button';
import { FilterGroup } from './FilterGroup';
import { Tag, Lightning, CreditCard, X } from '@phosphor-icons/react';
import type { DirectoryMetadata, FilterState } from '@/lib/types/merchant';

interface MerchantFiltersProps {
  metadata: DirectoryMetadata;
  filterState: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function MerchantFilters({ metadata, filterState, onFilterChange }: MerchantFiltersProps) {
  const hasActiveFilters =
    filterState.categories.length > 0 ||
    filterState.capabilities.length > 0 ||
    filterState.paymentProviders.length > 0;

  const handleClearFilters = () => {
    onFilterChange({
      searchQuery: filterState.searchQuery,
      categories: [],
      capabilities: [],
      paymentProviders: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <FilterGroup
        title="Categories"
        icon={<Tag size={16} weight="duotone" />}
        options={metadata.categories}
        selected={filterState.categories}
        onChange={categories => onFilterChange({ ...filterState, categories })}
      />

      {/* Capabilities */}
      <FilterGroup
        title="UCP Capabilities"
        icon={<Lightning size={16} weight="duotone" />}
        options={metadata.capabilities}
        selected={filterState.capabilities}
        onChange={capabilities => onFilterChange({ ...filterState, capabilities })}
      />

      {/* Payment Providers */}
      <FilterGroup
        title="Payment Methods"
        icon={<CreditCard size={16} weight="duotone" />}
        options={metadata.paymentProviders}
        selected={filterState.paymentProviders}
        onChange={paymentProviders => onFilterChange({ ...filterState, paymentProviders })}
      />

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="w-full"
        >
          <X size={16} weight="regular" className="mr-1.5" />
          Clear all filters
        </Button>
      )}
    </div>
  );
}
