#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface ValidationError {
  file: string;
  errors: string[];
}

interface Merchant {
  slug: string;
  name: string;
  url: string;
  description: string;
  logo: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  categories: string[];
  tags: string[];
  ucpProfile: {
    version: string;
    wellKnownUrl: string;
    capabilities: Array<{
      name: string;
      version: string;
      extends?: string;
      spec: string;
      schema: string;
    }>;
    services?: Record<string, any>;
    paymentHandlers?: Array<{
      name: string;
      version: string;
      providers: string[];
    }>;
  };
  metadata: {
    submittedAt: string;
    submittedBy: string;
    verified: boolean;
    featured: boolean;
  };
}

interface DirectoryMetadata {
  totalMerchants: number;
  categories: Array<{ name: string; count: number }>;
  capabilities: Array<{ name: string; displayName: string; count: number }>;
  paymentProviders: Array<{ name: string; count: number }>;
  generatedAt: string;
}

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

const MERCHANTS_DIR = path.join(process.cwd(), 'data', 'merchants');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'metadata.json');
const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'filters', 'categories.json');
const CAPABILITIES_FILE = path.join(process.cwd(), 'data', 'filters', 'capabilities.json');
const PAYMENT_METHODS_FILE = path.join(process.cwd(), 'data', 'filters', 'payment-methods.json');

/**
 * Validate a single merchant JSON file
 */
