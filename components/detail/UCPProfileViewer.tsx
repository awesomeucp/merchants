'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { UCPProfile } from '@/lib/types/merchant';

interface UCPProfileViewerProps {
  profile: UCPProfile;
}

export function UCPProfileViewer({ profile }: UCPProfileViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(profile, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          UCP Profile
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <a
              href={profile.wellKnownUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Live Profile →
            </a>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
            >
              {copied ? 'Copied!' : 'Copy JSON'}
            </button>
          </div>
          <pre className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 overflow-x-auto text-xs">
            <code className="text-zinc-800 dark:text-zinc-200">
              {jsonString}
            </code>
          </pre>
        </div>
      )}

      {!isExpanded && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Click expand to view the complete UCP profile JSON.
        </p>
      )}
    </Card>
  );
}
