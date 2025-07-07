"use client";

import { useState } from "react";
import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete";
import { ArrowLeft, Send, DollarSign, Calculator } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddQuotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceAddress: "",
    rampHeight: "",
    timeline: "",
    monthlyRate: "",
    installationFee: "",
    estimatedDuration: "",
    notes: ""
  });

  const [calculatedRates, setCalculatedRates] = useState({
    monthlyRate: 0,
    installationFee: 0
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate rates based on ramp height for wheelchair ramp rental
    if (field === "rampHeight" && value) {
      const height = parseInt(value);
      // Simplified pricing for wheelchair ramp rental
      const baseMonthlyRate = 125;
      const perInchRate = 6;
      const baseInstallationFee = 75;
      const perInchInstallation = 2;

      const monthlyRate = baseMonthlyRate + (height * perInchRate);
      const installationFee = baseInstallationFee + (height * perInchInstallation);

      setCalculatedRates({
        monthlyRate,
        installationFee
      });

      setFormData(prev => ({
        ...prev,
        monthlyRate: monthlyRate.toString(),
        installationFee: installationFee.toString()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Quote submitted:", formData);
    
    // Show success feedback and navigate back
    router.push("/");
  };

  return (
    <DesktopLayout title="Create Quote" showNavigation={false}>
      <div className="p-4 lg:p-8 max-w-2xl mx-auto">
        {/* Mobile Header with Back Button */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="mr-3 touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Quote
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="h-12 text-base"
                  autoCapitalize="words"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  className="h-12 text-base"
                  inputMode="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  placeholder="(214) 555-0123"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  className="h-12 text-base"
                  inputMode="tel"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceAddress">Service Address *</Label>
                <PlacesAutocomplete
                  id="serviceAddress"
                  placeholder="Enter the installation address"
                  value={formData.serviceAddress}
                  onChange={(value) => handleInputChange("serviceAddress", value)}
                  className="h-12 text-base"
                  required
                />
                <p className="text-sm text-gray-500">
                  Start typing an address and select from the suggestions
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rampHeight">Ramp Height (inches) *</Label>
                <Input
                  id="rampHeight"
                  type="number"
                  placeholder="24"
                  value={formData.rampHeight}
                  onChange={(e) => handleInputChange("rampHeight", e.target.value)}
                  className="h-12 text-base"
                  inputMode="numeric"
                  min="1"
                  max="48"
                  required
                />
                {formData.rampHeight && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <Calculator className="h-4 w-4 inline mr-1" />
                    Auto-calculated pricing based on {formData.rampHeight}&quot; height
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline Needed *</Label>
                <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="When is installation needed?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (Within 24 hours)</SelectItem>
                    <SelectItem value="within-3-days">Within 3 days</SelectItem>
                    <SelectItem value="within-1-week">Within 1 week</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">Monthly Rate ($) *</Label>
                  <Input
                    id="monthlyRate"
                    type="number"
                    placeholder="150"
                    value={formData.monthlyRate}
                    onChange={(e) => handleInputChange("monthlyRate", e.target.value)}
                    className="h-12 text-base"
                    inputMode="numeric"
                    min="50"
                    max="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installationFee">Installation Fee ($) *</Label>
                  <Input
                    id="installationFee"
                    type="number"
                    placeholder="300"
                    value={formData.installationFee}
                    onChange={(e) => handleInputChange("installationFee", e.target.value)}
                    className="h-12 text-base"
                    inputMode="numeric"
                    min="100"
                    max="2000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Rental Duration</Label>
                <Select onValueChange={(value) => handleInputChange("estimatedDuration", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="How long will they need the ramp?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="2-3-months">2-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-months-plus">6+ months</SelectItem>
                    <SelectItem value="permanent">Permanent solution</SelectItem>
                    <SelectItem value="unknown">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {calculatedRates.monthlyRate > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Estimated Total Cost
                  </h4>
                  <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <div className="flex justify-between">
                      <span>Installation Fee:</span>
                      <span>${calculatedRates.installationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Rate:</span>
                      <span>${calculatedRates.monthlyRate}/month</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-blue-200 dark:border-blue-700 pt-1">
                      <span>First Month Total:</span>
                      <span>${calculatedRates.installationFee + calculatedRates.monthlyRate}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Special Requirements or Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements, installation notes, or customer preferences..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[100px] text-base"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-safe-area-inset-bottom">
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="flex-1 h-12 text-base"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-12 text-base touch-target"
              >
                <Send className="h-5 w-5 mr-2" />
                Generate Quote
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DesktopLayout>
  );
} 