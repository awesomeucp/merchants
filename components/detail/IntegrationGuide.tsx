import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import type { Merchant } from '@/lib/types/merchant';

interface IntegrationGuideProps {
  merchant: Merchant;
}

export function IntegrationGuide({ merchant }: IntegrationGuideProps) {
  const restEndpoint = merchant.ucpProfile.services['dev.ucp.shopping']?.rest?.endpoint;

  const fetchProfileExample = `# Fetch UCP Discovery Profile
curl ${merchant.ucpProfile.wellKnownUrl}`;

  const checkoutExample = restEndpoint
    ? `# Create a checkout session
curl -X POST ${restEndpoint}/checkout-sessions \\
  -H "Content-Type: application/json" \\
  -H "UCP-Agent: profile=\\"https://your-agent.com/profile\\"" \\
  -d '{
    "line_items": [
      {
        "id": "item-123",
        "name": "Example Product",
        "quantity": 1,
        "price": {
          "value": 2999,
          "currency": "USD"
        }
      }
    ]
  }'`
    : '# No REST endpoint configured';

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        Integration Guide
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Step 1: Fetch UCP Profile
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            Start by fetching the merchant's UCP discovery profile to understand
            their capabilities and endpoints.
          </p>
          <CodeBlock code={fetchProfileExample} />
        </div>

        {restEndpoint && (
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Step 2: Create Checkout Session
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              Use the REST API to create a checkout session with line items.
            </p>
            <CodeBlock code={checkoutExample} />
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Learn More
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            For complete documentation on integrating with UCP merchants, visit the{' '}
            <a
              href="https://ucp.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              official UCP documentation
            </a>
            .
          </p>
        </div>
      </div>
    </Card>
  );
}
