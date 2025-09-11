"use client";

import * as React from "react";
import { Input } from "@/components/ui/input"; // Using your existing Input
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

export interface ArrayInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  buttonLabel?: string;
}

export const ArrayInput: React.FC<ArrayInputProps> = ({
  value,
  onChange,
  placeholder = "Enter value",
  className,
  buttonLabel = "Add",
}) => {
  const [current, setCurrent] = React.useState("");

  const addItem = () => {
    if (!current.trim()) return;
    const updated = [...value, current.trim()];
    onChange(updated);
    setCurrent("");
  };

  const removeItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Input and Add Button */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <button
          type="button"
          onClick={addItem}
          className={cn(
            "flex items-center justify-center rounded-md bg-primary px-4 text-white hover:bg-primary/90 transition-colors"
          )}
        >
          <Plus className="h-4 w-4 mr-1" />
          {buttonLabel}
        </button>
      </div>

      {/* List of Items */}
      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
