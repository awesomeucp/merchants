'use client';

import { useEffect } from 'react';
import { MerchantLogo } from '@/components/merchants/MerchantLogo';
import { Badge } from '@/components/ui/Badge';
import { analytics } from '@/lib/utils/analytics';
import { CheckCircle, Star, ArrowSquareOut, Tag, Hash, IdentificationCard } from '@phosphor-icons/react';
import Link from 'next/link';
import type { Merchant } from '@/lib/types/merchant';

interface MerchantHeroProps {
  merchant: Merchant;
}

function getMerchantUrlWithUtm(url: string, slug: string): string {
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm_source', 'ucp-directory');
  urlObj.searchParams.set('utm_medium', 'referral');
  urlObj.searchParams.set('utm_campaign', slug);
  return urlObj.toString();
}

function getDomainFromUrl(url: string): string {
  const urlObj = new URL(url);
  return urlObj.hostname.replace(/^www\./, '');
}

export function MerchantHero({ merchant }: MerchantHeroProps) {
  // Track merchant view on mount
  useEffect(() => {
    analytics.merchantView(merchant.slug, merchant.name);
  }, [merchant.slug, merchant.name]);

  const handleExternalLinkClick = () => {
    analytics.outboundClick(merchant.url, merchant.slug);
  };

  return (
    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="shrink-0">
            <MerchantLogo logo={merchant.logo} name={merchant.name} size="xl" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 sm:gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {merchant.name}
              </h1>
              {merchant.metadata.verified && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle size={14} weight="fill" />
                  Verified
                </Badge>
              )}
              {merchant.metadata.featured && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star size={14} weight="fill" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3">
              <a
                href={getMerchantUrlWithUtm(merchant.url, merchant.slug)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                <span>Visit Store</span>
                <ArrowSquareOut size={18} weight="bold" />
              </a>
              <Link
                href={`/badges/${getDomainFromUrl(merchant.url)}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                <span>View Badge</span>
                <IdentificationCard size={18} weight="bold" />
              </Link>
            </div>

            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed mt-4">
              {merchant.description}
            </p>

            <div className="space-y-4">
              {merchant.categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                    <Tag size={14} weight="duotone" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {merchant.categories.map(category => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {merchant.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                    <Hash size={14} weight="duotone" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {merchant.tags.map(tag => (
                      <Badge key={tag} variant="default">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
