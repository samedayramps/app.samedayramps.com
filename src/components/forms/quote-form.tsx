'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/status-utils';
import { typography, spacing, icons, themes, layout, cx } from '@/lib/design-system';
import { Loader2, Calculator, DollarSign, Home, Clock, User } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface QuoteFormProps {
  customer?: Customer;
  onSubmit: (data: QuoteFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<QuoteFormData>;
  isSubmitting?: boolean;
}

interface QuoteFormData {
  customerId: string;
  serviceAddressId: string;
  rampHeight: number;
  timelineNeeded: 'ASAP' | 'WITHIN_3_DAYS' | 'WITHIN_1_WEEK' | 'FLEXIBLE';
  serviceType: 'POST_SURGERY' | 'AGING_IN_PLACE' | 'TRANSITIONAL_HOSPICE';
  monthlyRate: number;
  installationFee: number;
  estimatedDuration: string;
  notes: string;
}

const TIMELINE_OPTIONS = [
  { value: 'ASAP', label: 'ASAP (Within 24 hours)' },
  { value: 'WITHIN_3_DAYS', label: 'Within 3 days' },
  { value: 'WITHIN_1_WEEK', label: 'Within 1 week' },
  { value: 'FLEXIBLE', label: 'Flexible timing' }
];

const SERVICE_TYPE_OPTIONS = [
  { value: 'POST_SURGERY', label: 'Post-Surgery Recovery' },
  { value: 'AGING_IN_PLACE', label: 'Aging in Place' },
  { value: 'TRANSITIONAL_HOSPICE', label: 'Transitional/Hospice' }
];

const DURATION_OPTIONS = [
  { value: '1-3 months', label: '1-3 months' },
  { value: '3-6 months', label: '3-6 months' },
  { value: '6-12 months', label: '6-12 months' },
  { value: '12+ months', label: '12+ months' },
  { value: 'Indefinite', label: 'Indefinite' }
];

export function QuoteForm({ customer, onSubmit, onCancel, initialData, isSubmitting = false }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    customerId: customer?.id || '',
    serviceAddressId: '',
    rampHeight: 24,
    timelineNeeded: 'WITHIN_3_DAYS',
    serviceType: 'POST_SURGERY',
    monthlyRate: 0,
    installationFee: 0,
    estimatedDuration: '6-12 months',
    notes: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<Record<keyof QuoteFormData, string>>>({});

  // Pricing calculation based on ramp height
  const calculatePricing = (height: number) => {
    const BASE_MONTHLY = 125;
    const PER_INCH_MONTHLY = 6;
    const BASE_INSTALLATION = 75;
    const PER_INCH_INSTALLATION = 2;

    const monthly = BASE_MONTHLY + (height * PER_INCH_MONTHLY);
    const installation = BASE_INSTALLATION + (height * PER_INCH_INSTALLATION);

    return { monthly, installation };
  };

  const updateField = (field: keyof QuoteFormData, value: string | number) => {
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Auto-calculate pricing when height changes
    if (field === 'rampHeight' && typeof value === 'number') {
      const pricing = calculatePricing(value);
      setFormData(prev => ({
        ...prev,
        rampHeight: value,
        monthlyRate: pricing.monthly,
        installationFee: pricing.installation
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof QuoteFormData, string>> = {};

    if (!formData.customerId) newErrors.customerId = 'Customer is required';
    if (!formData.serviceAddressId) newErrors.serviceAddressId = 'Service address is required';
    if (!formData.rampHeight || formData.rampHeight <= 0) newErrors.rampHeight = 'Ramp height must be greater than 0';
    if (!formData.timelineNeeded) newErrors.timelineNeeded = 'Timeline is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const pricing = calculatePricing(formData.rampHeight);
  const totalFirstMonth = pricing.monthly + pricing.installation;

  return (
    <div className={cx("min-h-screen bg-gray-50", spacing.component.md)}>
      <Card className={cx(themes.card.default, "max-w-2xl mx-auto")}>
        <CardHeader className={spacing.component.lg}>
          <CardTitle className={cx(typography.heading.h1, "flex items-center", spacing.gap.sm)}>
            <Calculator className={icons.md} />
            Create Quote
          </CardTitle>
          <CardDescription className={typography.body.medium}>
            Generate a rental quote for wheelchair ramp installation
          </CardDescription>
        </CardHeader>
        
        <CardContent className={spacing.component.lg}>
          <form onSubmit={handleSubmit} className={spacing.gap.xl}>
            {/* Customer Information */}
            <div className={spacing.gap.md}>
              <div className={cx("flex items-center mb-4", spacing.gap.sm)}>
                <User className={cx(icons.sm, "text-gray-500")} />
                <h3 className={typography.heading.h3}>Customer Information</h3>
              </div>
              
              {customer ? (
                <div className={cx("p-4 bg-gray-50 rounded-lg", layout.flex.between)}>
                  <div>
                    <p className={cx(typography.body.medium, "font-medium")}>{customer.name}</p>
                    <p className={cx(typography.body.small, "text-gray-600")}>{customer.email}</p>
                    <p className={cx(typography.body.small, "text-gray-600")}>{customer.phone}</p>
                  </div>
                  <Badge variant="secondary">Selected</Badge>
                </div>
              ) : (
                <div className={spacing.gap.sm}>
                  <Label htmlFor="customer">Customer *</Label>
                  <Input
                    id="customer"
                    placeholder="Search for customer..."
                    disabled
                  />
                  <p className={cx(typography.body.small, "text-gray-500")}>Customer selection will be implemented</p>
                </div>
              )}
            </div>

            {/* Service Address */}
            <div className={spacing.gap.md}>
              <div className={cx("flex items-center mb-4", spacing.gap.sm)}>
                <Home className={cx(icons.sm, "text-gray-500")} />
                <h3 className={typography.heading.h3}>Service Address</h3>
              </div>
              
              <div className={spacing.gap.sm}>
                <Label htmlFor="serviceAddress">Service Address *</Label>
                <Select
                  value={formData.serviceAddressId}
                  onValueChange={(value) => updateField('serviceAddressId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service address" />
                  </SelectTrigger>
                  <SelectContent>
                    {customer?.addresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.street}, {address.city}, {address.state} {address.zipCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceAddressId && (
                  <p className={cx(typography.body.small, "text-red-500")}>{errors.serviceAddressId}</p>
                )}
              </div>
            </div>

            {/* Ramp Details */}
            <div className={spacing.gap.md}>
              <div className={cx("flex items-center mb-4", spacing.gap.sm)}>
                <Calculator className={cx(icons.sm, "text-gray-500")} />
                <h3 className={typography.heading.h3}>Ramp Details</h3>
              </div>
              
              <div className={layout.grid.equal}>
                <div className={spacing.gap.sm}>
                  <Label htmlFor="rampHeight">Ramp Height (inches) *</Label>
                  <Input
                    id="rampHeight"
                    type="number"
                    value={formData.rampHeight}
                    onChange={(e) => updateField('rampHeight', parseInt(e.target.value) || 0)}
                    min="1"
                    max="60"
                  />
                  {errors.rampHeight && (
                    <p className={cx(typography.body.small, "text-red-500")}>{errors.rampHeight}</p>
                  )}
                </div>
                
                <div className={spacing.gap.sm}>
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Select
                    value={formData.timelineNeeded}
                    onValueChange={(value) => updateField('timelineNeeded', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timelineNeeded && (
                    <p className={cx(typography.body.small, "text-red-500")}>{errors.timelineNeeded}</p>
                  )}
                </div>
              </div>

              <div className={layout.grid.equal}>
                <div className={spacing.gap.sm}>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) => updateField('serviceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceType && (
                    <p className={cx(typography.body.small, "text-red-500")}>{errors.serviceType}</p>
                  )}
                </div>

                <div className={spacing.gap.sm}>
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Select
                    value={formData.estimatedDuration}
                    onValueChange={(value) => updateField('estimatedDuration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className={spacing.gap.md}>
              <div className={cx("flex items-center mb-4", spacing.gap.sm)}>
                <DollarSign className={cx(icons.sm, "text-gray-500")} />
                <h3 className={typography.heading.h3}>Pricing</h3>
              </div>
              
              <div className={layout.grid.equal}>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className={cx(typography.body.small, "font-medium text-blue-900")}>Monthly Rate</p>
                  <p className={cx(typography.heading.h2, "text-blue-600")}>{formatCurrency(pricing.monthly)}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className={cx(typography.body.small, "font-medium text-green-900")}>Installation Fee</p>
                  <p className={cx(typography.heading.h2, "text-green-600")}>{formatCurrency(pricing.installation)}</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-100 rounded-lg text-center">
                <p className={cx(typography.body.small, "font-medium text-gray-900")}>Total First Month</p>
                <p className={cx(typography.display.small, "text-gray-900")}>{formatCurrency(totalFirstMonth)}</p>
                                 <p className={cx(typography.body.small, "text-gray-600")}>Installation fee + first month&apos;s rent</p>
              </div>
            </div>

            {/* Notes */}
            <div className={spacing.gap.sm}>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Add any special instructions or notes..."
                className="min-h-20"
              />
            </div>

            {/* Actions */}
            <div className={cx("flex pt-4", spacing.gap.md)}>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className={cx(icons.sm, "mr-2 animate-spin")} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Clock className={cx(icons.sm, "mr-2")} />
                    Create Quote
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 