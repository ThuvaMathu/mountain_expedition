import React from "react";

interface CurrencyButtonProps {
  value: string;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Reusable currency selection button component
 */
export const CurrencyButton: React.FC<CurrencyButtonProps> = ({
  value,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md border transition-colors ${
        isActive
          ? "bg-teal-600 text-white border-teal-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
      type="button"
    >
      {value}
    </button>
  );
};
