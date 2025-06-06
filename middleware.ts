import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Extend NextRequest type to include ip and geo
interface ExtendedNextRequest extends NextRequest {
  ip?: string;
  geo?: {
    country?: string;
  };
}

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  }),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

// List of known bot user agents
const BOT_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'slurp',
  'search',
  'mediapartners',
  'nagios',
  'curl',
  'wget',
  'python-requests',
  'apache-httpclient',
  'java-http-client',
  'ruby',
  'perl',
  'php',
]

// List of allowed countries (ISO codes)
const ALLOWED_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG']

export async function middleware(request: ExtendedNextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Bot detection
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    return new NextResponse('Bot access denied', { status: 403 })
  }

  // Rate limiting
  const ip = request.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)
  
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())

  if (!success) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Geo-blocking
  const country = request.geo?.country
  if (country && !ALLOWED_COUNTRIES.includes(country)) {
    return new NextResponse('Access denied', { status: 403 })
  }

  // CSRF Protection
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const csrfToken = request.headers.get('X-CSRF-Token')
    const sessionToken = request.cookies.get('session-token')?.value

    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
      return new NextResponse('Invalid CSRF token', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 