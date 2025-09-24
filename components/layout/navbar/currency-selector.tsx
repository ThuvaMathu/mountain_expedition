"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, ChevronDown } from "lucide-react";
import { useCurrencyStore, type Currency } from "@/stores/currency-store";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  //   { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  //   { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
] as const;

interface CurrencySelectorProps {
  variant?: "desktop" | "mobile";
}

export function CurrencySelector({
  variant = "desktop",
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currency, setCurrency, getSymbol } = useCurrencyStore();

  const currentCurrency = currencies.find((c) => c.code === currency);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="px-3 py-2">
        <div className="text-sm font-medium text-gray-700 mb-2">Currency</div>
        <div className="grid grid-cols-2 gap-2">
          {currencies.map((curr) => (
            <Button
              key={curr.code}
              variant={currency === curr.code ? "default" : "outline"}
              size="sm"
              onClick={() => handleCurrencyChange(curr.code as Currency)}
              className="justify-start text-xs"
            >
              <span className="mr-1">{curr.flag}</span>
              {curr.symbol} {curr.code}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 hover:bg-gray-100"
      >
        {/* <DollarSign className="h-4 w-4" /> */}
        <span className="font-medium">{currentCurrency?.flag}</span>
        <span className="font-medium">{currency}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Select Currency
          </div>
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => handleCurrencyChange(curr.code as Currency)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                currency === curr.code
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-700"
              }`}
            >
              <span className="text-lg">{curr.flag}</span>
              <div className="flex-1">
                <div className="font-medium text-sm">{curr.code}</div>
                <div className="text-xs text-gray-500">{curr.name}</div>
              </div>
              <span className="font-bold text-sm">{curr.symbol}</span>
              {currency === curr.code && (
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
