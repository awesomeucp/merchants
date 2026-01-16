import { notFound } from 'next/navigation';
import { getAllMerchants, getMerchantBySlug } from '@/lib/data/merchants';
import { MerchantHero } from '@/components/detail/MerchantHero';
import { CapabilityList } from '@/components/detail/CapabilityList';
import { ServiceEndpoints } from '@/components/detail/ServiceEndpoints';
import { PaymentHandlers } from '@/components/detail/PaymentHandlers';
import { IntegrationGuide } from '@/components/detail/IntegrationGuide';
import { UCPProfileViewer } from '@/components/detail/UCPProfileViewer';
import type { Metadata } from 'next';

interface MerchantDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const merchants = getAllMerchants();
  return merchants.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: MerchantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);

  if (!merchant) {
    return {
      title: 'Merchant Not Found',
    };
  }

  return {
    title: `${merchant.name} | UCP Merchant Directory`,
    description: merchant.description,
    openGraph: {
      title: merchant.name,
      description: merchant.description,
      images: merchant.logo.url ? [merchant.logo.url] : [],
    },
  };
}

export default async function MerchantDetailPage({ params }: MerchantDetailPageProps) {
  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);

  if (!merchant) {
    notFound();
  }

  return (
    <div>
      <MerchantHero merchant={merchant} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <CapabilityList capabilities={merchant.ucpProfile.capabilities} />
            <ServiceEndpoints services={merchant.ucpProfile.services} />
            <IntegrationGuide merchant={merchant} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <PaymentHandlers handlers={merchant.ucpProfile.paymentHandlers} />
            <UCPProfileViewer profile={merchant.ucpProfile} />
          </aside>
        </div>
      </div>
    </div>
  );
}
