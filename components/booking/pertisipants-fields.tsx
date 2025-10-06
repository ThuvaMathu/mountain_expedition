"use client";

import React, { useState, useEffect } from "react";
import { User, Plus, Minus, Trash, X } from "lucide-react";

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
}> = ({
  participant,
  onChange,
  type: category,
  title,
  isOrganizer = false,
}) => {
  const updateField = (field: keyof ParticipantInfo, value: string) => {
    onChange({ ...participant, [field]: value });
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
            required
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <Input
            type="email"
            value={participant.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
            placeholder="Enter email address"
          />
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
              required
              placeholder="e.g., India"
            />
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
              required
              placeholder="e.g., N12345677"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={participant.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact *
          </label>
          <Input
            type="tel"
            value={participant.emergencyContact}
            onChange={(e) => updateField("emergencyContact", e.target.value)}
            required
            placeholder="Emergency contact number"
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
  const isMaxParticipants = participantGroup.members.length < maxParticipants;
  // Validation helpers
  const isParticipantValid = (participant: ParticipantInfo): boolean => {
    const type = productType;
    return !!(
      (
        participant.name.trim() &&
        participant.email.trim() &&
        (type !== "domestic"
          ? participant.country.trim() && participant.passport.trim()
          : true) &&
        participant.phone.trim() &&
        participant.emergencyContact.trim()
      )
      // medicalInfo is optional, so we don't check it
    );
  };

  const areAllParticipantsValid = (group: ParticipantGroup): boolean => {
    const isOrganizerValid = isParticipantValid(group.organizer);
    const areAllMembersValid = group.members.every((member) =>
      isParticipantValid(member)
    );
    return isOrganizerValid && areAllMembersValid;
  };

  // Update members array when participantCount changes
  useEffect(() => {
    const membersNeeded = Math.max(0, participantCount - 1);
    const currentMembers = participantGroup.members;

    let newMembers: ParticipantInfo[];

    if (membersNeeded > currentMembers.length) {
      // Add empty participants
      const additionalMembers = Array(membersNeeded - currentMembers.length)
        .fill(null)
        .map(() => createEmptyParticipant());
      newMembers = [...currentMembers, ...additionalMembers];
    } else {
      // Remove excess participants
      newMembers = currentMembers.slice(0, membersNeeded);
    }

    const updatedGroup = { ...participantGroup, members: newMembers };
    setParticipantGroup(updatedGroup);
    onChange(updatedGroup, false);
  }, [participantCount]);

  // Update organizer
  const updateOrganizer = (organizer: ParticipantInfo) => {
    const updatedGroup = { ...participantGroup, organizer };
    setParticipantGroup(updatedGroup);
    const isAllFilled = areAllParticipantsValid(updatedGroup);
    onChange(updatedGroup, isAllFilled);
  };

  // Update member
  const updateMember = (index: number, member: ParticipantInfo) => {
    const newMembers = [...participantGroup.members];
    newMembers[index] = member;
    const updatedGroup = { ...participantGroup, members: newMembers };
    setParticipantGroup(updatedGroup);
    const isAllFilled = areAllParticipantsValid(updatedGroup);
    onChange(updatedGroup, isAllFilled);
  };

  // Add member manually (optional feature)
  const addMember = () => {
    if (participantGroup.members.length < maxParticipants) {
      const newMembers = [
        ...participantGroup.members,
        createEmptyParticipant(),
      ];
      const updatedGroup = { ...participantGroup, members: newMembers };
      setParticipantGroup(updatedGroup);
      const isAllFilled = areAllParticipantsValid(updatedGroup);
      onChange(updatedGroup, isAllFilled);
    }
  };

  // Remove member manually (optional feature)
  const removeMember = (index: number) => {
    const newMembers = participantGroup.members.filter((_, i) => i !== index);
    const updatedGroup = { ...participantGroup, members: newMembers };
    setParticipantGroup(updatedGroup);
    const isAllFilled = areAllParticipantsValid(updatedGroup);
    onChange(updatedGroup, isAllFilled);
  };

  return (
    <div className="space-y-6">
      {/* Organizer/Primary Participant */}
      <ParticipantFields
        type={productType}
        participant={participantGroup.organizer}
        onChange={updateOrganizer}
        title="Primary Participant"
        isOrganizer={true}
      />

      {/* Members */}
      {participantGroup.members.map((member, index) => (
        <div key={index} className="relative">
          <ParticipantFields
            type={productType}
            participant={member}
            onChange={(updatedMember) => updateMember(index, updatedMember)}
            title={`Additional Participant ${index + 1}`}
          />

          {/* Optional: Remove button for manual control */}
          {participantGroup.members.length >= 1 && (
            <button
              type="button"
              onClick={() => removeMember(index)}
              className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
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
