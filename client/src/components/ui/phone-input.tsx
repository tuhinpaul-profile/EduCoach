import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Country {
  name: string;
  flag: string;
  code: string;
  dialCode: string;
}

const countries: Country[] = [
  { name: "United States", flag: "🇺🇸", code: "US", dialCode: "+1" },
  { name: "India", flag: "🇮🇳", code: "IN", dialCode: "+91" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB", dialCode: "+44" },
  { name: "China", flag: "🇨🇳", code: "CN", dialCode: "+86" },
  { name: "France", flag: "🇫🇷", code: "FR", dialCode: "+33" },
  { name: "Germany", flag: "🇩🇪", code: "DE", dialCode: "+49" },
  { name: "Japan", flag: "🇯🇵", code: "JP", dialCode: "+81" },
  { name: "Canada", flag: "🇨🇦", code: "CA", dialCode: "+1" },
  { name: "Australia", flag: "🇦🇺", code: "AU", dialCode: "+61" },
  { name: "Brazil", flag: "🇧🇷", code: "BR", dialCode: "+55" },
  { name: "Russia", flag: "🇷🇺", code: "RU", dialCode: "+7" },
  { name: "South Korea", flag: "🇰🇷", code: "KR", dialCode: "+82" },
  { name: "Mexico", flag: "🇲🇽", code: "MX", dialCode: "+52" },
  { name: "Italy", flag: "🇮🇹", code: "IT", dialCode: "+39" },
  { name: "Spain", flag: "🇪🇸", code: "ES", dialCode: "+34" },
  { name: "Netherlands", flag: "🇳🇱", code: "NL", dialCode: "+31" },
  { name: "Singapore", flag: "🇸🇬", code: "SG", dialCode: "+65" },
  { name: "UAE", flag: "🇦🇪", code: "AE", dialCode: "+971" },
  { name: "Pakistan", flag: "🇵🇰", code: "PK", dialCode: "+92" },
  { name: "Bangladesh", flag: "🇧🇩", code: "BD", dialCode: "+880" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PhoneInput({ value, onChange, placeholder = "Enter phone number", className }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[1]); // Default to India
  const [open, setOpen] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
    // Update the phone number with new country code
    const phoneNumber = value.replace(/^\+\d+\s*/, ""); // Remove existing country code
    onChange(`${country.dialCode} ${phoneNumber}`);
  };

  const handlePhoneChange = (phoneValue: string) => {
    // Ensure the country code is always present
    if (!phoneValue.startsWith(selectedCountry.dialCode)) {
      onChange(`${selectedCountry.dialCode} ${phoneValue}`);
    } else {
      onChange(phoneValue);
    }
  };

  return (
    <div className={cn("flex", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-auto justify-between rounded-r-none border-r-0"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-mono text-sm">{selectedCountry.dialCode}</span>
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <ScrollArea className="h-60">
            <div className="p-1">
              {countries.map((country) => (
                <Button
                  key={country.code}
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {country.dialCode}
                    </span>
                  </span>
                  {selectedCountry.code === country.code && (
                    <Check className="ml-2 h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        value={value}
        onChange={(e) => handlePhoneChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-l-none"
      />
    </div>
  );
}