"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "./textarea";

interface ItineraryInputProps {
  value: ItineraryItem[];
  onChange: (items: ItineraryItem[]) => void;
}

export function ItineraryInput({ value, onChange }: ItineraryInputProps) {
  const [item, setItem] = React.useState<ItineraryItem>({
    day: value.length + 1,
    title: "",
    description: "",
    altitude: 0,
  });

  const addItem = () => {
    if (!item.title.trim() || !item.description.trim()) return;
    const updated = [...value, item];
    onChange(updated);
    setItem({
      day: updated.length + 1,
      title: "",
      description: "",
      altitude: 0,
    });
  };

  const removeItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(
      updated.map((it, i) => ({ ...it, day: i + 1 })) // Renumber days
    );
  };

  return (
    <div className="space-y-4 rounded-lg ">
      {/* Input Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Day
          </label>
          <Input
            type="number"
            min="1"
            value={item.day}
            onChange={(e) => setItem({ ...item, day: Number(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Altitude (m)
          </label>
          <Input
            type="number"
            min="0"
            value={item.altitude}
            onChange={(e) =>
              setItem({ ...item, altitude: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Description Field */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Title
        </label>
        <Input
          type="text"
          placeholder="Enter Title"
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs mb-2 font-medium text-gray-600">
          Description
        </label>
        <Textarea
          placeholder="Enter detailed description"
          value={item.description}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
        />
      </div>
      <div className="flex items-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className=" bg-black text-white hover:bg-gray-800 hover:text-white"
          onClick={addItem}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Itinerary
        </Button>
      </div>

      {/* Existing Itinerary List */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((it, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border border-gray-200 rounded-lg p-3 bg-white"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  Day {it.day}: {it.title} ({it.altitude}m)
                </p>
                <p className="text-xs text-gray-600">{it.description}</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeItem(idx)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
