// Core merchant interfaces for UCP Merchant Directory

export interface MerchantLogo {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface UCPCapability {
  name: string; // e.g., "dev.ucp.shopping.checkout"
  version: string; // YYYY-MM-DD format
  spec: string; // URL to spec
  schema: string; // URL to JSON schema
  extends?: string; // For extensions
}

export interface UCPServiceRest {
  endpoint: string;
  schema: string;
}

export interface UCPServiceMCP {
  endpoint: string;
  schema: string;
}

export interface UCPA2A {
  endpoint: string;
}

export interface UCPService {
  version: string;
  spec: string;
  rest?: UCPServiceRest;
  mcp?: UCPServiceMCP;
  a2a?: UCPA2A;
}

export interface PaymentHandler {
  name: string; // e.g., "dev.ucp.delegate_payment"
  version: string;
  providers: string[]; // ["Google Pay", "Apple Pay", "Stripe"]
}

export interface UCPProfile {
  version: string;
  wellKnownUrl: string;
  capabilities: UCPCapability[];
  services: Record<string, UCPService>;
  paymentHandlers: PaymentHandler[];
}

export interface MerchantMetadata {
  submittedAt: string;
  submittedBy: string;
  verified: boolean;
  featured: boolean;
}

export interface Merchant {
  slug: string; // URL-safe identifier
  name: string;
  url: string;
  description: string;
  logo: MerchantLogo;
  categories: string[]; // ["fashion", "electronics"]
  tags: string[]; // ["sustainable", "fast-shipping"]
  ucpProfile: UCPProfile;
  metadata: MerchantMetadata;
}

// Filter and search types
export interface FilterState {
  searchQuery: string;
  categories: string[];
  capabilities: string[];
  paymentProviders: string[];
}

// Aggregated data for filter UI
export interface DirectoryMetadata {
  totalMerchants: number;
  categories: CategoryCount[];
  capabilities: CapabilityCount[];
  paymentProviders: PaymentProviderCount[];
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface CapabilityCount {
  name: string;
  displayName: string; // Human-readable: "Checkout" from "dev.ucp.shopping.checkout"
  count: number;
}

export interface PaymentProviderCount {
  name: string;
  count: number;
}
