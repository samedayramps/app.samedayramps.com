'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { 
  formatPhoneNumber, 
  formatCurrency
} from "@/lib/status-utils";
import { typography, spacing, icons, themes, cx } from "@/lib/design-system";
import { cn } from "@/lib/utils";
import { Phone, Mail, MapPin, User } from "lucide-react";

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    status: string;
    rentalStatus?: string;
    nextPayment?: string;
    lastActivity?: string;
    monthlyRate?: number;
  };
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

export function CustomerCard({ 
  customer, 
  onClick, 
  showActions = true,
  className 
}: CustomerCardProps) {
  return (
    <Card 
      className={cn(themes.card.interactive, className)}
      onClick={onClick}
    >
      <CardHeader className={spacing.component.sm}>
        <div className="flex items-center justify-between">
          <CardTitle className={typography.heading.h3}>
            {customer.name}
          </CardTitle>
          <StatusBadge status={customer.status} />
        </div>
        <CardDescription className={cx("flex items-center", spacing.gap.sm)}>
          <User className={icons.sm} />
          <span className={typography.body.medium}>{customer.email}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className={cx(spacing.component.sm, "pt-0")}>
        <div className={spacing.gap.sm}>
          {/* Contact & Address */}
          <div className={cx("flex items-center justify-between", typography.body.medium)}>
            <div className={cx("flex items-center", spacing.gap.sm)}>
              <Phone className={cx(icons.sm, "text-gray-500")} />
              <span>{formatPhoneNumber(customer.phone)}</span>
            </div>
            {customer.monthlyRate && customer.monthlyRate > 0 ? (
              <span className={cx(typography.body.medium, "font-medium text-green-600")}>
                {formatCurrency(customer.monthlyRate)}/mo
              </span>
            ) : null}
          </div>

          {customer.address && (
            <div className={cx("flex items-center", spacing.gap.sm, typography.body.medium, "text-gray-600")}>
              <MapPin className={cx(icons.sm, "text-gray-500")} />
              <span className="truncate">{customer.address}</span>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className={cx("flex", spacing.gap.sm, "pt-2")}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${customer.phone}`;
                }}
              >
                <Phone className={cx(icons.xs, "mr-1")} />
                Call
              </Button>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${customer.email}`;
                }}
              >
                <Mail className={cx(icons.xs, "mr-1")} />
                Email
              </Button>
              
              {customer.address && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(customer.address!)}`);
                  }}
                >
                  <MapPin className={cx(icons.xs, "mr-1")} />
                  Map
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 