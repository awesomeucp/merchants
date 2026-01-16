import { Card } from '@/components/ui/Card';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { MerchantForm } from '@/components/submit/MerchantForm';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Submit Your Merchant | UCP Merchant Directory',
  description: 'Learn how to add your UCP-enabled store to the merchant directory.',
};

interface Category {
  slug: string;
  name: string;
  description: string;
}

interface Capability {
  name: string;
  displayName: string;
  description: string;
}

interface PaymentMethod {
  name: string;
  slug: string;
  description: string;
}

function loadFilterData() {
  const categoriesPath = path.join(process.cwd(), 'data', 'filters', 'categories.json');
  const capabilitiesPath = path.join(process.cwd(), 'data', 'filters', 'capabilities.json');
  const paymentMethodsPath = path.join(process.cwd(), 'data', 'filters', 'payment-methods.json');

  const categories: Category[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const capabilities: Capability[] = JSON.parse(fs.readFileSync(capabilitiesPath, 'utf-8'));
  const paymentMethods: PaymentMethod[] = JSON.parse(fs.readFileSync(paymentMethodsPath, 'utf-8'));

  return { categories, capabilities, paymentMethods };
}

export default function SubmitPage() {
  const { categories, capabilities, paymentMethods } = loadFilterData();

  const exampleMerchant = `{
  "slug": "your-store",
  "name": "Your Store Name",
  "url": "https://yourstore.com",
  "description": "Brief description of your store and what you sell",
  "logo": {
    "url": "https://yourstore.com/logo.png",
    "width": 400,
    "height": 400,
    "alt": "Your Store Logo"
  },
  "categories": ["electronics", "gadgets"],
  "tags": ["fast-shipping", "warranty", "tech-support"],
  "ucpProfile": {
    "version": "2026-01-11",
    "wellKnownUrl": "https://yourstore.com/.well-known/ucp",
    "capabilities": [
      {
        "name": "dev.ucp.shopping.checkout",
        "version": "2026-01-11",
        "spec": "https://ucp.dev/specification/checkout",
        "schema": "https://ucp.dev/schemas/shopping/checkout.json"
      }
    ],
    "services": {
      "dev.ucp.shopping": {
        "version": "2026-01-11",
        "spec": "https://ucp.dev/specification/shopping",
        "rest": {
          "endpoint": "https://api.yourstore.com/ucp/v1",
          "schema": "https://api.yourstore.com/ucp/v1/openapi.json"
        }
      }
    },
    "paymentHandlers": [
      {
        "name": "dev.ucp.delegate_payment",
        "version": "2026-01-11",
        "providers": ["Google Pay", "Apple Pay"]
      }
    ]
  },
  "metadata": {
    "submittedAt": "2026-01-16T12:00:00Z",
    "submittedBy": "your-github-username",
    "verified": false,
    "featured": false
  }
}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-zinc-100">
            Submit Your Merchant
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Add your UCP-enabled store to the directory and make it discoverable
            to AI shopping agents worldwide.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Prerequisites */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Prerequisites
            </h2>
            <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>
                  Your store must implement the{' '}
                  <a
                    href="https://ucp.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Universal Commerce Protocol (UCP)
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>
                  You must have a live UCP discovery profile at{' '}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-sm">
                    /.well-known/ucp
                  </code>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400">✓</span>
                <span>You must be authorized to represent the merchant</span>
              </li>
            </ul>
          </Card>
          </div>

          {/* Interactive Form */}
          <div>
            <div className="max-w-4xl mx-auto mb-6">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Generate Your Merchant JSON
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Fill out the form below to automatically generate your merchant JSON file.
                No coding required!
              </p>
            </div>
            <MerchantForm
              categories={categories}
              capabilities={capabilities}
              paymentMethods={paymentMethods}
            />
          </div>

          {/* Manual Submission Steps */}
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12 mt-12">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Manual Submission (Alternative)
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                Prefer to create the JSON manually? Follow these steps:
              </p>
            </div>
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              Submission Steps
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    1
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Fork the Repository
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 ml-11 mb-3">
                  Fork the UCP Merchants repository on GitHub to your account.
                </p>
                <div className="ml-11">
                  <CodeBlock code="git clone https://github.com/awesomeucp/merchants.git" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    2
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Create Your Merchant JSON
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 ml-11 mb-3">
                  Create a new JSON file in the{' '}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-sm">
                    data/merchants/
                  </code>{' '}
                  directory. The filename must match your slug (e.g.,{' '}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-sm">
                    your-store.json
                  </code>
                  ).
                </p>
                <div className="ml-11">
                  <CodeBlock code={exampleMerchant} language="json" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    3
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Submit Pull Request
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 ml-11 mb-3">
                  Create a branch and submit a pull request with your merchant JSON file.
                </p>
                <div className="ml-11">
                  <CodeBlock
                    code={`git checkout -b add-merchant/your-store
git add data/merchants/your-store.json
git commit -m "Add Your Store to merchant directory"
git push origin add-merchant/your-store`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    4
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    Wait for Review
                  </h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 ml-11">
                  Our team will review your submission and verify your UCP implementation.
                  Once approved, your merchant will appear in the directory.
                </p>
              </div>
            </div>
          </Card>

          {/* JSON Schema Reference */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Field Reference
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  slug
                </code>
                <span className="text-red-600 ml-2">*required</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  URL-safe identifier (lowercase, hyphens only). Must match filename.
                </p>
              </div>
              <div>
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  name
                </code>
                <span className="text-red-600 ml-2">*required</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  Your store's display name.
                </p>
              </div>
              <div>
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  url
                </code>
                <span className="text-red-600 ml-2">*required</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  Your store's homepage URL (HTTPS only).
                </p>
              </div>
              <div>
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-semibold">
                  ucpProfile.wellKnownUrl
                </code>
                <span className="text-red-600 ml-2">*required</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  URL to your UCP discovery profile (typically{' '}
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-xs">
                    https://yourstore.com/.well-known/ucp
                  </code>
                  ).
                </p>
              </div>
            </div>
          </Card>

          {/* Help */}
          <Card className="p-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Need Help?
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              If you have questions about the submission process or implementing UCP:
            </p>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>
                📚 Read the{' '}
                <a
                  href="https://ucp.dev/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  UCP Documentation
                </a>
              </li>
              <li>
                💬 Join the{' '}
                <a
                  href="https://github.com/awesomeucp/merchants/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  GitHub Discussions
                </a>
              </li>
              <li>
                🐛 Report an{' '}
                <a
                  href="https://github.com/awesomeucp/merchants/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  Issue
                </a>
              </li>
            </ul>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