function validateMerchant(
  filePath: string,
  merchant: any,
  allowedCategories: Set<string>
): string[] {
  const errors: string[] = [];
  const fileName = path.basename(filePath);

  // Check JSON syntax (already parsed, so check for required fields)
  if (typeof merchant !== 'object' || merchant === null) {
    errors.push('Invalid JSON structure');
    return errors;
  }

  // Required fields
  if (!merchant.slug || typeof merchant.slug !== 'string') {
    errors.push('Missing or invalid required field: slug');
  }
  if (!merchant.name || typeof merchant.name !== 'string') {
    errors.push('Missing or invalid required field: name');
  }
  if (!merchant.url || typeof merchant.url !== 'string') {
    errors.push('Missing or invalid required field: url');
  }
  if (!merchant.description || typeof merchant.description !== 'string') {
    errors.push('Missing or invalid required field: description');
  }
  if (merchant.description && merchant.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  // Logo validation
  if (!merchant.logo || typeof merchant.logo !== 'object') {
    errors.push('Missing or invalid required field: logo');
  } else {
    if (!merchant.logo.url || typeof merchant.logo.url !== 'string') {
      errors.push('Missing or invalid required field: logo.url');
    } else if (!merchant.logo.url.startsWith('https://')) {
      errors.push('logo.url must be HTTPS');
    }
  }

  // Categories validation
  if (!Array.isArray(merchant.categories) || merchant.categories.length === 0) {
    errors.push('categories must be a non-empty array');
  } else {
    merchant.categories.forEach((cat: any, idx: number) => {
      if (typeof cat !== 'string') {
        errors.push(`categories[${idx}] must be a string`);
      } else if (cat !== cat.toLowerCase()) {
        errors.push(`categories[${idx}] must be lowercase: "${cat}"`);
      } else if (!allowedCategories.has(cat)) {
        errors.push(`categories[${idx}] is not a valid category: "${cat}"`);
      }
    });
  }

  // Tags validation (optional but if present must be lowercase)
  if (merchant.tags && Array.isArray(merchant.tags)) {
    merchant.tags.forEach((tag: any, idx: number) => {
      if (typeof tag === 'string' && tag !== tag.toLowerCase()) {
        errors.push(`tags[${idx}] must be lowercase: "${tag}"`);
      }
    });
  }

  // UCP Profile validation
  if (!merchant.ucpProfile || typeof merchant.ucpProfile !== 'object') {
    errors.push('Missing or invalid required field: ucpProfile');
  } else {
    if (!merchant.ucpProfile.wellKnownUrl || typeof merchant.ucpProfile.wellKnownUrl !== 'string') {
      errors.push('Missing or invalid field: ucpProfile.wellKnownUrl');
    } else if (!merchant.ucpProfile.wellKnownUrl.startsWith('https://')) {
      errors.push('ucpProfile.wellKnownUrl must be HTTPS');
    }

    if (!Array.isArray(merchant.ucpProfile.capabilities) || merchant.ucpProfile.capabilities.length === 0) {
      errors.push('ucpProfile.capabilities must be a non-empty array');
    }
  }

  // Metadata validation
  if (!merchant.metadata || typeof merchant.metadata !== 'object') {
    errors.push('Missing or invalid required field: metadata');
  }

  // URL validation
  if (merchant.url && !merchant.url.startsWith('https://')) {
    errors.push('url must be HTTPS');
  }

  // Slug matches filename
  const expectedSlug = fileName.replace('.json', '');
  if (merchant.slug !== expectedSlug) {
    errors.push(
      `Slug mismatch: filename "${fileName}" but slug is "${merchant.slug}"`
    );
  }

  return errors;
}

/**
 * Get display name for a capability from the capabilities data
 */
function getCapabilityDisplayName(
  capabilityName: string,
  capabilitiesMap: Map<string, Capability>
): string {
  const capability = capabilitiesMap.get(capabilityName);
  if (capability) {
    return capability.displayName;
  }

  // Fallback: generate display name if not found in data
  const parts = capabilityName.split('.');
  const lastPart = parts[parts.length - 1];
  return lastPart
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main generation function
 */
async function generate() {
  console.log('📂 Loading filter data...\n');

  // Load filter data
  const categoriesData: Category[] = JSON.parse(
    fs.readFileSync(CATEGORIES_FILE, 'utf-8')
  );
  const capabilitiesData: Capability[] = JSON.parse(
    fs.readFileSync(CAPABILITIES_FILE, 'utf-8')
  );

  // Create lookup sets/maps
  const allowedCategories = new Set(categoriesData.map((c) => c.slug));
  const capabilitiesMap = new Map(
    capabilitiesData.map((c) => [c.name, c])
  );

  console.log(`✅ Loaded ${categoriesData.length} categories`);
  console.log(`✅ Loaded ${capabilitiesData.length} capabilities\n`);

  console.log('🔍 Validating merchants...\n');

  const validationErrors: ValidationError[] = [];
  const validMerchants: Merchant[] = [];
  const slugs = new Set<string>();

  // Read all merchant files
  const files = fs.readdirSync(MERCHANTS_DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(MERCHANTS_DIR, file);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const merchant = JSON.parse(content);

      // Validate merchant
      const errors = validateMerchant(filePath, merchant, allowedCategories);

      // Check for duplicate slugs
      if (slugs.has(merchant.slug)) {
        errors.push(`Duplicate slug: "${merchant.slug}" already exists`);
      } else {
        slugs.add(merchant.slug);
      }

      if (errors.length > 0) {
        validationErrors.push({ file, errors });
        console.log(`❌ data/merchants/${file}`);
        errors.forEach((err) => console.log(`   - ${err}`));
      } else {
        validMerchants.push(merchant);
        console.log(`✅ data/merchants/${file}`);
      }
    } catch (error) {
      validationErrors.push({
        file,
        errors: [`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`],
      });
      console.log(`❌ data/merchants/${file}`);
      console.log(`   - Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('');

  // Exit if there are validation errors
  if (validationErrors.length > 0) {
    console.log(`\n❌ Summary: ${validMerchants.length} valid, ${validationErrors.length} invalid`);
    process.exit(1);
  }

  // Generate metadata
  console.log('📊 Generating metadata...\n');

  const categoryMap = new Map<string, number>();
  const capabilityMap = new Map<string, number>();
  const paymentProviderMap = new Map<string, number>();

  for (const merchant of validMerchants) {
    // Count categories
    merchant.categories.forEach((category) => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    // Count capabilities
    merchant.ucpProfile.capabilities.forEach((capability) => {
      capabilityMap.set(capability.name, (capabilityMap.get(capability.name) || 0) + 1);
    });

    // Count payment providers
    if (merchant.ucpProfile.paymentHandlers) {
      merchant.ucpProfile.paymentHandlers.forEach((handler) => {
        handler.providers.forEach((provider) => {
          paymentProviderMap.set(provider, (paymentProviderMap.get(provider) || 0) + 1);
        });
      });
    }
  }

  // Sort and format metadata
  const metadata: DirectoryMetadata = {
    totalMerchants: validMerchants.length,
    categories: Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    capabilities: Array.from(capabilityMap.entries())
      .map(([name, count]) => ({
        name,
        displayName: getCapabilityDisplayName(name, capabilitiesMap),
        count,
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    paymentProviders: Array.from(paymentProviderMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    generatedAt: new Date().toISOString(),
  };

  // Write metadata file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));

  console.log('✅ Generated metadata.json');
  console.log(`   - ${metadata.totalMerchants} merchants`);
  console.log(`   - ${metadata.categories.length} categories`);
  console.log(`   - ${metadata.capabilities.length} capabilities`);
  console.log(`   - ${metadata.paymentProviders.length} payment providers`);
  console.log('');
  console.log(`✅ Summary: ${validMerchants.length} merchants validated`);
}

// Run the generator
generate().catch((error) => {
  console.error('❌ Generation failed:', error);
  process.exit(1);
});
