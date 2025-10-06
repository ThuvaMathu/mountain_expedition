"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CurrencyInputProps = {
  value: number | string;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  placeholder?: string;
  prefix?: string; // default "$"
};

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  (
    { value, onChange, size = "md", className, placeholder, prefix = "$" },
    ref
  ) => {
    const formatValue = (val: number | string) => {
      if (val === "" || isNaN(Number(val))) return "";
      return Number(val).toLocaleString("en-US");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, "");
      const num = Number(rawValue);
      if (!isNaN(num)) {
        onChange(num);
      }
    };

    const sizeClasses = {
      sm: "text-lg py-1 pl-6",
      md: "text-xl py-2 pl-7",
      lg: "text-2xl py-3 pl-8",
    };

    const prefixSizeClasses = {
      sm: "text-lg left-0",
      md: "text-xl left-0.5",
      lg: "text-2xl left-1",
    };

    return (
      <div className="relative w-full">
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gray-500 select-none",
            prefixSizeClasses[size],
            className
          )}
        >
          {prefix}
        </span>
        <input
          type="text"
          ref={ref}
          value={formatValue(value)}
          onChange={handleChange}
          placeholder={placeholder || "Enter amount"}
          className={cn(
            "w-full border-b border-gray-300 bg-transparent outline-none focus:border-black transition-colors",
            "tracking-wide",
            sizeClasses[size],
            className
          )}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
