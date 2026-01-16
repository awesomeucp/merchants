import type { Merchant, FilterState } from '@/lib/types/merchant';

/**
 * Filter merchants based on search query and selected filters
 */
export function filterMerchants(
  merchants: Merchant[],
  filters: FilterState
): Merchant[] {
  return merchants.filter(merchant => {
    // Search query (name, description, tags, categories)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        merchant.name,
        merchant.description,
        ...merchant.tags,
        ...merchant.categories,
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Category filter (OR logic - any category matches)
    if (filters.categories.length > 0) {
      const hasCategory = filters.categories.some(cat =>
        merchant.categories.includes(cat)
      );
      if (!hasCategory) return false;
    }

    // Capability filter (AND logic - all capabilities must be present)
    if (filters.capabilities.length > 0) {
      const merchantCapabilities = merchant.ucpProfile.capabilities.map(c => c.name);
      const hasAllCapabilities = filters.capabilities.every(cap =>
        merchantCapabilities.includes(cap)
      );
      if (!hasAllCapabilities) return false;
    }

    // Payment provider filter (OR logic - any provider matches)
    if (filters.paymentProviders.length > 0) {
      const merchantProviders = merchant.ucpProfile.paymentHandlers
        .flatMap(h => h.providers);
      const hasProvider = filters.paymentProviders.some(provider =>
        merchantProviders.includes(provider)
      );
      if (!hasProvider) return false;
    }

    return true;
  });
}
