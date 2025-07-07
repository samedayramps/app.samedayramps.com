"use client";

import { useState } from "react";
import { DesktopLayout } from "@/components/desktop-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete";
import { ArrowLeft, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    serviceType: "",
    timeline: "",
    rampHeight: "",
    notes: "",
    marketingConsent: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressSelect = (address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      address: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log("Form submitted:", formData);
    
    // Show success feedback and navigate back
    router.push("/customers");
  };

  return (
    <DesktopLayout title="Add Customer" showNavigation={false}>
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
            Add New Customer
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="h-12 text-base"
                    autoCapitalize="words"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="h-12 text-base"
                    autoCapitalize="words"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 text-base"
                  inputMode="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(214) 555-0123"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 text-base"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Address */}
          <Card>
            <CardHeader>
              <CardTitle>Service Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Service Address *</Label>
                <PlacesAutocomplete
                  id="address"
                  placeholder="Enter the service address"
                  value={`${formData.address}${formData.city ? `, ${formData.city}` : ''}${formData.state ? `, ${formData.state}` : ''}${formData.zipCode ? ` ${formData.zipCode}` : ''}`}
                  onChange={(value) => handleInputChange("address", value)}
                  onAddressSelect={handleAddressSelect}
                  className="h-12 text-base"
                  required
                />
                <p className="text-sm text-gray-500">
                  Start typing an address and select from the suggestions
                </p>
              </div>

              {/* Show parsed address components if available */}
              {(formData.address || formData.city || formData.state || formData.zipCode) && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Parsed Address:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {formData.address && <div><strong>Street:</strong> {formData.address}</div>}
                    {formData.city && <div><strong>City:</strong> {formData.city}</div>}
                    {formData.state && <div><strong>State:</strong> {formData.state}</div>}
                    {formData.zipCode && <div><strong>ZIP:</strong> {formData.zipCode}</div>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Service Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="post-surgery">Post-Surgery Recovery</SelectItem>
                    <SelectItem value="aging-in-place">Aging in Place</SelectItem>
                    <SelectItem value="transitional-hospice">Transitional/Hospice Care</SelectItem>
                    <SelectItem value="temporary">Temporary Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline Needed *</Label>
                <Select onValueChange={(value) => handleInputChange("timeline", value)}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="When do you need the ramp?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (Within 24 hours)</SelectItem>
                    <SelectItem value="within-3-days">Within 3 days</SelectItem>
                    <SelectItem value="within-1-week">Within 1 week</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rampHeight">Estimated Ramp Height (inches)</Label>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or notes..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[100px] text-base"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Marketing Consent */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => handleInputChange("marketingConsent", !!checked)}
                  className="h-5 w-5"
                />
                <Label htmlFor="marketing" className="text-sm">
                  I agree to receive marketing communications and updates about Same Day Ramps services
                </Label>
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
                <Save className="h-5 w-5 mr-2" />
                Save Customer
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DesktopLayout>
  );
} 