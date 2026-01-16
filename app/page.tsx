import { getAllMerchants, getDirectoryMetadata } from '@/lib/data/merchants';
import { BrowsePage } from '@/components/pages/BrowsePage';

export default function Home() {
  const merchants = getAllMerchants();
  const metadata = getDirectoryMetadata();

  return <BrowsePage merchants={merchants} metadata={metadata} />;
}
