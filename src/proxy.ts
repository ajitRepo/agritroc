import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Handle CORS for all API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // If it's an OPTIONS preflight request, respond with 200 OK and CORS headers immediately
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept'
      )
      response.headers.set('Access-Control-Max-Age', '86400')
      return response
    }

    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept'
    )
    return response
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: '/api/:path*',
}
