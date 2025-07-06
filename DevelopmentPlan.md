# Same Day Ramps - Admin Application Specification

## Table of Contents
- [Application Overview](#application-overview)
- [Architecture Principles](#architecture-principles)
- [Core Domain Model](#core-domain-model)
- [User Interface Design](#user-interface-design)
- [API Design](#api-design)
- [Integration Requirements](#integration-requirements)
- [Security & Access Control](#security--access-control)
- [Data Management](#data-management)
- [Development Roadmap](#development-roadmap)
- [Technical Stack](#technical-stack)

---

## Application Overview

### Purpose
A simple, scalable admin application for managing wheelchair ramp rentals, from initial customer inquiry through installation, billing, and removal.

### Core Objectives
- **Simplicity**: Intuitive workflows that match business processes
- **Reliability**: Robust data handling and error recovery
- **Scalability**: Architecture that grows without re-engineering
- **Integration**: Seamless connection with external services

### Success Metrics
- Time from quote request to signed agreement: < 2 hours
- Installation scheduling accuracy: 95%+
- Payment collection rate: 98%+
- Customer satisfaction: 4.8+ stars

---

## Architecture Principles

### 1. Domain-Driven Design
Business entities drive the system architecture, not technical concerns.

### 2. Progressive Enhancement
Start with server-rendered HTML, add JavaScript only where it significantly improves UX.

### 3. API-First Development
All business logic exposed through RESTful APIs for future integrations.

### 4. Configuration Over Code
Business rules stored as data, not hardcoded logic.

### 5. Event-Driven Workflows
State changes trigger automated processes and maintain audit trails.

---

## Core Domain Model

### Primary Entities

#### Customer
```typescript
Customer {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
  rental_history: Rental[]
  communication_preferences: object
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp?
}
```

#### Quote
```typescript
Quote {
  id: string
  customer_id: string
  service_address: Address
  ramp_height: number
  timeline_needed: enum('asap', 'within-3-days', 'within-1-week', 'flexible')
  service_type: enum('post-surgery', 'aging-in-place', 'transitional-hospice')
  monthly_rate: number
  installation_fee: number
  estimated_duration: string
  status: enum('pending', 'sent', 'accepted', 'expired', 'declined')
  expires_at: timestamp
  created_at: timestamp
  notes: text?
}
```

#### Agreement
```typescript
Agreement {
  id: string
  quote_id: string
  esignature_document_id: string
  signed_at: timestamp?
  contract_terms: object
  special_conditions: text?
  status: enum('draft', 'sent', 'signed', 'cancelled')
}
```

#### Rental
```typescript
Rental {
  id: string
  agreement_id: string
  customer_id: string
  service_address: Address
  ramp_configuration: object
  start_date: date
  end_date: date?
  monthly_rate: number
  installation_scheduled: timestamp?
  installation_completed: timestamp?
  removal_scheduled: timestamp?
  removal_completed: timestamp?
  status: enum('scheduled', 'active', 'ending', 'completed', 'cancelled')
  equipment_inventory_ids: string[]
  technician_notes: text?
}
```

#### Payment
```typescript
Payment {
  id: string
  rental_id: string
  stripe_payment_intent_id: string
  amount: number
  type: enum('installation_fee', 'monthly_rent', 'late_fee', 'damage_fee')
  due_date: date
  paid_date: date?
  status: enum('pending', 'paid', 'failed', 'refunded')
  failure_reason: string?
  retry_count: number
}
```

#### Event
```typescript
Event {
  id: string
  entity_type: string
  entity_id: string
  event_type: string
  event_data: object
  user_id: string?
  timestamp: timestamp
  ip_address: string?
}
```

### Entity Relationships

```
Customer 1:many Quote
Quote 1:1 Agreement
Agreement 1:1 Rental
Rental 1:many Payment
All entities 1:many Event (audit trail)
```

---

## User Interface Design

### Navigation Structure

#### Primary Navigation (Sidebar)
- **Dashboard** - Key metrics and urgent actions
- **Customers** - Customer management and history
- **Quotes** - Quote management and conversion
- **Active Rentals** - Current rental operations
- **Scheduling** - Installation/removal calendar
- **Billing** - Payment tracking and invoicing
- **Inventory** - Equipment management
- **Settings** - Configuration and preferences

#### Secondary Navigation (Contextual)
- Breadcrumbs for deep navigation
- Action buttons based on current record state
- Quick filters and search within sections

### Progressive Disclosure Pattern

#### Level 1: Dashboard Overview
```
┌─────────────────────────────────────────┐
│ Urgent Actions                          │
│ • 3 quotes awaiting response            │
│ • 2 installations scheduled today       │
│ • 1 payment failed - needs attention   │
│                                         │
│ Key Metrics (Last 30 Days)             │
│ Revenue: $12,450 | Active Rentals: 23  │
│ Conversion Rate: 78% | Avg Duration: 4mo│
└─────────────────────────────────────────┘
```

#### Level 2: List Views
```
┌─────────────────────────────────────────┐
│ Active Rentals                    [+New]│
│ ┌─────────────────────────────────────┐ │
│ │ Johnson, M. | 1234 Oak St | $150   │ │
│ │ Started: 2024-06-15 | Status: ●   │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Williams, S. | 567 Pine Ave | $125 │ │
│ │ Started: 2024-05-20 | Status: ●   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Level 3: Detailed Forms
```
┌─────────────────────────────────────────┐
│ Customer: Johnson, Michael              │
│ ┌─Tab: Details─┐┌─Tab: Billing─┐┌─History─┐
│ │ Name: [Johnson, Michael      ]        │
│ │ Phone: [(214) 555-0123      ]        │
│ │ Email: [mjohnson@email.com  ]        │
│ │                                      │
│ │ Service Address:                     │
│ │ [1234 Oak Street              ]      │
│ │ [Dallas, TX 75201           ]        │
│ │                                      │
│ │ [Save Changes] [Cancel]              │
│ └──────────────────────────────────────┘
└─────────────────────────────────────────┘
```

### Component Library

#### Reusable Components
- **CustomerSelector**: Searchable dropdown with customer details
- **AddressPicker**: Google Places integration with validation
- **StatusBadge**: Color-coded status indicators
- **DateRangePicker**: Installation/removal date selection
- **RampConfigurator**: Visual ramp configuration tool
- **PaymentStatus**: Payment tracking with retry actions
- **EventTimeline**: Chronological activity log
- **DocumentViewer**: PDF viewer for agreements

#### Form Patterns
- **Auto-save**: Forms save drafts automatically
- **Validation**: Real-time validation with clear error messages
- **Loading States**: Clear feedback during operations
- **Confirmation**: Destructive actions require confirmation

---

## API Design

### RESTful Endpoints

#### Customer Management
```
GET    /api/customers                 # List customers with pagination
POST   /api/customers                 # Create new customer
GET    /api/customers/:id             # Get customer details
PUT    /api/customers/:id             # Update customer
DELETE /api/customers/:id             # Soft delete customer
GET    /api/customers/:id/rentals     # Get customer rental history
```

#### Quote Management
```
GET    /api/quotes                    # List quotes with filters
POST   /api/quotes                    # Create quote from form submission
GET    /api/quotes/:id                # Get quote details
PUT    /api/quotes/:id                # Update quote
POST   /api/quotes/:id/send           # Send quote to customer
POST   /api/quotes/:id/convert        # Convert quote to agreement
```

#### Rental Operations
```
GET    /api/rentals                   # List active rentals
POST   /api/rentals                   # Create rental from agreement
GET    /api/rentals/:id               # Get rental details
PUT    /api/rentals/:id               # Update rental status
POST   /api/rentals/:id/schedule      # Schedule installation/removal
POST   /api/rentals/:id/complete      # Mark installation/removal complete
```

#### Billing & Payments
```
GET    /api/payments                  # List payments with filters
POST   /api/payments                  # Create payment intent
GET    /api/payments/:id              # Get payment details
POST   /api/payments/:id/retry        # Retry failed payment
POST   /api/payments/:id/refund       # Process refund
```

### Response Formats

#### Success Response
```json
{
  "data": {
    "id": "cust_123",
    "name": "Michael Johnson",
    "email": "mjohnson@email.com"
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

#### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number is required",
    "details": {
      "field": "phone",
      "value": null
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Event System

#### Event Types
```typescript
// Customer Events
'customer.created'
'customer.updated'
'customer.deleted'

// Quote Events
'quote.created'
'quote.sent'
'quote.accepted'
'quote.expired'

// Rental Events
'rental.started'
'rental.installation_scheduled'
'rental.installation_completed'
'rental.removal_scheduled'
'rental.removal_completed'
'rental.ended'

// Payment Events
'payment.created'
'payment.succeeded'
'payment.failed'
'payment.refunded'
```

#### Event Handlers
```typescript
// Automated workflows triggered by events
on('quote.accepted', async (event) => {
  await createAgreement(event.quote_id);
  await sendToESignatures(event.agreement_id);
});

on('agreement.signed', async (event) => {
  await createRental(event.agreement_id);
  await createFirstInvoice(event.rental_id);
  await scheduleInstallation(event.rental_id);
});

on('payment.failed', async (event) => {
  await sendPaymentFailureNotification(event.customer_id);
  await schedulePaymentRetry(event.payment_id);
});
```

---

## Integration Requirements

### Stripe Integration

#### Subscription Management
```typescript
// Create customer in Stripe
const stripeCustomer = await stripe.customers.create({
  email: customer.email,
  name: customer.name,
  phone: customer.phone,
  metadata: {
    internal_customer_id: customer.id
  }
});

// Create monthly subscription
const subscription = await stripe.subscriptions.create({
  customer: stripeCustomer.id,
  items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Wheelchair Ramp Rental'
        },
        unit_amount: rental.monthly_rate * 100,
        recurring: {
          interval: 'month'
        }
      }
    }
  ]
});
```

#### Webhook Handling
```typescript
// Handle Stripe webhook events
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleCancelledSubscription(event.data.object);
      break;
  }

  res.json({ received: true });
});
```

### eSignatures.com Integration

#### Document Creation
```typescript
// Create agreement document
const document = await eSignatures.createDocument({
  template_id: 'rental_agreement_template',
  variables: {
    customer_name: customer.name,
    service_address: rental.service_address,
    monthly_rate: rental.monthly_rate,
    start_date: rental.start_date
  }
});

// Send for signature
await eSignatures.sendForSignature({
  document_id: document.id,
  signers: [
    {
      email: customer.email,
      name: customer.name,
      role: 'customer'
    }
  ],
  callback_url: `${BASE_URL}/api/webhooks/esignatures`
});
```

#### Webhook Handling
```typescript
// Handle signature completion
app.post('/api/webhooks/esignatures', async (req, res) => {
  const { document_id, status, signed_at } = req.body;
  
  if (status === 'completed') {
    await updateAgreement(document_id, {
      status: 'signed',
      signed_at: new Date(signed_at)
    });
    
    // Trigger rental creation workflow
    await createRentalFromAgreement(document_id);
  }
  
  res.json({ received: true });
});
```

### Resend Email Integration

#### Email Templates
```typescript
// Quote follow-up email
const quoteFollowUp = {
  template: 'quote_follow_up',
  variables: {
    customer_name: customer.name,
    quote_amount: quote.monthly_rate,
    quote_link: `${BASE_URL}/quotes/${quote.id}`,
    expires_in_hours: hoursUntilExpiration
  }
};

// Installation reminder
const installationReminder = {
  template: 'installation_reminder',
  variables: {
    customer_name: customer.name,
    installation_date: rental.installation_scheduled,
    technician_name: technician.name,
    contact_phone: technician.phone
  }
};
```

#### Automated Email Workflows
```typescript
// Email sequences based on events
const emailWorkflows = {
  'quote.created': [
    { delay: 0, template: 'quote_created' },
    { delay: '24h', template: 'quote_follow_up', condition: 'status == pending' },
    { delay: '72h', template: 'quote_final_reminder', condition: 'status == pending' }
  ],
  
  'rental.started': [
    { delay: 0, template: 'welcome_new_customer' },
    { delay: '7d', template: 'rental_check_in' },
    { delay: '30d', template: 'monthly_satisfaction_survey' }
  ],
  
  'payment.failed': [
    { delay: 0, template: 'payment_failed_notice' },
    { delay: '3d', template: 'payment_retry_reminder' },
    { delay: '7d', template: 'payment_final_notice' }
  ]
};
```

---

## Security & Access Control

### Authentication & Authorization

#### User Roles
```typescript
enum UserRole {
  ADMIN = 'admin',           // Full system access
  MANAGER = 'manager',       // Operations and customer management
  TECHNICIAN = 'technician', // Installation scheduling and completion
  BILLING = 'billing'        // Payment and invoicing access
}

const permissions = {
  'admin': ['*'],
  'manager': [
    'customers.*',
    'quotes.*',
    'rentals.*',
    'scheduling.*'
  ],
  'technician': [
    'rentals.read',
    'rentals.update_status',
    'scheduling.read',
    'scheduling.update'
  ],
  'billing': [
    'payments.*',
    'invoices.*',
    'customers.read'
  ]
};
```

#### Session Management
```typescript
// JWT-based authentication with refresh tokens
const authConfig = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  requireMFA: true,
  sessionTimeout: '4h'
};

// Rate limiting
const rateLimits = {
  'api/*': '100 requests per minute',
  'auth/login': '5 requests per minute',
  'webhooks/*': '1000 requests per minute'
};
```

### Data Protection

#### Encryption
- All PII encrypted at rest using AES-256
- Database connections use TLS 1.3
- API communications over HTTPS only
- Backup encryption with customer-managed keys

#### PII Handling
```typescript
// Automatic PII detection and handling
const piiFields = [
  'email',
  'phone',
  'ssn',
  'address',
  'payment_method'
];

// Data retention policies
const retentionPolicies = {
  'customer_data': '7 years after last rental',
  'payment_data': '7 years for tax compliance',
  'communication_logs': '3 years',
  'system_logs': '1 year'
};
```

#### Audit Logging
```typescript
// Comprehensive audit trail
const auditEvents = [
  'user.login',
  'user.logout',
  'customer.created',
  'customer.updated',
  'customer.viewed',
  'payment.processed',
  'document.accessed',
  'export.generated'
];

// Log format
const auditLog = {
  timestamp: '2024-01-15T10:30:00Z',
  user_id: 'user_123',
  action: 'customer.updated',
  resource_id: 'cust_456',
  ip_address: '192.168.1.100',
  user_agent: 'Mozilla/5.0...',
  changes: {
    field: 'phone',
    old_value: '[REDACTED]',
    new_value: '[REDACTED]'
  }
};
```

---

## Data Management

### Database Strategy

#### Primary Database: PostgreSQL
```sql
-- Customer table with soft deletes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Indexing strategy
CREATE INDEX idx_customers_email ON customers(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_phone ON customers(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_created_at ON customers(created_at);
```

#### Backup Strategy
- **Real-time**: Streaming replication to standby
- **Daily**: Full database backup to encrypted S3
- **Weekly**: Point-in-time recovery testing
- **Monthly**: Disaster recovery drill

#### Data Integrity
```typescript
// Database constraints
const constraints = {
  // Referential integrity
  'quotes.customer_id': 'FOREIGN KEY REFERENCES customers(id)',
  
  // Business rules
  'quotes.expires_at': 'CHECK (expires_at > created_at)',
  'rentals.end_date': 'CHECK (end_date IS NULL OR end_date > start_date)',
  'payments.amount': 'CHECK (amount > 0)',
  
  // Data quality
  'customers.email': 'CHECK (email ~* \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$\')',
  'customers.phone': 'CHECK (phone ~* \'^\\+?[1-9]\\d{1,14}$\')'
};
```

### Caching Strategy

#### Application-Level Caching
```typescript
// Redis caching for frequently accessed data
const cacheStrategy = {
  'customer_details': { ttl: '1h', invalidate_on: ['customer.updated'] },
  'active_rentals': { ttl: '5m', invalidate_on: ['rental.updated'] },
  'pricing_config': { ttl: '24h', invalidate_on: ['settings.updated'] },
  'dashboard_metrics': { ttl: '15m', compute_on: 'cache_miss' }
};

// Cache implementation
class CacheService {
  async get(key: string) {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }
  
  async set(key: string, value: any, ttl: string) {
    await redis.setex(key, parseTTL(ttl), JSON.stringify(value));
  }
  
  async invalidate(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

### Performance Optimization

#### Database Optimization
```sql
-- Partitioning for large tables
CREATE TABLE events (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  event_data JSONB
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE events_2024_01 PARTITION OF events 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes for common query patterns
CREATE INDEX idx_events_entity_id_created_at 
ON events(entity_id, created_at DESC);

CREATE INDEX idx_events_type_created_at 
ON events(event_type, created_at DESC);
```

#### Query Optimization
```typescript
// Eager loading to prevent N+1 queries
const customersWithRentals = await db.customers.findMany({
  include: {
    rentals: {
      include: {
        payments: true
      }
    }
  },
  where: {
    deleted_at: null
  }
});

// Pagination for large datasets
const paginatedRentals = await db.rentals.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { created_at: 'desc' }
});
```

---

## Development Roadmap

### Phase 1: Core Foundation (Weeks 1-4)
**Goal**: Basic CRUD operations and user authentication

#### Week 1-2: Project Setup
- [ ] Next.js project initialization with TypeScript
- [ ] Database schema design and migration setup
- [ ] Authentication system with role-based access
- [ ] Basic UI components with shadcn/ui
- [ ] Development environment configuration

#### Week 3-4: Core Entities
- [ ] Customer management (CRUD operations)
- [ ] Quote creation and management
- [ ] Basic dashboard with key metrics
- [ ] Form validation and error handling
- [ ] Unit test foundation

### Phase 2: Business Logic (Weeks 5-8)
**Goal**: Complete quote-to-rental workflow

#### Week 5-6: Quote Processing
- [ ] Quote generation from form submissions
- [ ] Email integration with Resend
- [ ] Quote acceptance workflow
- [ ] Agreement generation system

#### Week 7-8: Rental Management
- [ ] Rental creation from signed agreements
- [ ] Installation scheduling system
- [ ] Equipment inventory tracking
- [ ] Status management and updates

### Phase 3: Payments & Integration (Weeks 9-12)
**Goal**: Complete billing and external integrations

#### Week 9-10: Stripe Integration
- [ ] Customer creation in Stripe
- [ ] Subscription management
- [ ] Payment intent handling
- [ ] Webhook processing

#### Week 11-12: Document Management
- [ ] eSignatures.com integration
- [ ] Document generation and storage
- [ ] Signature workflow automation
- [ ] PDF generation for invoices

### Phase 4: Operations & Optimization (Weeks 13-16)
**Goal**: Production readiness and performance

#### Week 13-14: Advanced Features
- [ ] Calendar integration for scheduling
- [ ] Automated email workflows
- [ ] Reporting and analytics
- [ ] Mobile-responsive design

#### Week 15-16: Production Preparation
- [ ] Performance optimization
- [ ] Security audit and testing
- [ ] Backup and disaster recovery
- [ ] Monitoring and alerting setup

### Phase 5: Enhancement & Scale (Ongoing)
**Goal**: Continuous improvement based on usage

#### Advanced Features
- [ ] Customer portal for self-service
- [ ] Mobile app for technicians
- [ ] Advanced reporting and analytics
- [ ] Integration with accounting software
- [ ] Multi-location support
- [ ] API for third-party integrations

---

## Technical Stack

### Core Technologies

#### Backend Framework
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma ORM** for database management
- **PostgreSQL** as primary database
- **Redis** for caching and sessions

#### Frontend
- **React 19** with Server Components
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Zod** for schema validation

#### External Services
- **Stripe** for payment processing
- **eSignatures.com** for document signing
- **Resend** for email delivery
- **Vercel** for hosting and deployment
- **Supabase** for file storage (optional)

### Development Tools

#### Code Quality
- **ESLint** with TypeScript rules
- **Prettier** for code formatting
- **Husky** for git hooks
- **Jest** for unit testing
- **Playwright** for E2E testing

#### Database Management
- **Prisma Migrate** for schema management
- **Prisma Studio** for database exploration
- **pgAdmin** for production database management

#### Monitoring & Observability
- **Vercel Analytics** for performance monitoring
- **Sentry** for error tracking
- **PostHog** for user analytics (optional)
- **LogDNA** for log aggregation

### Deployment Strategy

#### Environment Configuration
```typescript
// Environment-specific settings
const config = {
  development: {
    database_url: 'postgresql://localhost:5432/sameday_dev',
    redis_url: 'redis://localhost:6379',
    stripe_public_key: 'pk_test_...',
    log_level: 'debug'
  },
  staging: {
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    stripe_public_key: 'pk_test_...',
    log_level: 'info'
  },
  production: {
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    stripe_public_key: 'pk_live_...',
    log_level: 'warn'
  }
};
```

#### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Deploy Admin App
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

#### Scaling Considerations
- **Database**: Read replicas for reporting queries
- **Application**: Horizontal scaling with load balancer
- **File Storage**: CDN for document delivery
- **Caching**: Redis cluster for high availability
- **Background Jobs**: Queue system for heavy operations

---

## Conclusion

This specification provides a comprehensive blueprint for building a simple, scalable admin application that will grow with the business. The architecture prioritizes:

1. **Developer Productivity**: Clear patterns and conventions
2. **Business Alignment**: Domain-driven design that mirrors operations
3. **Future Flexibility**: API-first approach and modular architecture
4. **Operational Excellence**: Robust monitoring and error handling
5. **User Experience**: Progressive disclosure and intuitive workflows

The phased development approach ensures rapid time-to-value while building a foundation for long-term growth. By following these specifications, the resulting application will efficiently manage the wheelchair ramp rental business while providing the flexibility to adapt to changing requirements.