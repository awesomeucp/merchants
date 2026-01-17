'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { analytics } from '@/lib/utils/analytics';

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

interface MerchantFormProps {
  categories: Category[];
  capabilities: Capability[];
  paymentMethods: PaymentMethod[];
}

export function MerchantForm({ categories, capabilities, paymentMethods }: MerchantFormProps) {
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    url: '',
    description: '',
    logoUrl: '',
    selectedCategories: [] as string[],
    tags: '',
    selectedCapabilities: [] as string[],
    selectedPaymentMethods: [] as string[],
    githubUsername: '',
  });

  const [jsonOutput, setJsonOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);

  // Generate JSON whenever form data changes
  useEffect(() => {
    const normalizeUrl = (url: string) => {
      if (!url) return 'https://yourstore.com';
      const trimmed = url.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed.replace('http://', 'https://');
      }
      return `https://${trimmed}`;
    };

    const normalizedUrl = normalizeUrl(formData.url);

    const merchant = {
      slug: formData.slug || 'your-store',
      name: formData.name || 'Your Store Name',
      url: normalizedUrl,
      description: formData.description || 'Brief description of your store',
      logo: {
        url: formData.logoUrl || `https://yourstore.com/logo.png`,
        width: 400,
        height: 400,
        alt: `${formData.name || 'Your Store'} Logo`,
      },
      categories: formData.selectedCategories.length > 0 ? formData.selectedCategories : ['electronics'],
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      ucpProfile: {
        version: '2026-01-11',
        wellKnownUrl: `${normalizedUrl}/.well-known/ucp`,
        capabilities: formData.selectedCapabilities.map(capName => {
          const cap = capabilities.find(c => c.name === capName);
          return {
            name: capName,
            version: '2026-01-11',
            spec: `https://ucp.dev/specification/${cap?.displayName.toLowerCase() || 'checkout'}`,
            schema: `https://ucp.dev/schemas/shopping/${cap?.displayName.toLowerCase() || 'checkout'}.json`,
          };
        }),
        services: {
          'dev.ucp.shopping': {
            version: '2026-01-11',
            spec: 'https://ucp.dev/specs/shopping',
            mcp: {
              endpoint: `${normalizedUrl}/api/ucp/mcp`,
              schema: 'https://ucp.dev/services/shopping/openrpc.json',
            },
          },
        },
        paymentHandlers: formData.selectedPaymentMethods.length > 0
          ? [
              {
                name: 'com.google.pay',
                version: '2026-01-11',
                providers: formData.selectedPaymentMethods,
              },
            ]
          : [],
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        submittedBy: formData.githubUsername || 'your-github-username',
        verified: false,
        featured: false,
      },
    };

    setJsonOutput(JSON.stringify(merchant, null, 2));
  }, [formData, capabilities]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.slug || 'merchant'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    analytics.jsonDownload(formData.slug || 'draft');
  };

  const toggleCategory = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(slug)
        ? prev.selectedCategories.filter(s => s !== slug)
        : [...prev.selectedCategories, slug],
    }));
  };

  const toggleCapability = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCapabilities: prev.selectedCapabilities.includes(name)
        ? prev.selectedCapabilities.filter(n => n !== name)
        : [...prev.selectedCapabilities, name],
    }));
  };

  const togglePaymentMethod = (name: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPaymentMethods: prev.selectedPaymentMethods.includes(name)
        ? prev.selectedPaymentMethods.filter(n => n !== name)
        : [...prev.selectedPaymentMethods, name],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Form Section */}
      <div className="space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Slug <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                placeholder="your-store"
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Lowercase, hyphens only. Must match filename.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Store Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your Store Name"
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Store URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://yourstore.com"
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your store and what you sell"
                rows={3}
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Logo URL <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://yourstore.com/logo.png"
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Direct link to your logo image (PNG, JPG, or SVG)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                GitHub Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.githubUsername}
                onChange={e => setFormData({ ...formData, githubUsername: e.target.value })}
                placeholder="your-github-username"
                className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Categories <span className="text-red-600">*</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {categories.map(category => (
              <button
                key={category.slug}
                type="button"
                onClick={() => toggleCategory(category.slug)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  formData.selectedCategories.includes(category.slug)
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Selected: {formData.selectedCategories.length || 0}
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Tags <span className="text-zinc-500">(optional)</span>
          </h3>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData({ ...formData, tags: e.target.value })}
            placeholder="fast-shipping, warranty, tech-support"
            className="w-full px-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Comma-separated, lowercase with hyphens
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            UCP Capabilities <span className="text-red-600">*</span>
          </h3>
          <div className="space-y-2">
            {capabilities.map(capability => (
              <button
                key={capability.name}
                type="button"
                onClick={() => toggleCapability(capability.name)}
                className={`w-full px-3 sm:px-4 py-3 rounded-lg text-left transition-colors ${
                  formData.selectedCapabilities.includes(capability.name)
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <div className="font-medium text-sm sm:text-base">{capability.displayName}</div>
                <div className="text-xs opacity-75 mt-1 line-clamp-2">{capability.description}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Selected: {formData.selectedCapabilities.length || 0}
          </p>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Payment Methods <span className="text-zinc-500">(optional)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map(method => (
              <button
                key={method.slug}
                type="button"
                onClick={() => togglePaymentMethod(method.name)}
                className={`px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  formData.selectedPaymentMethods.includes(method.name)
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            Selected: {formData.selectedPaymentMethods.length || 0}
          </p>
        </Card>
      </div>

      {/* JSON Preview Section */}
      <div className="lg:sticky lg:top-24 h-fit space-y-4">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowJson(!showJson)}
          className="lg:hidden w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg"
        >
          {showJson ? 'Hide' : 'Show'} Generated JSON
        </button>

        <Card className={`p-4 sm:p-6 ${showJson ? 'block' : 'hidden lg:block'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Generated JSON
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium"
              >
                Download
              </button>
            </div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-3 sm:p-4 overflow-x-auto max-h-[50vh] lg:max-h-[60vh]">
            <pre className="text-xs sm:text-sm text-zinc-100 font-mono whitespace-pre-wrap break-words">
              {jsonOutput}
            </pre>
          </div>
          <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
              Next Steps:
            </p>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Download the JSON file</li>
              <li>Save it as <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">{formData.slug || 'your-store'}.json</code></li>
              <li>Add it to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">data/merchants/</code></li>
              <li>Submit a pull request to the repository</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
