'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/status-utils';
import { typography, spacing, icons, themes, layout, cx } from '@/lib/design-system';
import { Search, Plus, Filter, MapPin, User, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Quote {
  id: string;
  customerId: string;
  serviceAddressId: string;
  rampHeight: number;
  timelineNeeded: 'ASAP' | 'WITHIN_3_DAYS' | 'WITHIN_1_WEEK' | 'FLEXIBLE';
  monthlyRate: number;
  installationFee: number;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  notes?: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  serviceAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  agreement?: {
    rental?: {
      id: string;
      status: 'SCHEDULED' | 'ACTIVE' | 'ENDING' | 'COMPLETED' | 'CANCELLED';
    };
  };
}

interface QuoteListProps {
  quotes: Quote[];
}

export function QuoteList({ quotes }: QuoteListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timelineFilter, setTimelineFilter] = useState('all');

  const handleNewQuote = () => {
    router.push('/quotes/new');
  };

  const handleViewQuote = (quoteId: string) => {
    router.push(`/quotes/${quoteId}`);
  };

  const handleSendQuote = async (quoteId: string) => {
    try {
      await fetch(`/api/quotes/${quoteId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'SENT' }),
      });
      router.refresh();
    } catch (error) {
      console.error('Error sending quote:', error);
    }
  };

  const handleFollowUp = (quoteId: string) => {
    // Implement follow-up logic (email, etc.)
    console.log('Follow up for quote:', quoteId);
  };

  const handleViewRental = (quoteId: string) => {
    router.push(`/rentals?quote=${quoteId}`);
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.serviceAddress.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.serviceAddress.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    const matchesTimeline = timelineFilter === 'all' || quote.timelineNeeded === timelineFilter;
    
    return matchesSearch && matchesStatus && matchesTimeline;
  });

  return (
    <div className={cx("flex flex-col", spacing.gap.xl)}>
      {/* Header with Actions */}
      <div className={cx("flex flex-col sm:flex-row sm:items-center sm:justify-between", spacing.gap.md)}>
        <div>
          <h1 className={typography.heading.h1}>
            Quotes
          </h1>
          <p className={cx(typography.body.medium, "text-gray-600 dark:text-gray-400")}>
            Manage quotes and convert them to rentals
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleNewQuote}>
          <Plus className={cx(icons.sm, "mr-2")} />
          New Quote
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className={spacing.component.md}>
          <div className={cx("flex flex-col", spacing.gap.md)}>
            <div className="relative">
              <Search className={cx("absolute left-3 top-1/2 transform -translate-y-1/2", icons.sm, "text-gray-500")} />
              <Input
                placeholder="Search customers, addresses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className={cx("flex", spacing.gap.sm)}>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <div className={cx("flex items-center", spacing.gap.sm)}>
                    <Filter className={icons.sm} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timelineFilter} onValueChange={setTimelineFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timelines</SelectItem>
                  <SelectItem value="ASAP">ASAP</SelectItem>
                  <SelectItem value="WITHIN_3_DAYS">Within 3 Days</SelectItem>
                  <SelectItem value="WITHIN_1_WEEK">Within 1 Week</SelectItem>
                  <SelectItem value="FLEXIBLE">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <div className={cx("flex flex-col", spacing.gap.lg)}>
        {filteredQuotes.length === 0 ? (
          <Card>
            <CardContent className={cx(spacing.component.lg, "text-center")}>
              <Search className={cx("mx-auto mb-4", icons.xl, "text-gray-400")} />
              <p className={cx(typography.body.medium, "text-gray-500")}>No quotes found</p>
              <Button className="mt-4" onClick={handleNewQuote}>
                Create First Quote
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredQuotes.map((quote) => (
            <Card key={quote.id} className={themes.card.interactive}>
              <CardHeader className={spacing.component.sm}>
                <div className={layout.flex.between}>
                  <CardTitle className={typography.heading.h3}>
                    Quote #{quote.id.slice(-6)}
                  </CardTitle>
                  <StatusBadge status={quote.status} />
                </div>
                <CardDescription className={cx("flex items-center", spacing.gap.sm)}>
                  <User className={icons.sm} />
                  <span className={typography.body.medium}>{quote.customer.name}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className={cx(spacing.component.sm, "pt-0")}>
                <div className={cx("flex flex-col", spacing.gap.sm)}>
                  {/* Address & Pricing */}
                  <div className={cx("flex items-center justify-between", typography.body.medium)}>
                    <div className={cx("flex items-center flex-1 min-w-0", spacing.gap.sm)}>
                      <MapPin className={cx(icons.sm, "text-gray-500 flex-shrink-0")} />
                      <span className="truncate">
                        {quote.serviceAddress.street}, {quote.serviceAddress.city}
                      </span>
                    </div>
                    <div className={cx("flex items-center ml-2 font-medium text-green-600", spacing.gap.xs)}>
                      <DollarSign className={icons.sm} />
                      <span>{formatCurrency(quote.monthlyRate + quote.installationFee)}</span>
                    </div>
                  </div>

                  {/* Quote Details */}
                  <div className={cx("flex items-center justify-between", typography.body.medium, "text-gray-600")}>
                    <span>{quote.rampHeight}&quot; ramp • {quote.timelineNeeded.replace('_', ' ').toLowerCase()}</span>
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>

                  {/* Notes */}
                  {quote.notes && (
                    <p className={cx(typography.body.small, "text-gray-600 bg-gray-50 p-2 rounded")}>
                      {quote.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className={cx("flex pt-2", spacing.gap.sm)}>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleViewQuote(quote.id)}
                    >
                      View
                    </Button>
                    {quote.status === 'PENDING' && (
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSendQuote(quote.id)}
                      >
                        Send
                      </Button>
                    )}
                    {quote.status === 'SENT' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleFollowUp(quote.id)}
                      >
                        Follow Up
                      </Button>
                    )}
                    {quote.status === 'ACCEPTED' && quote.agreement?.rental && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleViewRental(quote.id)}
                      >
                        View Rental
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {quotes.length >= 50 && (
        <div className={cx("text-center", spacing.component.lg)}>
          <Button variant="outline" onClick={() => router.refresh()}>
            Load More Quotes
          </Button>
        </div>
      )}
    </div>
  );
} 