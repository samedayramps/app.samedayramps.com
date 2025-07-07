import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await db.quote.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        serviceAddress: true,
        agreement: {
          include: {
            rental: {
              include: {
                payments: true
              }
            }
          }
        }
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { status, notes, ...updateData } = data;

    // Handle status changes with proper timestamps
    const statusUpdates: { status?: string; sentAt?: Date } = {};
    if (status && status !== data.currentStatus) {
      statusUpdates.status = status;
      if (status === 'SENT') {
        statusUpdates.sentAt = new Date();
      }
    }

    const quote = await db.quote.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...statusUpdates,
        notes,
        updatedAt: new Date()
      },
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

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if quote has associated agreements/rentals
    const quote = await db.quote.findUnique({
      where: { id: params.id },
      include: {
        agreement: {
          include: {
            rental: true
          }
        }
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (quote.agreement) {
      return NextResponse.json(
        { error: 'Cannot delete quote with associated agreement' },
        { status: 400 }
      );
    }

    await db.quote.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    );
  }
} 