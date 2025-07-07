import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { configUtils } from '@/lib/config';
import { TimelineType, ServiceType, QuoteStatus } from '@prisma/client';
import { sendQuoteEmail } from '@/lib/email-service';

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
      source = 'website'
    } = data;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !serviceAddress || !timeline) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, customerPhone, serviceAddress, timeline' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Start database transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Check if customer exists, if not create new one
      let customer = await tx.customer.findFirst({
        where: {
          OR: [
            { email: customerEmail },
            { phone: customerPhone }
          ]
        }
      });

      if (!customer) {
        customer = await tx.customer.create({
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

      // 2. Parse and create service address
      const addressParts = serviceAddress.split(',').map((part: string) => part.trim());
      const street = addressParts[0] || serviceAddress;
      const city = addressParts[1] || 'Unknown';
      const stateZip = addressParts[2] || 'Unknown';
      const [state, zipCode] = stateZip.split(' ');

      const address = await tx.address.create({
        data: {
          street,
          city,
          state: state || 'Unknown',
          zipCode: zipCode || 'Unknown',
          customerId: customer.id,
        }
      });
      console.log('📍 Created service address:', address.id);

      // 3. Determine if we have enough info to calculate pricing
      const hasRampHeight = rampHeight && parseFloat(rampHeight) > 0;
      let pricing = null;
      let quoteStatus: QuoteStatus = 'NEEDS_ASSESSMENT' as QuoteStatus;
      let emailSent = false;

      if (hasRampHeight) {
        // Calculate pricing since we have ramp height
        const height = parseFloat(rampHeight);
        const pricingResult = await configUtils.calculatePricing(height);
        
        pricing = {
          monthlyRate: pricingResult.monthlyRate,
          installationFee: pricingResult.installationFee,
        };
        
        // Set status to PENDING since we can send the quote
        quoteStatus = 'PENDING' as QuoteStatus;
        console.log('💰 Calculated pricing:', pricing);
      } else {
        console.log('📏 No ramp height provided - needs assessment');
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
      let serviceType: ServiceType = 'AGING_IN_PLACE' as ServiceType; // Default
      if (timeline === 'asap' || notes?.toLowerCase().includes('hospital') || notes?.toLowerCase().includes('surgery')) {
        serviceType = 'POST_SURGERY' as ServiceType;
      } else if (notes?.toLowerCase().includes('hospice') || notes?.toLowerCase().includes('transitional')) {
        serviceType = 'TRANSITIONAL_HOSPICE' as ServiceType;
      }

      // 6. Create the quote
      const quote = await tx.quote.create({
        data: {
          customerId: customer.id,
          serviceAddressId: address.id,
          rampHeight: hasRampHeight ? parseFloat(rampHeight) : null,
          timelineNeeded,
          serviceType,
          monthlyRate: pricing?.monthlyRate ?? null,
          installationFee: pricing?.installationFee ?? null,
          estimatedDuration: hasRampHeight ? '1-3 hours' : null,
          status: quoteStatus,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          notes: `${notes || ''}\n\nSource: ${source}${hasRampHeight ? '' : '\n⚠️ Needs assessment - no ramp height provided'}`.trim(),
        }
      });

      // 7. Get the complete quote with relationships
      const fullQuote = await tx.quote.findUnique({
        where: { id: quote.id },
        include: {
          customer: true,
          serviceAddress: true,
        }
      });

      console.log('📋 Created quote:', quote.id);

      // 8. Send email if we have complete pricing
      if (hasRampHeight && pricing && fullQuote) {
        try {
          await sendQuoteEmail(fullQuote);
          emailSent = true;
          
          // Update quote status to SENT
          await tx.quote.update({
            where: { id: quote.id },
            data: {
              status: QuoteStatus.SENT,
              sentAt: new Date(),
            }
          });
          
          console.log('📧 Quote email sent successfully');
        } catch (emailError) {
          console.error('📧 Failed to send quote email:', emailError);
          // Don't fail the entire request if email fails
        }
      }

      return { quote: fullQuote, emailSent, hasRampHeight };
    });

    // Prepare response based on whether we sent email or not
    const responseData = {
      success: true,
      quote: {
        id: result.quote?.id,
        status: result.quote?.status,
        customer: {
          name: result.quote?.customer.name,
          email: result.quote?.customer.email,
        },
        pricing: result.hasRampHeight ? {
          monthlyRate: result.quote?.monthlyRate,
          installationFee: result.quote?.installationFee,
          total: (result.quote?.monthlyRate || 0) + (result.quote?.installationFee || 0),
        } : null,
        emailSent: result.emailSent,
        needsAssessment: !result.hasRampHeight,
      },
      message: result.hasRampHeight 
        ? result.emailSent 
          ? 'Quote created and sent to customer via email'
          : 'Quote created with pricing - email sending failed'
        : 'Quote request received - assessment needed to provide pricing',
    };

    const statusCode = result.hasRampHeight ? 201 : 202; // 202 = Accepted but needs further processing

    return NextResponse.json(responseData, { 
      status: statusCode, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('❌ Error processing quote request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process quote request',
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