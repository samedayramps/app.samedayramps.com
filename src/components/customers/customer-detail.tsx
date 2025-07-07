'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/shared/status-badge';
import { Phone, Mail, MapPin, DollarSign, FileText, Edit, Plus } from 'lucide-react';
import { formatCurrency, formatDate, formatPhoneNumber } from '@/lib/status-utils';
import { typography, spacing, icons, themes, layout, cx } from '@/lib/design-system';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  dueDate: string;
  paidDate?: string;
  type: 'INSTALLATION_FEE' | 'MONTHLY_RENT' | 'LATE_FEE' | 'DAMAGE_FEE';
}

interface Rental {
  id: string;
  monthlyRate: number;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDING' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  serviceAddress: Address;
  payments: Payment[];
  createdAt: string;
}

interface Quote {
  id: string;
  status: 'NEEDS_ASSESSMENT' | 'PENDING' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  monthlyRate: number | null;
  installationFee: number | null;
  serviceAddress: Address;
  createdAt: string;
  agreement?: {
    rental?: Rental;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  quotes: Quote[];
  rentals: Rental[];
  createdAt: string;
}

interface CustomerDetailProps {
  customer: Customer;
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const router = useRouter();
  
  const handleEdit = () => {
    router.push(`/customers/${customer.id}/edit`);
  };

  const handleCall = () => {
    window.location.href = `tel:${customer.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${customer.email}`;
  };

  const handleNewQuote = () => {
    router.push(`/quotes/new?customer=${customer.id}`);
  };

  const handleNewRental = () => {
    router.push(`/rentals/new?customer=${customer.id}`);
  };

  const handleViewQuote = (quoteId: string) => {
    router.push(`/quotes/${quoteId}`);
  };

  const handleViewRental = (rentalId: string) => {
    router.push(`/rentals/${rentalId}`);
  };

