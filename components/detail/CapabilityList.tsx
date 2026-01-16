'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCapabilityName } from '@/lib/utils/format';
import { Lightning, ArrowSquareOut, FlowArrow } from '@phosphor-icons/react';
import type { UCPCapability } from '@/lib/types/merchant';

interface CapabilityListProps {
  capabilities: UCPCapability[];
}

export function CapabilityList({ capabilities }: CapabilityListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightning size={24} weight="duotone" className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          UCP Capabilities
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {capabilities.length}
        </Badge>
      </div>
      <div className="space-y-3">
        {capabilities.map(capability => (
          <div
            key={capability.name}
            className="group relative bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400 group-hover:w-1.5 transition-all" />
            <div className="pl-4 pr-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightning size={16} weight="fill" className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatCapabilityName(capability.name)}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-950 px-2 py-1 rounded inline-block">
                    {capability.name}
                  </p>
                  {capability.extends && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                      <FlowArrow size={14} weight="regular" />
                      <span>Extends:</span>
                      <span className="font-medium">{formatCapabilityName(capability.extends)}</span>
                    </div>
                  )}
                </div>
                <a
                  href={capability.spec}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap group/link"
                >
                  <span>View Spec</span>
                  <ArrowSquareOut size={16} weight="regular" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
