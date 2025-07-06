import { NextRequest, NextResponse } from 'next/server';

// Mock quotes data - in real app this would connect to database
const quotes = [
  {
    id: "Q001",
    customerName: "Johnson, Michael",
    customerEmail: "mjohnson@email.com",
    customerPhone: "(214) 555-0123",
    customerInitials: "MJ",
    serviceAddress: "1234 Oak Street, Dallas, TX 75201",
    rampHeight: 24,
    monthlyRate: 150,
    installationFee: 75,
    totalFirstMonth: 225,
    timeline: "within-3-days",
    status: "pending",
    createdAt: "2024-12-15T09:30:00Z",
    expiresAt: "2024-12-22T09:30:00Z",
    sentAt: null,
    acceptedAt: null,
    declinedAt: null,
    estimatedDuration: "6-12 months",
    notes: "Customer needs ASAP wheelchair ramp installation"
  },
  {
    id: "Q002", 
    customerName: "Williams, Sarah",
    customerEmail: "swilliams@email.com",
    customerPhone: "(214) 555-0124",
    customerInitials: "SW",
    serviceAddress: "567 Pine Avenue, Dallas, TX 75202",
    rampHeight: 18,
    monthlyRate: 125,
    installationFee: 50,
    totalFirstMonth: 175,
    timeline: "within-1-week",
    status: "sent",
    createdAt: "2024-12-14T14:15:00Z",
    expiresAt: "2024-12-21T14:15:00Z",
    sentAt: "2024-12-14T15:00:00Z",
    acceptedAt: null,
    declinedAt: null,
    estimatedDuration: "12+ months",
    notes: "Ongoing mobility needs - wheelchair ramp rental"
  },
  {
    id: "Q003",
    customerName: "Davis, Robert", 
    customerEmail: "rdavis@email.com",
    customerPhone: "(214) 555-0125",
    customerInitials: "RD",
    serviceAddress: "890 Elm Street, Dallas, TX 75203",
    rampHeight: 30,
    monthlyRate: 175,
    installationFee: 100,
    totalFirstMonth: 275,
    timeline: "asap",
    status: "accepted",
    createdAt: "2024-12-13T11:00:00Z",
    expiresAt: "2024-12-20T11:00:00Z",
    sentAt: "2024-12-13T11:30:00Z",
    acceptedAt: "2024-12-13T16:45:00Z",
    declinedAt: null,
    estimatedDuration: "3-6 months",
    notes: "Temporary wheelchair ramp rental needed"
  },
  {
    id: "Q004",
    customerName: "Garcia, Maria",
    customerEmail: "mgarcia@email.com", 
    customerPhone: "(214) 555-0126",
    customerInitials: "MG",
    serviceAddress: "321 Maple Drive, Dallas, TX 75204",
    rampHeight: 20,
    monthlyRate: 140,
    installationFee: 65,
    totalFirstMonth: 205,
    timeline: "flexible",
    status: "expired",
    createdAt: "2024-12-05T08:00:00Z",
    expiresAt: "2024-12-12T08:00:00Z",
    sentAt: "2024-12-05T09:00:00Z",
    acceptedAt: null,
    declinedAt: null,
    estimatedDuration: "4-8 months",
    notes: "Follow-up needed - quote expired without response"
  },
  {
    id: "Q005",
    customerName: "Chen, Lisa",
    customerEmail: "lchen@email.com",
    customerPhone: "(214) 555-0127", 
    customerInitials: "LC",
    serviceAddress: "456 Cedar Lane, Dallas, TX 75205",
    rampHeight: 22,
    monthlyRate: 160,
    installationFee: 80,
    totalFirstMonth: 240,
    timeline: "within-3-days",
    status: "declined",
    createdAt: "2024-12-10T13:30:00Z",
    expiresAt: "2024-12-17T13:30:00Z",
    sentAt: "2024-12-10T14:00:00Z",
    acceptedAt: null,
    declinedAt: "2024-12-11T10:15:00Z",
    estimatedDuration: "12+ months",
    notes: "Customer found alternative solution"
  }
];

// Helper function to add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Handle preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}

