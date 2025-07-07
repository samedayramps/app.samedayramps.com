import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { CustomerDetail } from '@/components/customers/customer-detail';
import { AppLayout } from '@/components/app-layout';

async function getCustomer(id: string) {
  try {
    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        quotes: {
          include: {
            serviceAddress: true,
            agreement: {
              include: {
                rental: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        rentals: {
          include: {
            payments: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!customer) {
      return null;
    }

    // Transform data for the client
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt.toISOString(),
      addresses: customer.addresses,
      quotes: customer.quotes.map(quote => ({
        id: quote.id,
        status: quote.status,
        monthlyRate: quote.monthlyRate,
        installationFee: quote.installationFee,
        createdAt: quote.createdAt.toISOString(),
        serviceAddress: quote.serviceAddress,
        agreement: quote.agreement ? {
          rental: quote.agreement.rental ? {
            id: quote.agreement.rental.id,
            monthlyRate: quote.agreement.rental.monthlyRate,
            status: quote.agreement.rental.status,
            startDate: quote.agreement.rental.startDate.toISOString(),
            endDate: quote.agreement.rental.endDate?.toISOString(),
            serviceAddress: {
              id: '',
              street: 'Address not loaded',
              city: '',
              state: '',
              zipCode: ''
            },
            payments: [],
            createdAt: quote.agreement.rental.createdAt.toISOString(),
          } : undefined
        } : undefined,
      })),
      rentals: customer.rentals.map(rental => ({
        id: rental.id,
        monthlyRate: rental.monthlyRate,
        status: rental.status,
        startDate: rental.startDate.toISOString(),
        endDate: rental.endDate?.toISOString(),
        createdAt: rental.createdAt.toISOString(),
        serviceAddress: {
          id: '',
          street: 'Address not loaded',
          city: '',
          state: '',
          zipCode: ''
        },
        payments: rental.payments.map(payment => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          type: payment.type,
          dueDate: payment.dueDate.toISOString(),
          paidDate: payment.paidDate?.toISOString(),
        })),
      })),
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <AppLayout title={customer.name}>
      <div className="p-4">
        <CustomerDetail customer={customer} />
      </div>
    </AppLayout>
  );
} 