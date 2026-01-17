import { MerchantCard } from './MerchantCard';
import type { Merchant } from '@/lib/types/merchant';

interface MerchantGridProps {
  merchants: Merchant[];
}

export function MerchantGrid({ merchants }: MerchantGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {merchants.map(merchant => (
        <MerchantCard key={merchant.slug} merchant={merchant} />
      ))}
    </div>
  );
}
