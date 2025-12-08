import React from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
}

/**
 * Reusable form field component with validation error display
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  textarea = false,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className={error ? "border-red-500" : ""}
          placeholder={placeholder}
          required={required}
        />
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
