import { PrismaClient, TimelineType, ServiceType, QuoteStatus, AgreementStatus, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Initialize default settings
  console.log('📋 Creating default settings...');
  const defaultSettings = [
    {
      key: 'pricing',
      value: {
        base_monthly: 125,
        per_inch_monthly: 6,
        base_installation: 75,
        per_inch_installation: 2,
      },
    },
    {
      key: 'business_hours',
      value: {
        start: '08:00',
        end: '18:00',
        timezone: 'America/Chicago',
      },
    },
    {
      key: 'company',
      value: {
        name: 'Same Day Ramps',
        phone: '(214) 555-0123',
        email: 'info@samedayramps.com',
        address: 'Dallas-Fort Worth, TX',
      },
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@samedayramps.com' },
    update: {},
    create: {
      email: 'admin@samedayramps.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  // Create sample customers
  console.log('👥 Creating sample customers...');
  const customers = [
    {
      name: 'Michael Johnson',
      email: 'mjohnson@example.com',
      phone: '(214) 555-0101',
    },
    {
      name: 'Sarah Williams',
      email: 'swilliams@example.com',
      phone: '(214) 555-0102',
    },
    {
      name: 'Robert Davis',
      email: 'rdavis@example.com',
      phone: '(214) 555-0103',
    },
  ];

  const createdCustomers = [];
  for (const customer of customers) {
    const createdCustomer = await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer,
    });
    createdCustomers.push(createdCustomer);
  }

  // Create sample addresses
  console.log('🏠 Creating sample addresses...');
  const addresses = [
    {
      street: '1234 Oak Street',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      customerId: createdCustomers[0].id,
    },
    {
      street: '567 Pine Avenue',
      city: 'Fort Worth',
      state: 'TX',
      zipCode: '76102',
      customerId: createdCustomers[1].id,
    },
    {
      street: '890 Maple Drive',
      city: 'Arlington',
      state: 'TX',
      zipCode: '76010',
      customerId: createdCustomers[2].id,
    },
  ];

  const createdAddresses = [];
  for (const address of addresses) {
    const createdAddress = await prisma.address.create({
      data: address,
    });
    createdAddresses.push(createdAddress);
  }

  // Create sample quotes
  console.log('💬 Creating sample quotes...');
  const quotes = [
    {
      customerId: createdCustomers[0].id,
      serviceAddressId: createdAddresses[0].id,
      rampHeight: 24,
      timelineNeeded: TimelineType.ASAP,
      serviceType: ServiceType.POST_SURGERY,
      monthlyRate: 269, // 125 + (24 * 6)
      installationFee: 123, // 75 + (24 * 2)
      estimatedDuration: '2-3 hours',
      status: QuoteStatus.PENDING,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes: 'Customer needs ramp for post-surgery recovery',
    },
    {
      customerId: createdCustomers[1].id,
      serviceAddressId: createdAddresses[1].id,
      rampHeight: 18,
      timelineNeeded: TimelineType.WITHIN_3_DAYS,
      serviceType: ServiceType.AGING_IN_PLACE,
      monthlyRate: 233, // 125 + (18 * 6)
      installationFee: 111, // 75 + (18 * 2)
      estimatedDuration: '1-2 hours',
      status: QuoteStatus.SENT,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      notes: 'Customer wants to age in place comfortably',
    },
    {
      customerId: createdCustomers[2].id,
      serviceAddressId: createdAddresses[2].id,
      rampHeight: 12,
      timelineNeeded: TimelineType.WITHIN_1_WEEK,
      serviceType: ServiceType.TRANSITIONAL_HOSPICE,
      monthlyRate: 197, // 125 + (12 * 6)
      installationFee: 99, // 75 + (12 * 2)
      estimatedDuration: '1 hour',
      status: QuoteStatus.ACCEPTED,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      notes: 'Hospice care transition support',
    },
  ];

  const createdQuotes = [];
  for (const quote of quotes) {
    const createdQuote = await prisma.quote.create({
      data: quote,
    });
    createdQuotes.push(createdQuote);
  }

  // Create agreements for accepted quotes
  console.log('📄 Creating sample agreements...');
  const acceptedQuote = createdQuotes.find(q => q.status === 'ACCEPTED');
  if (acceptedQuote) {
    await prisma.agreement.create({
      data: {
        quoteId: acceptedQuote.id,
        status: AgreementStatus.SIGNED,
        signedAt: new Date(),
        contractTerms: {
          monthlyRate: acceptedQuote.monthlyRate,
          installationFee: acceptedQuote.installationFee,
          terms: 'Standard rental agreement terms',
        },
      },
    });
  }

  // Create audit events
  console.log('📊 Creating sample audit events...');
  const events = [
    {
      entityType: 'customer',
      entityId: createdCustomers[0].id,
      eventType: 'customer.created',
      eventData: { name: createdCustomers[0].name },
      userId: adminUser.id,
    },
    {
      entityType: 'quote',
      entityId: createdQuotes[0].id,
      eventType: 'quote.created',
      eventData: { amount: createdQuotes[0].monthlyRate },
      userId: adminUser.id,
    },
    {
      entityType: 'quote',
      entityId: createdQuotes[1].id,
      eventType: 'quote.sent',
      eventData: { sentTo: createdCustomers[1].email },
      userId: adminUser.id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${createdCustomers.length} customers`);
  console.log(`Created ${createdAddresses.length} addresses`);
  console.log(`Created ${createdQuotes.length} quotes`);
  console.log(`Created ${defaultSettings.length} settings`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 