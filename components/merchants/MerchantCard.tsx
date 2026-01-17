'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MerchantLogo } from './MerchantLogo';
import { truncateText } from '@/lib/utils/format';
import { analytics } from '@/lib/utils/analytics';
import { CheckCircle, Lightning, CreditCard } from '@phosphor-icons/react';
import type { Merchant } from '@/lib/types/merchant';

interface MerchantCardProps {
  merchant: Merchant;
}

export function MerchantCard({ merchant }: MerchantCardProps) {
  const capabilityCount = merchant.ucpProfile.capabilities.length;
  const paymentProviders = merchant.ucpProfile.paymentHandlers
    .flatMap(h => h.providers)
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleClick = () => {
    analytics.merchantClick(merchant.slug, merchant.name);
  };

  return (
    <Link href={`/merchants/${merchant.slug}`} onClick={handleClick}>
      <Card hover className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <MerchantLogo logo={merchant.logo} name={merchant.name} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 mb-1 truncate">
              {merchant.name}
            </h3>
            {merchant.metadata.verified && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit">
                <CheckCircle size={12} weight="fill" />
                Verified
              </Badge>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 sm:mb-4 flex-1 line-clamp-3">
          {truncateText(merchant.description, 150)}
        </p>

        <div className="space-y-2 sm:space-y-3">
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {merchant.categories.slice(0, 2).map(category => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {merchant.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{merchant.categories.length - 2}
              </Badge>
            )}
          </div>

          {/* Capabilities and Payment Info */}
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 gap-2">
            <span className="flex items-center gap-1">
              <Lightning size={14} weight="fill" className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">{capabilityCount} capabilities</span>
            </span>
            <span className="flex items-center gap-1">
              <CreditCard size={14} weight="regular" className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="truncate">{paymentProviders.length} payments</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