  return (
    <div className={spacing.gap.xl}>
      {/* Header with Actions */}
      <div className={cx(layout.flex.between, "flex-col sm:flex-row gap-4")}>
        <div>
          <h1 className={typography.heading.h1}>
            {customer.name}
          </h1>
          <p className={cx(typography.body.medium, "text-gray-600")}>
            {formatPhoneNumber(customer.phone)}
          </p>
        </div>
        <Button size="sm" onClick={handleEdit}>
          <Edit className={cx(icons.sm, "mr-2")} />
          Edit
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className={cx("flex", spacing.gap.sm)}>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleCall}>
          <Phone className={cx(icons.sm, "mr-2")} />
          Call
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleEmail}>
          <Mail className={cx(icons.sm, "mr-2")} />
          Email
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleNewQuote}>
          <Plus className={cx(icons.sm, "mr-2")} />
          Quote
        </Button>
      </div>

      {/* Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={spacing.gap.md}>
          {/* Contact Information */}
          <Card className={themes.card.default}>
            <CardHeader className={spacing.component.md}>
              <CardTitle className={typography.heading.h3}>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className={cx(spacing.component.md, "pt-0")}>
              <div className={spacing.gap.md}>
                <div className={cx("flex items-center", spacing.gap.sm)}>
                  <Mail className={cx(icons.md, "text-gray-500")} />
                  <span className={typography.body.medium}>{customer.email}</span>
                </div>
                <div className={cx("flex items-center", spacing.gap.sm)}>
                  <Phone className={cx(icons.md, "text-gray-500")} />
                  <span className={typography.body.medium}>{formatPhoneNumber(customer.phone)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className={themes.card.default}>
            <CardHeader className={spacing.component.md}>
              <CardTitle className={typography.heading.h3}>Addresses</CardTitle>
            </CardHeader>
            <CardContent className={cx(spacing.component.md, "pt-0")}>
              {customer.addresses.length === 0 ? (
                <p className={cx(typography.body.medium, "text-gray-500")}>No addresses on file</p>
              ) : (
                <div className={spacing.gap.md}>
                  {customer.addresses.map((address) => (
                    <div key={address.id} className={cx("flex items-start", spacing.gap.sm)}>
                      <MapPin className={cx(icons.md, "text-gray-500 mt-0.5")} />
                      <div>
                        <p className={cx(typography.body.medium, "font-medium")}>{address.street}</p>
                        <p className={cx(typography.body.small, "text-gray-600")}>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className={themes.card.default}>
            <CardHeader className={spacing.component.md}>
              <CardTitle className={typography.heading.h3}>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className={cx(spacing.component.md, "pt-0")}>
              <div className={spacing.gap.md}>
                {customer.quotes.slice(0, 3).map((quote) => (
                  <div key={quote.id} className={layout.flex.between}>
                    <div className={cx("flex items-center", spacing.gap.sm)}>
                      <FileText className={cx(icons.sm, "text-gray-500")} />
                      <div>
                        <p className={cx(typography.body.medium, "font-medium")}>Quote #{quote.id.slice(-6)}</p>
                        <p className={cx(typography.body.small, "text-gray-600")}>{formatDate(quote.createdAt)}</p>
                      </div>
                    </div>
                    <StatusBadge status={quote.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentals" className={spacing.gap.md}>
          {customer.rentals.length === 0 ? (
            <Card className={themes.card.default}>
              <CardContent className={cx(spacing.component.lg, "text-center")}>
                <p className={cx(typography.body.medium, "text-gray-500")}>No rentals found</p>
                <Button className="mt-4" onClick={handleNewRental}>
                  Create New Rental
                </Button>
              </CardContent>
            </Card>
          ) : (
            customer.rentals.map((rental) => (
              <Card key={rental.id} className={themes.card.interactive}>
                <CardHeader className={spacing.component.sm}>
                  <div className={layout.flex.between}>
                    <CardTitle className={typography.heading.h3}>
                      Rental #{rental.id.slice(-6)}
                    </CardTitle>
                    <StatusBadge status={rental.status} />
                  </div>
                  <CardDescription className={typography.body.medium}>
                    {rental.serviceAddress.street}, {rental.serviceAddress.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className={cx(spacing.component.sm, "pt-0")}>
                  <div className={cx("grid grid-cols-2 gap-4", typography.body.small)}>
                    <div>
                      <p className="text-gray-600">Monthly Rate</p>
                      <p className={cx(typography.body.medium, "font-medium")}>{formatCurrency(rental.monthlyRate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className={cx(typography.body.medium, "font-medium")}>{formatDate(rental.startDate)}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => handleViewRental(rental.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="quotes" className={spacing.gap.md}>
          {customer.quotes.length === 0 ? (
            <Card className={themes.card.default}>
              <CardContent className={cx(spacing.component.lg, "text-center")}>
                <p className={cx(typography.body.medium, "text-gray-500")}>No quotes found</p>
                <Button className="mt-4" onClick={handleNewQuote}>
                  Create New Quote
                </Button>
              </CardContent>
            </Card>
          ) : (
            customer.quotes.map((quote) => (
              <Card key={quote.id} className={themes.card.interactive}>
                <CardHeader className={spacing.component.sm}>
                  <div className={layout.flex.between}>
                    <CardTitle className={typography.heading.h3}>
                      Quote #{quote.id.slice(-6)}
                    </CardTitle>
                    <StatusBadge status={quote.status} />
                  </div>
                  <CardDescription className={typography.body.medium}>
                    {quote.serviceAddress.street}, {quote.serviceAddress.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className={cx(spacing.component.sm, "pt-0")}>
                  <div className={cx("grid grid-cols-2 gap-4", typography.body.small)}>
                    <div>
                      <p className="text-gray-600">Monthly Rate</p>
                      <p className={cx(typography.body.medium, "font-medium")}>
                        {quote.monthlyRate ? formatCurrency(quote.monthlyRate) : 'Assessment needed'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Installation Fee</p>
                      <p className={cx(typography.body.medium, "font-medium")}>
                        {quote.installationFee ? formatCurrency(quote.installationFee) : 'Assessment needed'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => handleViewQuote(quote.id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="billing" className={spacing.gap.md}>
          {customer.rentals.length === 0 ? (
            <Card className={themes.card.default}>
              <CardContent className={cx(spacing.component.lg, "text-center")}>
                <p className={cx(typography.body.medium, "text-gray-500")}>No billing history found</p>
              </CardContent>
            </Card>
          ) : (
            <div className={spacing.gap.md}>
              {customer.rentals.map((rental) => (
                <Card key={rental.id} className={themes.card.default}>
                  <CardHeader className={spacing.component.sm}>
                    <CardTitle className={typography.heading.h3}>
                      Rental #{rental.id.slice(-6)}
                    </CardTitle>
                    <CardDescription className={typography.body.medium}>
                      {rental.serviceAddress.street}, {rental.serviceAddress.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className={cx(spacing.component.sm, "pt-0")}>
                    {rental.payments.length === 0 ? (
                      <p className={cx(typography.body.medium, "text-gray-500")}>No payments found</p>
                    ) : (
                      <div className={spacing.gap.md}>
                        {rental.payments.map((payment) => (
                          <div key={payment.id} className={layout.flex.between}>
                            <div className={cx("flex items-center", spacing.gap.sm)}>
                              <DollarSign className={cx(icons.sm, "text-gray-500")} />
                              <div>
                                <p className={cx(typography.body.medium, "font-medium")}>{formatCurrency(payment.amount)}</p>
                                <p className={cx(typography.body.small, "text-gray-600")}>
                                  {payment.type.replace('_', ' ').toLowerCase()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={payment.status} />
                              <p className={cx(typography.body.small, "text-gray-600 mt-1")}>
                                Due {formatDate(payment.dueDate)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 