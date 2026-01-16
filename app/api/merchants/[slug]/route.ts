import { NextResponse } from 'next/server';
import { getMerchantBySlug } from '@/lib/data/merchants';
import { checkRateLimit } from '@/lib/utils/rate-limiter';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  // Check rate limit
  const rateLimit = checkRateLimit(request);

  if (rateLimit.limited) {
    const response = NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
      },
      { status: 429 }
    );

    response.headers.set('X-RateLimit-Limit', '20');
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));
    response.headers.set('Retry-After', String(rateLimit.reset));
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  }

  const { slug } = await params;
  const merchant = getMerchantBySlug(slug);

  if (!merchant) {
    const response = NextResponse.json(
      { error: 'Merchant not found' },
      { status: 404 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }

  const response = NextResponse.json(merchant);

  // Add CORS headers for public API
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', '20');
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.reset));

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
