'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/status-utils';
import { typography, spacing, icons, themes, layout, cx } from '@/lib/design-system';
import { Clock, AlertTriangle, CheckCircle, MapPin, User, DollarSign, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Submission {
  id: string;
  customerId: string;
  serviceAddressId: string;
  rampHeight: number | null;
  timelineNeeded: 'ASAP' | 'WITHIN_3_DAYS' | 'WITHIN_1_WEEK' | 'FLEXIBLE';
  monthlyRate: number | null;
  installationFee: number | null;
  status: 'NEEDS_ASSESSMENT' | 'PENDING' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
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

interface WebsiteSubmissionsProps {
  submissions: Submission[];
}

export function WebsiteSubmissions({ submissions }: WebsiteSubmissionsProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'needs-assessment' | 'ready-to-send' | 'completed'>('needs-assessment');

  // Separate submissions by status
  const needsAssessment = submissions.filter(s => s.status === 'NEEDS_ASSESSMENT');
  const readyToSend = submissions.filter(s => s.status === 'PENDING');
  const completed = submissions.filter(s => ['SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED'].includes(s.status));

  const handleCompleteAssessment = (submissionId: string) => {
    router.push(`/quotes/${submissionId}`);
  };

  const handleSendQuote = async (submissionId: string) => {
    try {
      await fetch(`/api/quotes/${submissionId}/status`, {
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

  const handleContactCustomer = (customer: Submission['customer']) => {
    window.location.href = `tel:${customer.phone}`;
  };

  const handleEmailCustomer = (customer: Submission['customer']) => {
    window.location.href = `mailto:${customer.email}`;
  };

  const renderSubmissionCard = (submission: Submission) => (
    <Card key={submission.id} className={themes.card.interactive}>
      <CardHeader className={spacing.component.sm}>
        <div className={layout.flex.between}>
          <div>
            <CardTitle className={typography.heading.h3}>
              #{submission.id.slice(-6)}
            </CardTitle>
            <CardDescription className={cx("flex items-center mt-1", spacing.gap.sm)}>
              <User className={icons.sm} />
              <span className={typography.body.medium}>{submission.customer.name}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <StatusBadge status={submission.status} />
            <p className={cx(typography.body.small, "text-gray-600 mt-1")}>
              {formatDate(submission.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={cx(spacing.component.sm, "pt-0")}>
        <div className={cx("flex flex-col", spacing.gap.sm)}>
          {/* Address */}
          <div className={cx("flex items-center", spacing.gap.sm)}>
            <MapPin className={cx(icons.sm, "text-gray-500 flex-shrink-0")} />
            <span className={cx(typography.body.medium, "truncate")}>
              {submission.serviceAddress.street}, {submission.serviceAddress.city}
            </span>
          </div>

          {/* Timeline & Requirements */}
          <div className={cx("flex items-center justify-between", typography.body.small, "text-gray-600")}>
            <div className={cx("flex items-center", spacing.gap.xs)}>
              <Clock className={icons.sm} />
              <span>{submission.timelineNeeded.replace('_', ' ').toLowerCase()}</span>
            </div>
                         {submission.rampHeight ? (
               <span>{submission.rampHeight}&quot; ramp height</span>
             ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Height TBD
              </Badge>
            )}
          </div>

          {/* Pricing */}
          {submission.monthlyRate && submission.installationFee ? (
            <div className={cx("flex items-center justify-between p-2 bg-green-50 rounded", typography.body.small)}>
              <span className="text-green-800">Pricing calculated</span>
              <div className={cx("flex items-center", spacing.gap.xs)}>
                <DollarSign className={cx(icons.sm, "text-green-600")} />
                <span className="font-medium text-green-600">
                  {formatCurrency(submission.monthlyRate + submission.installationFee)}
                </span>
              </div>
            </div>
          ) : (
            <div className={cx("flex items-center justify-between p-2 bg-orange-50 rounded", typography.body.small)}>
              <div className={cx("flex items-center", spacing.gap.xs)}>
                <AlertTriangle className={cx(icons.sm, "text-orange-600")} />
                <span className="text-orange-800">Pricing pending assessment</span>
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {submission.notes && (
            <div className={cx("p-2 bg-gray-50 rounded", typography.body.small)}>
              <p className="text-gray-700 line-clamp-2">
                {submission.notes.replace(/Source: website.*$/gm, '').trim()}
              </p>
            </div>
          )}

          {/* Contact Actions */}
          <div className={cx("flex", spacing.gap.sm)}>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleContactCustomer(submission.customer)}
            >
              <Phone className={cx(icons.sm, "mr-2")} />
              Call
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => handleEmailCustomer(submission.customer)}
            >
              <Mail className={cx(icons.sm, "mr-2")} />
              Email
            </Button>
          </div>

          {/* Primary Actions */}
          <div className={cx("flex", spacing.gap.sm)}>
            {submission.status === 'NEEDS_ASSESSMENT' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleCompleteAssessment(submission.id)}
              >
                <AlertTriangle className={cx(icons.sm, "mr-2")} />
                Complete Assessment
              </Button>
            )}
            {submission.status === 'PENDING' && (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleSendQuote(submission.id)}
              >
                <CheckCircle className={cx(icons.sm, "mr-2")} />
                Send Quote
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={cx("flex flex-col", spacing.gap.xl)}>
      {/* Header */}
      <div>
        <h1 className={typography.heading.h1}>
          Website Submissions
        </h1>
        <p className={cx(typography.body.medium, "text-gray-600 dark:text-gray-400")}>
          Manage quote requests from your public website
        </p>
      </div>

      {/* Summary Stats */}
      <div className={cx("grid grid-cols-3 gap-4")}>
        <Card className={selectedTab === 'needs-assessment' ? 'ring-2 ring-orange-200' : ''}>
          <CardContent className={cx(spacing.component.md, "text-center")}>
            <div className={cx("flex items-center justify-center mb-2", spacing.gap.sm)}>
              <AlertTriangle className={cx(icons.md, "text-orange-600")} />
              <h3 className={cx(typography.heading.h3, "text-orange-600")}>
                {needsAssessment.length}
              </h3>
            </div>
            <p className={cx(typography.body.medium, "text-gray-600")}>Need Assessment</p>
            <Button 
              variant={selectedTab === 'needs-assessment' ? 'default' : 'outline'} 
              size="sm" 
              className="mt-2"
              onClick={() => setSelectedTab('needs-assessment')}
            >
              Review
            </Button>
          </CardContent>
        </Card>

        <Card className={selectedTab === 'ready-to-send' ? 'ring-2 ring-green-200' : ''}>
          <CardContent className={cx(spacing.component.md, "text-center")}>
            <div className={cx("flex items-center justify-center mb-2", spacing.gap.sm)}>
              <CheckCircle className={cx(icons.md, "text-green-600")} />
              <h3 className={cx(typography.heading.h3, "text-green-600")}>
                {readyToSend.length}
              </h3>
            </div>
            <p className={cx(typography.body.medium, "text-gray-600")}>Ready to Send</p>
            <Button 
              variant={selectedTab === 'ready-to-send' ? 'default' : 'outline'} 
              size="sm" 
              className="mt-2"
              onClick={() => setSelectedTab('ready-to-send')}
            >
              Send
            </Button>
          </CardContent>
        </Card>

        <Card className={selectedTab === 'completed' ? 'ring-2 ring-blue-200' : ''}>
          <CardContent className={cx(spacing.component.md, "text-center")}>
            <div className={cx("flex items-center justify-center mb-2", spacing.gap.sm)}>
              <Clock className={cx(icons.md, "text-blue-600")} />
              <h3 className={cx(typography.heading.h3, "text-blue-600")}>
                {completed.length}
              </h3>
            </div>
            <p className={cx(typography.body.medium, "text-gray-600")}>Completed</p>
            <Button 
              variant={selectedTab === 'completed' ? 'default' : 'outline'} 
              size="sm" 
              className="mt-2"
              onClick={() => setSelectedTab('completed')}
            >
              View
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Content Based on Selected Tab */}
      <div className={cx("flex flex-col", spacing.gap.lg)}>
        {selectedTab === 'needs-assessment' && (
          <>
            <div className={cx("flex items-center", spacing.gap.sm)}>
              <AlertTriangle className={cx(icons.md, "text-orange-600")} />
              <h2 className={typography.heading.h2}>Submissions Needing Assessment</h2>
              <Badge variant="outline" className="ml-auto">
                {needsAssessment.length} pending
              </Badge>
            </div>
            {needsAssessment.length === 0 ? (
              <Card>
                <CardContent className={cx(spacing.component.lg, "text-center")}>
                  <CheckCircle className={cx("mx-auto mb-4", icons.xl, "text-green-400")} />
                  <p className={cx(typography.body.medium, "text-gray-500")}>
                    No submissions need assessment
                  </p>
                </CardContent>
              </Card>
            ) : (
              needsAssessment.map(renderSubmissionCard)
            )}
          </>
        )}

        {selectedTab === 'ready-to-send' && (
          <>
            <div className={cx("flex items-center", spacing.gap.sm)}>
              <CheckCircle className={cx(icons.md, "text-green-600")} />
              <h2 className={typography.heading.h2}>Quotes Ready to Send</h2>
              <Badge variant="outline" className="ml-auto">
                {readyToSend.length} ready
              </Badge>
            </div>
            {readyToSend.length === 0 ? (
              <Card>
                <CardContent className={cx(spacing.component.lg, "text-center")}>
                  <AlertTriangle className={cx("mx-auto mb-4", icons.xl, "text-orange-400")} />
                  <p className={cx(typography.body.medium, "text-gray-500")}>
                    No quotes ready to send
                  </p>
                </CardContent>
              </Card>
            ) : (
              readyToSend.map(renderSubmissionCard)
            )}
          </>
        )}

        {selectedTab === 'completed' && (
          <>
            <div className={cx("flex items-center", spacing.gap.sm)}>
              <Clock className={cx(icons.md, "text-blue-600")} />
              <h2 className={typography.heading.h2}>Completed Submissions</h2>
              <Badge variant="outline" className="ml-auto">
                {completed.length} completed
              </Badge>
            </div>
            {completed.length === 0 ? (
              <Card>
                <CardContent className={cx(spacing.component.lg, "text-center")}>
                  <Clock className={cx("mx-auto mb-4", icons.xl, "text-gray-400")} />
                  <p className={cx(typography.body.medium, "text-gray-500")}>
                    No completed submissions yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              completed.map(renderSubmissionCard)
            )}
          </>
        )}
      </div>
    </div>
  );
} 