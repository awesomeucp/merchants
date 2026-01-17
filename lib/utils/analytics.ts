'use client';

// Google Analytics event types
export type AnalyticsEvent =
  | { name: 'merchant_view'; properties: { merchant_slug: string; merchant_name: string } }
  | { name: 'merchant_click'; properties: { merchant_slug: string; merchant_name: string } }
  | { name: 'search'; properties: { search_term: string; results_count: number } }
  | { name: 'filter'; properties: { filter_type: string; filter_value: string } }
  | { name: 'outbound_click'; properties: { url: string; merchant_slug?: string } }
  | { name: 'json_download'; properties: { merchant_slug: string } };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event with Google Analytics
 */
export function trackEvent<T extends AnalyticsEvent>(
  event: T['name'],
  properties: Extract<AnalyticsEvent, { name: T['name'] }>['properties']
): void {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA Event]', event, properties);
    }
  } catch {
    // Silently fail if analytics is blocked
  }
}

// Convenience functions for common events
export const analytics = {
  /** Track when a merchant detail page is viewed */
  merchantView: (slug: string, name: string) =>
    trackEvent('merchant_view', { merchant_slug: slug, merchant_name: name }),

  /** Track when a merchant card is clicked from the grid */
  merchantClick: (slug: string, name: string) =>
    trackEvent('merchant_click', { merchant_slug: slug, merchant_name: name }),

  /** Track search queries */
  search: (query: string, resultsCount: number) =>
    trackEvent('search', { search_term: query, results_count: resultsCount }),

  /** Track filter usage */
  filter: (type: string, value: string) =>
    trackEvent('filter', { filter_type: type, filter_value: value }),

  /** Track outbound link clicks */
  outboundClick: (url: string, merchantSlug?: string) =>
    trackEvent('outbound_click', { url, merchant_slug: merchantSlug }),

  /** Track JSON downloads from submit form */
  jsonDownload: (slug: string) =>
    trackEvent('json_download', { merchant_slug: slug }),
};
