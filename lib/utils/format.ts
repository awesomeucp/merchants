/**
 * Convert capability name from dot notation to human-readable format
 * Example: "dev.ucp.shopping.checkout" → "Checkout"
 * Example: "dev.ucp.shopping.buyer_consent" → "Buyer Consent"
 */
export function formatCapabilityName(name: string): string {
  const parts = name.split('.');
  const last = parts[parts.length - 1];

  // Handle snake_case and convert to Title Case
  return last
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from a name (for logo fallback)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
