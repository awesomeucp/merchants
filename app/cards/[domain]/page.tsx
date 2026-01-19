import { notFound } from 'next/navigation';
import { UCPCard } from '@/components/cards/UCPCard';
import type { UCPDiscoveryProfile } from '@/lib/types/ucp-profile';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ domain: string }>;
}

async function fetchUCPProfile(domain: string): Promise<UCPDiscoveryProfile | null> {
  try {
    // Decode domain (handles URL encoding like www.korendy.com.tr)
    const decodedDomain = decodeURIComponent(domain);

    // Try with www prefix first, then without
    const urls = [
      `https://${decodedDomain}/.well-known/ucp`,
      `https://www.${decodedDomain}/.well-known/ucp`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          next: { revalidate: 3600 }, // Cache for 1 hour
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data as UCPDiscoveryProfile;
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);
  const profile = await fetchUCPProfile(domain);

  const merchantName = profile?.payment?.handlers?.[0]?.config?.merchant_info?.merchant_name || decodedDomain;

  return {
    title: `${merchantName} - UCP Card`,
    description: `Universal Commerce Protocol card for ${merchantName}. View capabilities, payment methods, and services.`,
    openGraph: {
      title: `${merchantName} - UCP Enabled`,
      description: `${merchantName} supports Universal Commerce Protocol with checkout, fulfillment, and payment capabilities.`,
    },
  };
}

export default async function UCPCardPage({ params }: PageProps) {
  const { domain } = await params;
  const decodedDomain = decodeURIComponent(domain);
  const profile = await fetchUCPProfile(domain);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] dark:bg-zinc-950 py-16 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-[0.08] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #A8B89F 1px, transparent 0)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Blobs */}
      <div className="fixed -top-[15%] -left-[15%] w-[900px] h-[900px] bg-[#A8B89F] dark:bg-emerald-900 rounded-full blur-[140px] opacity-20 dark:opacity-10 z-0" />
      <div className="fixed -bottom-[15%] -right-[15%] w-[700px] h-[700px] bg-[#E6BAA3] dark:bg-amber-900 rounded-full blur-[140px] opacity-20 dark:opacity-10 z-0" />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <UCPCard domain={decodedDomain} profile={profile} />
      </div>
    </div>
  );
}
