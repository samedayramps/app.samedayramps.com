"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader } from "@googlemaps/js-api-loader";

interface PlacesAutocompleteProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult) => void;
  onAddressSelect?: (address: ParsedAddress) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  formatted: string;
}

export function PlacesAutocomplete({
  id,
  placeholder = "Enter your address",
  value,
  onChange,
  onAddressSelect,
  required = false,
  className,
  disabled = false,
}: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
          console.warn('Google Places API key not configured');
          return;
        }

        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"],
        });

        await loader.load();
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load address autocomplete');
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: ["us"] },
        fields: ["address_components", "formatted_address", "geometry"],
        types: ["address"],
      });

      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address, place);
          
          // Parse address components if callback provided
          if (onAddressSelect && place.address_components) {
            const parsedAddress = parseAddressComponents(place.address_components, place.formatted_address);
            onAddressSelect(parsedAddress);
          }
        }
      });
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onChange, onAddressSelect]);

  const parseAddressComponents = (
    components: google.maps.GeocoderAddressComponent[],
    formatted: string
  ): ParsedAddress => {
    const result: ParsedAddress = {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      formatted,
    };

    components.forEach((component) => {
      const types = component.types;
      
      if (types.includes('street_number')) {
        result.street = component.long_name + ' ';
      } else if (types.includes('route')) {
        result.street += component.long_name;
      } else if (types.includes('locality')) {
        result.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        result.state = component.short_name;
      } else if (types.includes('postal_code')) {
        result.zipCode = component.long_name;
      } else if (types.includes('country')) {
        result.country = component.short_name;
      }
    });

    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        required={required}
        disabled={disabled}
        className={cn("w-full", className)}
        autoComplete="address-line1"
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      {!isLoaded && !error && (
        <p className="text-sm text-gray-500 mt-1">Loading address suggestions...</p>
      )}
    </div>
  );
} 