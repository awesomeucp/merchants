'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, CheckCircle, Wallet } from '@phosphor-icons/react';
import type { PaymentHandler } from '@/lib/types/merchant';

interface PaymentHandlersProps {
  handlers: PaymentHandler[];
}

export function PaymentHandlers({ handlers }: PaymentHandlersProps) {
  // Get unique providers
  const allProviders = handlers
    .flatMap(h => h.providers)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={24} weight="duotone" className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Payment Methods
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {allProviders.length}
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} weight="duotone" className="text-green-600 dark:text-green-400" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Supported Providers
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allProviders.map(provider => (
              <Badge key={provider} variant="secondary" className="flex items-center gap-1.5">
                <CreditCard size={14} weight="fill" />
                {provider}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={18} weight="duotone" className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Payment Handlers
            </h3>
          </div>
          <div className="space-y-2">
            {handlers.map(handler => (
              <div
                key={handler.name}
                className="group bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CreditCard size={18} weight="regular" className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                      {handler.name}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {handler.providers.map(provider => (
                        <span
                          key={provider}
                          className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 px-2 py-0.5 rounded"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
