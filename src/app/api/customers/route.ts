import { NextRequest, NextResponse } from 'next/server';

// Mock customer data - in real app this would connect to database
const customers = [
  {
    id: "1",
    name: "Johnson, Michael",
    email: "mjohnson@email.com",
    phone: "(214) 555-0123",
    address: "1234 Oak Street",
    city: "Dallas", 
    state: "TX",
    zipCode: "75201",
    initials: "MJ",
    status: "active",
    rentalStatus: "Active Rental",
    monthlyRate: 150,
    nextPayment: "2024-12-15",
    rampHeight: "24 inches",
    startDate: "2024-06-15",
    createdAt: "2024-06-01T00:00:00Z",
    notes: "Preferred customer - always pays on time"
  },
  {
    id: "2",
    name: "Williams, Sarah",
    email: "swilliams@email.com", 
    phone: "(214) 555-0124",
    address: "567 Pine Avenue",
    city: "Dallas",
    state: "TX", 
    zipCode: "75202",
    initials: "SW",
    status: "active",
    rentalStatus: "Ending Soon",
    monthlyRate: 125,
    nextPayment: "2024-12-20",
    rampHeight: "18 inches", 
    startDate: "2024-05-20",
    createdAt: "2024-05-15T00:00:00Z",
    notes: "Long-term aging in place rental"
  },
  {
    id: "3",
    name: "Davis, Robert",
    email: "rdavis@email.com",
    phone: "(214) 555-0125", 
    address: "890 Elm Street",
    city: "Dallas",
    state: "TX",
    zipCode: "75203", 
    initials: "RD",
    status: "active",
    rentalStatus: "Installation Scheduled",
    monthlyRate: 175,
    nextPayment: "2024-12-25",
    rampHeight: "30 inches",
    startDate: "2024-12-15",
    createdAt: "2024-12-01T00:00:00Z",
    notes: "New installation scheduled for Dec 15th"
  },
  {
    id: "4", 
    name: "Garcia, Maria",
    email: "mgarcia@email.com",
    phone: "(214) 555-0126",
    address: "321 Maple Drive",
    city: "Dallas",
    state: "TX",
    zipCode: "75204",
    initials: "MG", 
    status: "pending",
    rentalStatus: "Quote Pending",
    monthlyRate: 140,
    nextPayment: "Quote expires Dec 18",
    rampHeight: "20 inches",
    startDate: null,
    createdAt: "2024-12-05T00:00:00Z",
    notes: "Follow-up needed on quote response"
  },
  {
    id: "5",
    name: "Chen, Lisa",
    email: "lchen@email.com",
    phone: "(214) 555-0127",
    address: "456 Cedar Lane", 
    city: "Dallas",
    state: "TX",
    zipCode: "75205",
    initials: "LC",
    status: "active",
    rentalStatus: "Active Rental", 
    monthlyRate: 160,
    nextPayment: "2024-12-18",
    rampHeight: "22 inches",
    startDate: "2024-07-10",
    createdAt: "2024-07-01T00:00:00Z",
    notes: "Satisfied customer - referred by neighbor"
  }
];

// GET /api/customers - List customers with optional search and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredCustomers = customers;

    // Apply search filter
    if (search) {
      filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search) ||
        customer.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter  
    if (status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.status === status
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedCustomers,
      meta: {
        total: filteredCustomers.length,
        page,
        limit,
        totalPages: Math.ceil(filteredCustomers.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate new customer ID
    const newId = (Math.max(...customers.map(c => parseInt(c.id))) + 1).toString();
    
    // Generate initials
    const nameParts = body.name.split(/[\s,]+/);
    const initials = nameParts.slice(0, 2).map((part: string) => part[0]).join('').toUpperCase();

    const newCustomer = {
      id: newId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      initials,
      status: 'pending',
      rentalStatus: 'No Active Rental',
      monthlyRate: 0,
      nextPayment: 'N/A',
      rampHeight: 'N/A',
      startDate: null,
      createdAt: new Date().toISOString(),
      notes: body.notes || ''
    };

    customers.push(newCustomer);

    return NextResponse.json({
      data: newCustomer,
      message: 'Customer created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers - Update customer (requires ID in body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const customerIndex = customers.findIndex(c => c.id === body.id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Update customer
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      data: customers[customerIndex],
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
} 