import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/customers - List customers with optional search and pagination
export async function GET() {
  try {
    const customers = await db.customer.findMany({
      include: {
        addresses: true,
        rentals: {
          include: {
            payments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to recent customers
    });

    // Transform to match frontend expectations
    const transformedCustomers = customers.map(customer => {
      const address = customer.addresses[0];
      const fullAddress = address 
        ? `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
        : '';
      
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: fullAddress,
        status: customer.rentals.length > 0 ? 'Active Rental' : 'Inactive',
        rentalStatus: customer.rentals.length > 0 ? 'Active' : undefined,
        monthlyRate: customer.rentals[0]?.monthlyRate || 0,
        nextPayment: customer.rentals[0]?.payments
          .find(p => p.status === 'PENDING')?.dueDate?.toISOString() || '',
        lastActivity: customer.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(transformedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Parse address if provided
    let addressData;
    if (address) {
      // Simple address parsing - in production you'd use a proper address parser
      const parts = address.split(',').map((part: string) => part.trim());
      addressData = {
        street: parts[0] || address,
        city: parts[1] || 'Dallas',
        state: parts[2] || 'TX',
        zipCode: parts[3] || '75201',
        country: 'US',
      };
    }

    // Create customer
    const customer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        addresses: addressData ? {
          create: addressData,
        } : undefined,
      },
      include: {
        addresses: true,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

 