// GET /api/quotes - List quotes with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const timeline = searchParams.get('timeline') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredQuotes = quotes;

    // Apply search filter
    if (search) {
      filteredQuotes = quotes.filter(quote => 
        quote.customerName.toLowerCase().includes(search.toLowerCase()) ||
        quote.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
        quote.id.toLowerCase().includes(search.toLowerCase()) ||
        quote.serviceAddress.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filteredQuotes = filteredQuotes.filter(quote => quote.status === status);
    }

    // Apply timeline filter
    if (timeline !== 'all') {
      filteredQuotes = filteredQuotes.filter(quote => quote.timeline === timeline);
    }

    // Sort by creation date (newest first)
    filteredQuotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedQuotes = filteredQuotes.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      total: quotes.length,
      pending: quotes.filter(q => q.status === 'pending').length,
      sent: quotes.filter(q => q.status === 'sent').length,
      accepted: quotes.filter(q => q.status === 'accepted').length,
      declined: quotes.filter(q => q.status === 'declined').length,
      expired: quotes.filter(q => q.status === 'expired').length,
      totalValue: quotes.reduce((sum, q) => sum + q.monthlyRate, 0),
      averageValue: Math.round(quotes.reduce((sum, q) => sum + q.monthlyRate, 0) / quotes.length)
    };

    const response = NextResponse.json({
      data: paginatedQuotes,
      meta: {
        total: filteredQuotes.length,
        page,
        limit,
        totalPages: Math.ceil(filteredQuotes.length / limit)
      },
      stats
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

// POST /api/quotes - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields (make rampHeight optional)
    const requiredFields = [
      'customerName', 
      'customerEmail', 
      'customerPhone',
      'serviceAddress',
      'timeline'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        const response = NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
        return addCorsHeaders(response);
      }
    }

    // Generate new quote ID
    const lastQuoteNum = Math.max(...quotes.map(q => parseInt(q.id.substring(1))));
    const newQuoteId = `Q${String(lastQuoteNum + 1).padStart(3, '0')}`;
    
    // Generate customer initials
    const nameParts = body.customerName.split(/[\s,]+/);
    const initials = nameParts.slice(0, 2).map((part: string) => part[0]).join('').toUpperCase();

    // Use default ramp height if not provided
    const rampHeight = body.rampHeight ? parseInt(body.rampHeight) : 20;

    // Calculate pricing based on ramp height for wheelchair ramp rental
    const baseMonthlyRate = 125;
    const perInchRate = 6;
    const baseInstallationFee = 75;
    const perInchInstallation = 2;

    const monthlyRate = baseMonthlyRate + (rampHeight * perInchRate);
    const installationFee = baseInstallationFee + (rampHeight * perInchInstallation);
    const totalFirstMonth = monthlyRate + installationFee;

    // Set expiration date (7 days from creation)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newQuote = {
      id: newQuoteId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerInitials: initials,
      serviceAddress: body.serviceAddress,
      rampHeight,
      monthlyRate,
      installationFee,
      totalFirstMonth,
      timeline: body.timeline,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      sentAt: null,
      acceptedAt: null,
      declinedAt: null,
      estimatedDuration: body.estimatedDuration || '6-12 months',
      notes: body.notes || '',
      source: body.source || 'admin', // Track source for analytics
      priority: body.priority || 'normal'
    };

    quotes.unshift(newQuote); // Add to beginning for newest first

    const response = NextResponse.json({
      data: newQuote,
      message: 'Quote created successfully'
    }, { status: 201 });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error creating quote:', error);
    const response = NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

// Helper function to create customer from quote
async function createCustomerFromQuote(quote: typeof quotes[0]) {
  // In a real app, this would call your customer API
  const newCustomer = {
    id: `CUST_${Date.now()}`,
    name: quote.customerName,
    email: quote.customerEmail,
    phone: quote.customerPhone,
    addresses: [quote.serviceAddress],
    status: "active",
    rentalStatus: "pending-installation",
    monthlyRate: quote.monthlyRate,
    totalRevenue: quote.monthlyRate,
    currentRental: {
      quoteId: quote.id,
      startDate: new Date().toISOString().split('T')[0],
      monthlyRate: quote.monthlyRate,
      rampHeight: quote.rampHeight,
      status: "installation-scheduled"
    },
    paymentHistory: [],
    notes: quote.notes,
    createdAt: new Date().toISOString()
  };

  // Here you would typically save to your customers database
  console.log('Customer created from quote:', newCustomer);
  
  return newCustomer;
}

// PUT /api/quotes - Update quote status and details
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      const response = NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }

    const quoteIndex = quotes.findIndex(q => q.id === body.id);
    if (quoteIndex === -1) {
      const response = NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    const currentQuote = quotes[quoteIndex];
    const updatedQuote = { ...currentQuote, ...body };

    // Handle status changes
    if (body.status && body.status !== currentQuote.status) {
      switch (body.status) {
        case 'sent':
          updatedQuote.sentAt = new Date().toISOString();
          break;
        case 'accepted':
          updatedQuote.acceptedAt = new Date().toISOString();
          // Automatically create customer when quote is accepted
          await createCustomerFromQuote(updatedQuote);
          break;
        case 'declined':
          updatedQuote.declinedAt = new Date().toISOString();
          break;
        case 'expired':
          // Usually handled automatically, but can be manually set
          break;
      }
    }

    updatedQuote.updatedAt = new Date().toISOString();
    quotes[quoteIndex] = updatedQuote;

    const response = NextResponse.json({
      data: updatedQuote,
      message: 'Quote updated successfully'
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Error updating quote:', error);
    const response = NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
} 