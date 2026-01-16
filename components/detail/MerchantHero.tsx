'use client';

import { MerchantLogo } from '@/components/merchants/MerchantLogo';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Star, ArrowSquareOut, Tag, Hash } from '@phosphor-icons/react';
import type { Merchant } from '@/lib/types/merchant';

interface MerchantHeroProps {
  merchant: Merchant;
}

export function MerchantHero({ merchant }: MerchantHeroProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <MerchantLogo logo={merchant.logo} name={merchant.name} size="xl" />

          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
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

            <a
              href={merchant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-flex items-center gap-1.5 group"
            >
              <span>{merchant.url}</span>
              <ArrowSquareOut size={16} weight="regular" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
              {merchant.description}
            </p>

            <div className="space-y-3">
              {merchant.categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Tag size={14} weight="duotone" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Hash size={14} weight="duotone" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
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
