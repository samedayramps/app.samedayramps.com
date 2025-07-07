import { WebsiteSubmissions } from '@/components/website-submissions/website-submissions';
import { AppLayout } from '@/components/app-layout';
import { db } from '@/lib/db';

async function getWebsiteSubmissions() {
  try {
    // Get quotes from website submissions (contains 'Source: website' in notes)
    const submissions = await db.quote.findMany({
      where: {
        notes: {
          contains: 'Source: website'
        }
      },
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
      take: 100 // Get recent submissions
    });

    // Transform data for the client
    return submissions.map(submission => ({
      id: submission.id,
      customerId: submission.customerId,
      serviceAddressId: submission.serviceAddressId,
      rampHeight: submission.rampHeight,
      timelineNeeded: submission.timelineNeeded,
      monthlyRate: submission.monthlyRate,
      installationFee: submission.installationFee,
      status: submission.status,
      notes: submission.notes || undefined,
      createdAt: submission.createdAt.toISOString(),
      customer: {
        name: submission.customer.name,
        email: submission.customer.email,
        phone: submission.customer.phone,
      },
      serviceAddress: {
        street: submission.serviceAddress.street,
        city: submission.serviceAddress.city,
        state: submission.serviceAddress.state,
        zipCode: submission.serviceAddress.zipCode,
      },
      agreement: submission.agreement ? {
        rental: submission.agreement.rental ? {
          id: submission.agreement.rental.id,
          status: submission.agreement.rental.status,
        } : undefined
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching website submissions:', error);
    return [];
  }
}

export default async function WebsiteSubmissionsPage() {
  const submissions = await getWebsiteSubmissions();

  return (
    <AppLayout title="Website Submissions">
      <div className="p-4">
        <WebsiteSubmissions submissions={submissions} />
      </div>
    </AppLayout>
  );
} 