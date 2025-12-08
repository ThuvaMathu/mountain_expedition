import React from "react";

interface TermsCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Reusable checkbox component for terms and conditions
 */
export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
    >
      <input
        id={id}
        type="checkbox"
        className="mt-1 mr-3 accent-teal-600 w-4 h-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
      />
      <span>{label}</span>
    </label>
  );
};
