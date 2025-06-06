import { z } from 'zod'
import DOMPurify from 'dompurify'
import { JWT } from 'jose'

// Input validation schemas
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  username: z.string().min(3).max(50),
})

export const tradingSchema = z.object({
  amount: z.number().positive(),
  symbol: z.string().min(2).max(10),
  type: z.enum(['buy', 'sell']),
  price: z.number().positive(),
})

// Input sanitization
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  })
}

// CSRF token generation
export function generateCSRFToken(): string {
  return crypto.randomUUID()
}

// JWT token handling
export async function generateJWT(payload: any): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  return new JWT({ alg: 'HS256' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .setPayload(payload)
    .sign(secret)
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await JWT.verify(token, secret)
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Rate limiting
export class RateLimiter {
  private requests: Map<string, number[]>
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.requests = new Map()
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(ip) || []
    
    // Remove old requests
    const validRequests = userRequests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return true
    }
    
    validRequests.push(now)
    this.requests.set(ip, validRequests)
    return false
  }
}

// File upload validation
export function validateFileUpload(file: File, options: {
  maxSize: number
  allowedTypes: string[]
}): boolean {
  if (file.size > options.maxSize) {
    return false
  }
  
  if (!options.allowedTypes.includes(file.type)) {
    return false
  }
  
  return true
}

// XSS prevention
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// SQL injection prevention
export function sanitizeSQL(input: string): string {
  return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0":
        return "\\0"
      case "\x08":
        return "\\b"
      case "\x09":
        return "\\t"
      case "\x1a":
        return "\\z"
      case "\n":
        return "\\n"
      case "\r":
        return "\\r"
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char
      default:
        return char
    }
  })
}

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://img.icons8.com; connect-src 'self' ws://localhost:8080;",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

// Bot detection
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /slurp/i,
    /search/i,
    /mediapartners/i,
    /nagios/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /apache-httpclient/i,
    /java-http-client/i,
    /ruby/i,
    /perl/i,
    /php/i,
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}

// Geo-blocking
export function isAllowedCountry(country: string): boolean {
  const allowedCountries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'SG']
  return allowedCountries.includes(country)
}

// Activity logging
export class SecurityLogger {
  private logs: any[] = []
  private maxLogs: number = 1000

  log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
    
    this.logs.push(logEntry)
    
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
    
    // In production, you would send this to a logging service
    console.log(JSON.stringify(logEntry))
  }

  getLogs() {
    return this.logs
  }
} 