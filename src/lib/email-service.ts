// Email service for sending quotes and notifications

interface QuoteEmailData {
  id: string;
  customer: {
    email: string;
    name: string;
  };
  serviceAddress: {
    street: string;
  };
  monthlyRate: number | null;
  installationFee: number | null;
  timelineNeeded: string;
  notes?: string | null;
}

export const emailService = {
  // Send quote email to customer
  async sendQuoteEmail(quote: QuoteEmailData): Promise<void> {
    // For now, we'll just log the email (you can integrate with Resend or other email service)
    console.log('📧 Sending quote email:', {
      to: quote.customer.email,
      subject: `Your Ramp Rental Quote #${quote.id.slice(-6)}`,
      pricing: {
        monthlyRate: quote.monthlyRate,
        installationFee: quote.installationFee,
        total: (quote.monthlyRate || 0) + (quote.installationFee || 0),
      },
      address: quote.serviceAddress.street,
      timeline: quote.timelineNeeded,
    });

    // TODO: Implement actual email sending with Resend
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  // Send assessment needed email to admin
  async sendAssessmentNeededEmail(quote: QuoteEmailData): Promise<void> {
    console.log('📧 Sending assessment needed notification:', {
      to: 'admin@samedayramps.com',
      subject: `New Quote Request Needs Assessment #${quote.id.slice(-6)}`,
      customer: quote.customer.name,
      address: quote.serviceAddress.street,
      notes: quote.notes,
    });

    // TODO: Implement actual email sending
    await new Promise(resolve => setTimeout(resolve, 100));
  },
};

// Export individual functions for easier importing
export const sendQuoteEmail = emailService.sendQuoteEmail;
export const sendAssessmentNeededEmail = emailService.sendAssessmentNeededEmail; 