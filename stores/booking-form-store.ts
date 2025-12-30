import { create } from "zustand";
import { participantGroupSchema } from "@/lib/schemas/participant-schema";
import { z } from "zod";

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

type ProductType = "domestic" | "international";

interface BookingFormState {
  // State
  participantGroup: ParticipantGroup;
  productType: ProductType;
  isFieldsFilled: boolean;
  errors: {
    organizer: Record<string, string>;
    members: Record<number, Record<string, string>>;
  };

  // Actions
  setProductType: (type: ProductType) => void;
  updateOrganizer: (organizer: ParticipantInfo) => void;
  updateMember: (index: number, member: ParticipantInfo) => void;
  addMember: () => void;
  removeMember: (index: number) => void;
  setMembers: (members: ParticipantInfo[]) => void;
  validateForm: () => void;
  setFieldError: (
    type: "organizer" | "member",
    field: string,
    message: string,
    index?: number
  ) => void;
  clearFieldError: (
    type: "organizer" | "member",
    field: string,
    index?: number
  ) => void;
  resetForm: () => void;
  initializeWithUserData: (userData: { name?: string; email?: string }) => void;
}

const createEmptyParticipant = (): ParticipantInfo => ({
  name: "",
  email: "",
  country: "",
  passport: "",
  phone: "",
  emergencyContact: "",
  medicalInfo: "",
});

export const useBookingFormStore = create<BookingFormState>((set, get) => ({
  // Initial state
  participantGroup: {
    organizer: createEmptyParticipant(),
    members: [],
  },
  productType: "international",
  isFieldsFilled: false,
  errors: {
    organizer: {},
    members: {},
  },

  // Actions
  setProductType: (type) => {
    const state = get();
    // Only update if actually changed
    if (state.productType === type) return;
    
    set({ productType: type });
    // Auto-fill country for domestic products
    if (type === "domestic") {
      set({
        participantGroup: {
          organizer: { ...state.participantGroup.organizer, country: "India" },
          members: state.participantGroup.members.map((m) => ({
            ...m,
            country: "India",
          })),
        },
      });
    }
  },

  updateOrganizer: (organizer) => {
    const state = get();
    set({
      participantGroup: {
        ...state.participantGroup,
        organizer,
      },
    });
  },

  updateMember: (index, member) => {
    const state = get();
    const newMembers = [...state.participantGroup.members];
    newMembers[index] = member;
    set({
      participantGroup: {
        ...state.participantGroup,
        members: newMembers,
      },
    });
  },

  addMember: () => {
    const state = get();
    set({
      participantGroup: {
        ...state.participantGroup,
        members: [...state.participantGroup.members, createEmptyParticipant()],
      },
    });
    
    // Validate to update isFieldsFilled (will fail for empty participant)
    get().validateForm();
  },

  removeMember: (index) => {
    const state = get();
    
    // Remove participant
    const newMembers = state.participantGroup.members.filter((_, i) => i !== index);
    
    // Clean up and reindex errors
    const newMemberErrors: Record<number, Record<string, string>> = {};
    Object.keys(state.errors.members).forEach((key) => {
      const errorIndex = parseInt(key);
      if (errorIndex < index) {
        // Keep errors before removed index
        newMemberErrors[errorIndex] = state.errors.members[errorIndex];
      } else if (errorIndex > index) {
        // Reindex errors after removed index
        newMemberErrors[errorIndex - 1] = state.errors.members[errorIndex];
      }
      // Skip errors at removed index
    });
    
    set({
      participantGroup: {
        ...state.participantGroup,
        members: newMembers,
      },
      errors: {
        ...state.errors,
        members: newMemberErrors,
      },
    });
    
    // Validate to update isFieldsFilled
    get().validateForm();
  },

  setMembers: (members) => {
    const state = get();
    set({
      participantGroup: {
        ...state.participantGroup,
        members,
      },
    });
  },

  validateForm: () => {
    const state = get();
    try {
      // For domestic tours, auto-fill country as "India" before validation
      const validationGroup =
        state.productType === "domestic"
          ? {
              organizer: { ...state.participantGroup.organizer, country: "India" },
              members: state.participantGroup.members.map((m) => ({
                ...m,
                country: "India",
              })),
            }
          : state.participantGroup;

      const schema = participantGroupSchema(state.productType);
      schema.parse(validationGroup);
      set({ isFieldsFilled: true });
      return true;
    } catch (error) {
      set({ isFieldsFilled: false });
      return false;
    }
  },

  setFieldError: (type, field, message, index) => {
    set((state) => {
      if (type === "organizer") {
        return {
          errors: {
            ...state.errors,
            organizer: { ...state.errors.organizer, [field]: message },
          },
        };
      }
      return {
        errors: {
          ...state.errors,
          members: {
            ...state.errors.members,
            [index!]: { ...(state.errors.members[index!] || {}), [field]: message },
          },
        },
      };
    });
  },

  clearFieldError: (type, field, index) => {
    set((state) => {
      if (type === "organizer") {
        const { [field]: _, ...rest } = state.errors.organizer;
        return {
          errors: {
            ...state.errors,
            organizer: rest,
          },
        };
      }
      const memberErrors = { ...(state.errors.members[index!] || {}) };
      delete memberErrors[field];
      return {
        errors: {
          ...state.errors,
          members: { ...state.errors.members, [index!]: memberErrors },
        },
      };
    });
  },

  resetForm: () => {
    set({
      participantGroup: {
        organizer: createEmptyParticipant(),
        members: [],
      },
      isFieldsFilled: false,
      errors: {
        organizer: {},
        members: {},
      },
    });
  },

  initializeWithUserData: (userData) => {
    const state = get();
    set({
      participantGroup: {
        ...state.participantGroup,
        organizer: {
          ...state.participantGroup.organizer,
          name: userData.name || "",
          email: userData.email || "",
        },
      },
    });
  },
}));
