import { AppLayout } from "@/components/app-layout";
import { CustomerList } from "@/components/customers/customer-list";
import { db } from "@/lib/db";

// Server Component - handles data fetching
async function getCustomers() {
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
    });

    // Transform data on the server
    return customers.map(customer => {
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
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <AppLayout title="Customers">
      <div className="p-4">
        <CustomerList customers={customers} />
      </div>
    </AppLayout>
  );
} 