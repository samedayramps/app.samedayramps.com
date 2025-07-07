import { QuoteList } from '@/components/quotes/quote-list';
import { AppLayout } from '@/components/app-layout';
import { db } from '@/lib/db';

async function getQuotes() {
  try {
    const quotes = await db.quote.findMany({
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
      take: 50 // Limit for performance
    });

    // Transform data for the client
    return quotes.map(quote => ({
      id: quote.id,
      customerId: quote.customerId,
      serviceAddressId: quote.serviceAddressId,
      rampHeight: quote.rampHeight,
      timelineNeeded: quote.timelineNeeded,
      monthlyRate: quote.monthlyRate,
      installationFee: quote.installationFee,
      status: quote.status,
      notes: quote.notes || undefined,
      createdAt: quote.createdAt.toISOString(),
      customer: {
        name: quote.customer.name,
        email: quote.customer.email,
        phone: quote.customer.phone,
      },
      serviceAddress: {
        street: quote.serviceAddress.street,
        city: quote.serviceAddress.city,
        state: quote.serviceAddress.state,
        zipCode: quote.serviceAddress.zipCode,
      },
      agreement: quote.agreement ? {
        rental: quote.agreement.rental ? {
          id: quote.agreement.rental.id,
          status: quote.agreement.rental.status,
        } : undefined
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <AppLayout title="Quotes">
      <div className="p-4">
        <QuoteList quotes={quotes} />
      </div>
    </AppLayout>
  );
} 