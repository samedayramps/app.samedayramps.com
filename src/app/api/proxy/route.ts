import { NextRequest, NextResponse } from 'next/server';

// CORS configuration for the proxy
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins for now
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Generic proxy handler for all HTTP methods
async function handleProxyRequest(request: NextRequest, method: string) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get('path');
    
    if (!targetPath) {
      return NextResponse.json(
        { error: 'Missing target path parameter' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Construct the internal API URL
    const internalUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}/api${targetPath}`;
    
    // Get the request body if it exists
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        body = await request.text();
      } catch {
        // No body or invalid body
      }
    }

    // Forward the request to the internal API
    const response = await fetch(internalUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Forward relevant headers
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        }),
      },
      ...(body && { body }),
    });

    // Get the response data
    const responseData = await response.text();
    
    // Return the response with CORS headers
    return new Response(responseData, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Export handlers for all HTTP methods
export async function GET(request: NextRequest) {
  return handleProxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleProxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleProxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleProxyRequest(request, 'DELETE');
}

export async function PATCH(request: NextRequest) {
  return handleProxyRequest(request, 'PATCH');
} 