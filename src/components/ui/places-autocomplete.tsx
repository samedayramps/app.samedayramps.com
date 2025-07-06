"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PlacesAutocompleteProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function PlacesAutocomplete({
  id,
  placeholder = "Enter your address",
  value,
  onChange,
  required = false,
  className,
}: PlacesAutocompleteProps) {
  // For now, this is a simple input component
  // In a production app, you would integrate with Google Places API
  return (
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={cn("w-full", className)}
      autoComplete="address-line1"
    />
  );
} 