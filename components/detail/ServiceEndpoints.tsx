'use client';

import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Badge } from '@/components/ui/Badge';
import { Globe, Plugs, ArrowsLeftRight, ArrowSquareOut, FileCode } from '@phosphor-icons/react';
import type { UCPService } from '@/lib/types/merchant';

interface ServiceEndpointsProps {
  services: Record<string, UCPService>;
}

export function ServiceEndpoints({ services }: ServiceEndpointsProps) {
  const serviceCount = Object.keys(services).length;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe size={24} weight="duotone" className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Service Endpoints
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {serviceCount}
        </Badge>
      </div>
      <div className="space-y-6">
        {Object.entries(services).map(([serviceKey, service]) => (
          <div key={serviceKey} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-4">
              <Plugs size={20} weight="duotone" className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                {serviceKey}
              </h3>
            </div>

            <div className="space-y-4">
              {service.rest && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Globe size={14} weight="fill" />
                      REST API
                    </Badge>
                    <a
                      href={service.rest.schema}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline group/link"
                    >
                      <FileCode size={14} weight="regular" />
                      <span>OpenAPI Schema</span>
                      <ArrowSquareOut size={14} weight="regular" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                  <CodeBlock
                    code={`curl ${service.rest.endpoint}/.well-known/ucp`}
                    language="bash"
                  />
                </div>
              )}

              {service.mcp && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Plugs size={14} weight="fill" />
                      MCP Endpoint
                    </Badge>
                    <a
                      href={service.mcp.schema}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline group/link"
                    >
                      <FileCode size={14} weight="regular" />
                      <span>Schema</span>
                      <ArrowSquareOut size={14} weight="regular" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                  <CodeBlock
                    code={service.mcp.endpoint}
                    language="text"
                  />
                </div>
              )}

              {service.a2a && (
                <div>
                  <Badge variant="secondary" className="flex items-center gap-1 mb-2 w-fit">
                    <ArrowsLeftRight size={14} weight="fill" />
                    A2A Endpoint
                  </Badge>
                  <CodeBlock
                    code={service.a2a.endpoint}
                    language="text"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
