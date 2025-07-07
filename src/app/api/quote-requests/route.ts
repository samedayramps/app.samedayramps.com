import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { configUtils } from '@/lib/config';
import { TimelineType, ServiceType } from '@prisma/client';

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('📝 Quote request received:', data);

    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceAddress,
      rampHeight,
      timeline,
      notes,
      source = 'website',
      priority = 'normal'
    } = data;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !serviceAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, customerPhone, serviceAddress' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Start a transaction to create customer, address, and quote
    const result = await db.$transaction(async (prisma) => {
      // 1. Create or find customer
      let customer = await prisma.customer.findFirst({
        where: {
          OR: [
            { email: customerEmail },
            { phone: customerPhone }
          ]
        }
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          }
        });
        console.log('👤 Created new customer:', customer.id);
      } else {
        console.log('👤 Found existing customer:', customer.id);
      }

      // 2. Create service address
      const serviceAddressRecord = await prisma.address.create({
        data: {
          street: serviceAddress,
          city: 'Dallas', // Default to Dallas, will be updated during consultation
          state: 'TX',
          zipCode: '75000', // Default, will be updated during consultation
          country: 'US',
          customerId: customer.id,
        }
      });
      console.log('📍 Created service address:', serviceAddressRecord.id);

      // 3. Calculate pricing if ramp height is provided
      let monthlyRate = 125; // Default base rate
      let installationFee = 75; // Default installation fee

      if (rampHeight && parseInt(rampHeight) > 0) {
        const heightInches = parseInt(rampHeight);
        const pricing = await configUtils.calculatePricing(heightInches);
        monthlyRate = pricing.monthlyRate;
        installationFee = pricing.installationFee;
      }

      // 4. Map timeline to enum value
      const timelineMapping: Record<string, TimelineType> = {
        'asap': TimelineType.ASAP,
        'within-3-days': TimelineType.WITHIN_3_DAYS,
        'within-1-week': TimelineType.WITHIN_1_WEEK,
        'flexible': TimelineType.FLEXIBLE,
      };

      const timelineNeeded = timelineMapping[timeline] || TimelineType.FLEXIBLE;

      // 5. Determine service type based on timeline and notes
      let serviceType: ServiceType = ServiceType.AGING_IN_PLACE; // Default
      if (timeline === 'asap' || notes?.toLowerCase().includes('hospital') || notes?.toLowerCase().includes('surgery')) {
        serviceType = ServiceType.POST_SURGERY;
      } else if (notes?.toLowerCase().includes('hospice') || notes?.toLowerCase().includes('transitional')) {
        serviceType = ServiceType.TRANSITIONAL_HOSPICE;
      }

      // 6. Create quote
      const quote = await prisma.quote.create({
        data: {
          customerId: customer.id,
          serviceAddressId: serviceAddressRecord.id,
          rampHeight: rampHeight ? parseFloat(rampHeight) : 24, // Default to 24 inches
          timelineNeeded,
          serviceType,
          monthlyRate,
          installationFee,
          estimatedDuration: rampHeight && parseInt(rampHeight) > 24 ? '2-3 hours' : '1-2 hours',
          notes: notes || `Quote request from ${source}. Timeline: ${timeline}. Priority: ${priority}`,
          status: 'PENDING',
          // Set expiration to 30 days from now
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        include: {
          customer: true,
          serviceAddress: true
        }
      });

      console.log('📋 Created quote:', quote.id);

      return {
        success: true,
        data: {
          quoteId: quote.id,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          monthlyRate,
          installationFee,
          totalFirstMonth: monthlyRate + installationFee,
          timeline: timelineNeeded,
          serviceType,
          estimatedDuration: quote.estimatedDuration,
        },
        message: 'Quote request created successfully. We will contact you within 2 hours.',
      };
    });

    return NextResponse.json(result, { 
      status: 201, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Error creating quote request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create quote request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
}

// GET endpoint to retrieve quote requests (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const email = searchParams.get('email');

    let whereClause = {};
    if (customerId) {
      whereClause = { customerId };
    } else if (email) {
      whereClause = { customer: { email } };
    }

    const quotes = await db.quote.findMany({
      where: whereClause,
      include: {
        customer: true,
        serviceAddress: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    return NextResponse.json(
      { quotes },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Error fetching quote requests:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch quote requests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
} 