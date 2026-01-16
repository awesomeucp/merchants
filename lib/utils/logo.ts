const LOGO_DEV_TOKEN = 'live_6a1a28fd-6420-4492-aeb0-b297461d9de2';

/**
 * Injects the Logo.dev API token into logo URLs at runtime
 * @param url - The logo URL from merchant data
 * @returns The URL with token parameter injected if applicable
 */
export function injectLogoToken(url: string): string {
  if (!url) return url;

  // Only inject token for img.logo.dev URLs
  if (!url.includes('img.logo.dev')) {
    return url;
  }

  // Don't inject if token already exists
  if (url.includes('token=')) {
    return url;
  }

  // Parse URL to handle query parameters properly
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('token', LOGO_DEV_TOKEN);
    return urlObj.toString();
  } catch {
    // Fallback if URL parsing fails
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}token=${LOGO_DEV_TOKEN}`;
  }
}
