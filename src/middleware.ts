import { NextRequest, NextResponse } from 'next/server';

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.samedayramps.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export function middleware(request: NextRequest) {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Handle actual requests
  const response = NextResponse.next();

  // Add CORS headers to all API responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configure middleware to run on API routes
export const config = {
  matcher: '/api/:path*',
} 