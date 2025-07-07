import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { QuoteStatus } from '@prisma/client';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { status } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Check if quote exists
    const existingQuote = await db.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        serviceAddress: true
      }
    });

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Prepare update data based on status change
    const updateData: { status: QuoteStatus; updatedAt: Date; sentAt?: Date } = {
      status: status as QuoteStatus,
      updatedAt: new Date()
    };

    // Add timestamp for status changes
    switch (status) {
      case 'SENT':
        updateData.sentAt = new Date();
        break;
      // Add other status-specific updates as needed
    }

    // Update the quote
    const updatedQuote = await db.quote.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        serviceAddress: true,
        agreement: {
          include: {
            rental: true
          }
        }
      }
    });

    // Handle status-specific side effects
    if (status === 'ACCEPTED') {
      // Could trigger agreement creation workflow here
      console.log('Quote accepted - agreement workflow should be triggered');
    }

    return NextResponse.json({
      quote: updatedQuote,
      message: `Quote status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating quote status:', error);
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    );
  }
} 