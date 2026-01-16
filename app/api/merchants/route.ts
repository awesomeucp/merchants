import { NextResponse } from 'next/server';
import { getAllMerchants, getDirectoryMetadata } from '@/lib/data/merchants';
import { filterMerchants } from '@/lib/utils/filter';
import { checkRateLimit } from '@/lib/utils/rate-limiter';
import type { FilterState } from '@/lib/types/merchant';

// Pagination configuration
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  // Check rate limit
  const rateLimit = checkRateLimit(request);

  if (rateLimit.limited) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
      },
      { status: 429 }
    );

    response.headers.set('X-RateLimit-Limit', '20');
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));
    response.headers.set('Retry-After', String(rateLimit.reset));
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  }

  const { searchParams } = new URL(request.url);

  // Parse pagination parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10))
  );

  // Parse filter parameters
  const filters: FilterState = {
    searchQuery: searchParams.get('q') || '',
    categories: searchParams.getAll('category'),
    capabilities: searchParams.getAll('capability'),
    paymentProviders: searchParams.getAll('payment'),
  };

  const allMerchants = getAllMerchants();
  const hasFilters = filters.searchQuery ||
                     filters.categories.length ||
                     filters.capabilities.length ||
                     filters.paymentProviders.length;

  const filtered = hasFilters
    ? filterMerchants(allMerchants, filters)
    : allMerchants;

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMerchants = filtered.slice(startIndex, endIndex);

  // Build pagination links
  const baseUrl = new URL(request.url);
  baseUrl.searchParams.set('limit', String(limit));

  const links: Record<string, string> = {};

  if (page > 1) {
    baseUrl.searchParams.set('page', String(page - 1));
    links.prev = baseUrl.toString();
  }

  if (page < totalPages) {
    baseUrl.searchParams.set('page', String(page + 1));
    links.next = baseUrl.toString();
  }

  baseUrl.searchParams.set('page', '1');
  links.first = baseUrl.toString();

  baseUrl.searchParams.set('page', String(totalPages));
  links.last = baseUrl.toString();

  const metadata = getDirectoryMetadata();

  const response = NextResponse.json({
    merchants: paginatedMerchants,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    links,
    metadata,
  });

  // Add CORS headers for public API
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '20');
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
