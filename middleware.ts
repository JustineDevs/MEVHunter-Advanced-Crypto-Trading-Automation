import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the geo type
type GeoInfo = {
  country?: string;
  city?: string;
  region?: string;
};

// Extend NextRequest type to include ip and geo
type ExtendedNextRequest = NextRequest & {
  ip?: string;
  geo: GeoInfo;
  };

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
  'go-http-client',
  'node-fetch',
  'axios',
  'postman',
]

// List of allowed countries (ISO codes)
const ALLOWED_COUNTRIES = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG', 'KR', 'NL', 'PH']

// List of protected API routes that require authentication
const PROTECTED_ROUTES = [
  '/api/wallet',
  '/api/transactions',
  '/api/balance',
  '/api/trading',
]

export async function middleware(request: ExtendedNextRequest) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  response.headers.set('Content-Security-Policy', `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://*.alchemyapi.io https://*.infura.io https://*.upstash.io wss://*.alchemyapi.io;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim())

  // Bot detection with improved accuracy
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || ''
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot)) ||
    !userAgent || // Empty user agent
    userAgent.includes('mozilla') === false // Not a browser

  if (isBot) {
    return new NextResponse('Access denied', { 
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Bot-Detected': 'true'
      }
    })
  }

  let ratelimit = null;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = await import('@upstash/ratelimit');
    const { Redis } = await import('@upstash/redis');
    ratelimit = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(20, '10 s'),
      analytics: true,
      prefix: 'ratelimit:mevhunter',
    });
  }

  // Rate limiting with improved error handling
  if (ratelimit) {
    try {
      const ip = request.ip ?? '127.0.0.1'
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)
      
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', reset.toString())

      if (!success) {
        return new NextResponse('Too Many Requests', { 
          status: 429,
          headers: {
            'Content-Type': 'text/plain',
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString()
          }
        })
      }
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Continue without rate limiting if there's an error
    }
  }

  // Geo-blocking with improved logging
  // const country = request.geo?.country
  // if (country && !ALLOWED_COUNTRIES.includes(country)) {
  //   console.log(`Blocked access from ${country} (${request.geo?.city}, ${request.geo?.region})`)
  //   return new NextResponse('Access denied', { 
  //     status: 403,
  //     headers: {
  //       'Content-Type': 'text/plain',
  //       'X-Blocked-Country': country
  //     }
  //   })
  // }

  // Enhanced CSRF Protection for protected routes
  if (PROTECTED_ROUTES.some(route => request.nextUrl.pathname.startsWith(route))) {
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const csrfToken = request.headers.get('X-CSRF-Token')
    const sessionToken = request.cookies.get('session-token')?.value

    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
        return new NextResponse('Invalid CSRF token', { 
          status: 403,
          headers: {
            'Content-Type': 'text/plain',
            'X-CSRF-Required': 'true'
          }
        })
    }
    }
  }

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
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
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 