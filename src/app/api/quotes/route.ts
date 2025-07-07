import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma, QuoteStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: Prisma.QuoteWhereInput = {};
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (status && Object.values(QuoteStatus).includes(status as QuoteStatus)) {
      where.status = status as QuoteStatus;
    }

    const [quotes, total] = await Promise.all([
      db.quote.findMany({
        where,
        include: {
          customer: true,
          serviceAddress: true,
          agreement: {
            include: {
              rental: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.quote.count({ where })
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const {
      customerId,
      serviceAddressId,
      rampHeight,
      timelineNeeded,
      serviceType,
      monthlyRate,
      installationFee,
      estimatedDuration,
      notes
    } = data;

    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const quote = await db.quote.create({
      data: {
        customerId,
        serviceAddressId,
        rampHeight: parseFloat(rampHeight),
        timelineNeeded,
        serviceType,
        monthlyRate: parseFloat(monthlyRate),
        installationFee: parseFloat(installationFee),
        estimatedDuration,
        notes,
        expiresAt,
        status: 'PENDING'
      },
      include: {
        customer: true,
        serviceAddress: true
      }
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
  }
} 