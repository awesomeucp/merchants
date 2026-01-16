import { Storefront } from '@phosphor-icons/react';

interface MerchantStatsProps {
  total: number;
  totalMerchants: number;
}

export function MerchantStats({ total, totalMerchants }: MerchantStatsProps) {
  return (
    <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
      <Storefront size={16} weight="duotone" className="text-blue-600 dark:text-blue-400" />
      {total === totalMerchants ? (
        <span>Showing all {totalMerchants} merchants</span>
      ) : (
        <span>
          Showing {total} of {totalMerchants} merchants
        </span>
      )}
    </div>
  );
}
