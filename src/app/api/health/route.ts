import { NextResponse } from 'next/server';

// CORS configuration for health check
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

// Health check endpoint
export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: 'Same Day Ramps Admin API',
    version: '1.0.0',
    cors: {
      enabled: true,
      allowedOrigins: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: corsHeaders,
  });
} 