"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Plus, Minus, Trash, X } from "lucide-react";
import { participantGroupSchema } from "@/lib/schemas/participant-schema";
import { z } from "zod";
import { PhoneInput } from "./PhoneInput";

// Types
type ParticipantInfo = {
  name: string;
  email: string;
  country: string;
  passport: string;
  phone: string;
  emergencyContact: string;
  medicalInfo: string;
};

type ParticipantGroup = {
  organizer: ParticipantInfo;
  members: ParticipantInfo[];
};

// Props interface
interface ParticipantGroupFormProps {
  participantCount: number;
  maxParticipants: number;
  onChange: (data: ParticipantGroup, isAllFilled: boolean) => void;
  productType: "domestic" | "international"; // Optional prop to differentiate product types
}

// Input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${className}`}
    {...props}
  />
);

// Create empty participant
const createEmptyParticipant = (): ParticipantInfo => ({
  name: "",
  email: "",
  country: "",
  passport: "",
  phone: "",
  emergencyContact: "",
  medicalInfo: "",
});

// Participant form fields component
const ParticipantFields: React.FC<{
  participant: ParticipantInfo;
  onChange: (participant: ParticipantInfo) => void;
  title: string;
  isOrganizer?: boolean;
  type: "domestic" | "international";
  errors?: Record<string, string>;
  onFieldBlur?: (field: string, value: string) => void;
}> = ({
  participant,
  onChange,
  type: category,
  title,
  isOrganizer = false,
  errors = {},
  onFieldBlur,
}) => {
    const updateField = (field: keyof ParticipantInfo, value: string) => {
      onChange({ ...participant, [field]: value });
    };

    const handleBlur = (field: string, value: string) => {
      if (onFieldBlur) {
        onFieldBlur(field, value);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          {title}
          {isOrganizer && (
            <span className="ml-2 text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
              Primary
            </span>
          )}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              value={participant.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              required
              placeholder="Enter full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              aria-label="email"
              value={participant.email}
              onChange={(e) => updateField("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              required
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {category !== "domestic" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Residence *
              </label>
              <Input
                type="text"
                value={participant.country}
                onChange={(e) => updateField("country", e.target.value)}
                onBlur={(e) => handleBlur("country", e.target.value)}
                required
                placeholder="e.g., India"
                className={errors.country ? "border-red-500" : ""}
              />
              {errors.country && (
                <p className="text-sm text-red-500 mt-1">{errors.country}</p>
              )}
            </div>
          )}
          {category !== "domestic" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number *
              </label>
              <Input
                type="text"
                value={participant.passport}
                onChange={(e) => updateField("passport", e.target.value)}
                onBlur={(e) => handleBlur("passport", e.target.value)}
                required
                placeholder="e.g., N12345677"
                className={errors.passport ? "border-red-500" : ""}
              />
              {errors.passport && (
                <p className="text-sm text-red-500 mt-1">{errors.passport}</p>
              )}
            </div>
          )}

          <div>
            <PhoneInput
              label="Phone Number"
              value={participant.phone}
              onChange={(value) => updateField("phone", value)}
              onBlur={(value) => handleBlur("phone", value)}
              required
              placeholder="98765 43210"
              error={errors.phone}
            />
          </div>

          <div>
            <PhoneInput
              label="Emergency Contact"
              value={participant.emergencyContact}
              onChange={(value) => updateField("emergencyContact", value)}
              onBlur={(value) => handleBlur("emergencyContact", value)}
              required
              placeholder="98765 43210"
              error={errors.emergencyContact}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Information (Optional)
          </label>
          <textarea
            value={participant.medicalInfo}
            onChange={(e) => updateField("medicalInfo", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Any medical conditions, allergies, or special requirements..."
          />
        </div>
      </div>
    );
  };

// Main component
const ParticipantGroupForm: React.FC<ParticipantGroupFormProps> = ({
  participantCount,
  maxParticipants,
  onChange,
  productType,
}) => {
  const [participantGroup, setParticipantGroup] = useState<ParticipantGroup>({
    organizer: createEmptyParticipant(),
    members: [],
  });
  const [errors, setErrors] = useState<{
    organizer: Record<string, string>;
    members: Record<number, Record<string, string>>;
  }>({
    organizer: {},
    members: {},
  });
  const isMaxParticipants = participantGroup.members.length < maxParticipants;
  const prevParticipantCountRef = useRef(participantCount);

  // Update members array when participantCount changes
  useEffect(() => {
    // Only run if participantCount actually changed
    if (prevParticipantCountRef.current === participantCount) {
      return;
    }

    prevParticipantCountRef.current = participantCount;

    const membersNeeded = Math.max(0, participantCount - 1);
    const currentMembers = participantGroup.members;

    let newMembers: ParticipantInfo[];

    if (membersNeeded > currentMembers.length) {
      // Add empty participants
      const additionalMembers = Array(membersNeeded - currentMembers.length)
        .fill(null)
        .map(() => createEmptyParticipant());
      newMembers = [...currentMembers, ...additionalMembers];
    } else if (membersNeeded < currentMembers.length) {
      // Remove excess participants
      newMembers = currentMembers.slice(0, membersNeeded);
    } else {
      // No change needed
      return;
    }

    const updatedGroup = { ...participantGroup, members: newMembers };
    setParticipantGroup(updatedGroup);
    onChange(updatedGroup, false);
  }, [participantCount]); // Only depend on participantCount

  const clearFieldError = (
    type: "organizer" | "member",
    field: string,
    index?: number
  ) => {
    setErrors((prev) => {
      if (type === "organizer") {
        const { [field]: _, ...rest } = prev.organizer;
        return { ...prev, organizer: rest };
      }
      const memberErrors = { ...(prev.members[index!] || {}) };
      delete memberErrors[field];
      return { ...prev, members: { ...prev.members, [index!]: memberErrors } };
    });
  };

  const setFieldError = (
    type: "organizer" | "member",
    field: string,
    message: string,
    index?: number
  ) => {
    setErrors((prev) => {
      if (type === "organizer") {
        return { ...prev, organizer: { ...prev.organizer, [field]: message } };
      }
      return {
        ...prev,
        members: {
          ...prev.members,
          [index!]: { ...(prev.members[index!] || {}), [field]: message },
        },
      };
    });
  };

  // Validation using Zod schema
  const validateField = (
    type: "organizer" | "member",
    field: string,
    value: string,
    index?: number
  ) => {
    try {
      const schema = participantGroupSchema(productType);
      const participantSchema =
        type === "organizer"
          ? schema.shape.organizer
          : schema.shape.members.element;

      const fieldSchema = (participantSchema as any).shape[field];
      if (!fieldSchema) return;

      fieldSchema.parse(value);
      clearFieldError(type, field, index);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldError(type, field, error.errors[0].message, index);
      }
    }
  };

  // Validation helpers using Zod
  const areAllParticipantsValid = (group: ParticipantGroup): boolean => {
    try {
      // For domestic tours, auto-fill country as "India" before validation
      const validationGroup = productType === "domestic"
        ? {
          organizer: { ...group.organizer, country: "India" },
          members: group.members.map(m => ({ ...m, country: "India" }))
        }
        : group;

      const schema = participantGroupSchema(productType);
      schema.parse(validationGroup);
      console.log("✅ Validation PASSED - All fields are valid");
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("❌ Validation FAILED:");
        error.errors.forEach((err) => {
          console.log(`  - ${err.path.join(".")}: ${err.message}`);
        });
        console.log("Current data:", JSON.stringify(group, null, 2));
      }
      return false;
    }
  };

  // Single update helper to avoid repetition
  const updateGroupAndNotify = (updatedGroup: ParticipantGroup) => {
    setParticipantGroup(updatedGroup);
    const isAllFilled = areAllParticipantsValid(updatedGroup);
    onChange(updatedGroup, isAllFilled);
  };

  // Update organizer
  const updateOrganizer = (organizer: ParticipantInfo) => {
    updateGroupAndNotify({ ...participantGroup, organizer });
  };

  // Update member
  const updateMember = (index: number, member: ParticipantInfo) => {
    const newMembers = [...participantGroup.members];
    newMembers[index] = member;
    updateGroupAndNotify({ ...participantGroup, members: newMembers });
  };

  // Add member manually (optional feature)
  const addMember = () => {
    if (participantGroup.members.length >= maxParticipants) return;
    updateGroupAndNotify({
      ...participantGroup,
      members: [...participantGroup.members, createEmptyParticipant()],
    });
  };

  // Remove member manually (optional feature)
  const removeMember = (index: number) => {
    updateGroupAndNotify({
      ...participantGroup,
      members: participantGroup.members.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Organizer/Primary Participant */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        <ParticipantFields
          type={productType}
          participant={participantGroup.organizer}
          onChange={updateOrganizer}
          title="Primary Participant"
          isOrganizer={true}
          errors={errors.organizer}
          onFieldBlur={(field, value) => validateField("organizer", field, value)}
        />
      </div>

      {/* Members */}
      {participantGroup.members.map((member, index) => (
        <div
          key={index}
          className="relative animate-in fade-in slide-in-from-top-4 duration-500"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <ParticipantFields
            type={productType}
            participant={member}
            onChange={(updatedMember) => updateMember(index, updatedMember)}
            title={`Additional Participant ${index + 1}`}
            errors={errors.members[index] || {}}
            onFieldBlur={(field, value) => validateField("member", field, value, index)}
          />

          {/* Optional: Remove button for manual control */}
          {participantGroup.members.length >= 1 && (
            <button
              type="button"
              onClick={() => removeMember(index)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110"
              title="Remove participant"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}

      {/* Optional: Add member button */}
      {isMaxParticipants && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center px-4 py-2 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Participant
          </button>
        </div>
      )}

      {/* Summary */}
      {/* <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Total Participants:</strong>{" "}
          {1 + participantGroup.members.length}
          <br />
          <strong>Primary:</strong> 1 organizer
          <br />
          <strong>Additional:</strong> {participantGroup.members.length} members
        </p>
      </div> */}
    </div>
  );
};

export default ParticipantGroupForm;
