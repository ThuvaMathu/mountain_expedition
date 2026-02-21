# CTA Contact Details Audit Plan

## Audit Summary

A comprehensive scan was conducted across the codebase targeting components functioning as Call to Actions (CTAs) to verify the source of their contact details (Phone, Email, WhatsApp). Below is the list of identified CTA files containing or utilizing contact details:

1.  **`components/about/EnquiryCTA.tsx`**
    *   Line 37: Renders email address.
    *   Line 41: Renders phone number.
2.  **`components/booking/checkout/SupportCTA.tsx`**
    *   Line 34: WhatsApp chat link.
    *   Line 46: Phone call link.
    *   Line 53: Email link.
3.  **`components/home/social-trust/StickyBookingCTA.tsx`**
    *   Line 59: WhatsApp window open.
    *   Line 63: Phone window open.
4.  **`components/layout/Footer-client.tsx`**
    *   Line 224: Phone link.
    *   Line 233: Email link.

*(Note: `BlogCTA.tsx` and `StoryCTA.tsx` were reviewed but do not display specific contact strings; they just route users to the `/contact` page directly).*

## Issues Found

The core logic of the Single Source of Truth (`getContactDetails()`) is well respected across almost all CTA sections, with exactly **one exception**.

### 🟢 Dynamic CTAs (Correctly Using SSOT)
The following components are already operating perfectly and dynamically fetching contact details:
*   **`SupportCTA.tsx`**: Uses the `useContactDetails()` hook internally to populate links.
*   **`StickyBookingCTA.tsx`**: Fully dynamic. It receives `whatsappNumber` and `phoneNumber` via props from parent layouts (e.g., `DeferredLayoutWrappers.tsx`), which pull from `getContactDetails()`.
*   **`Footer-client.tsx`**: Fully dynamic. Receives `contactDetails` directly as a prop from the Server Component `Footer.tsx`.

### 🔴 Hard-coded CTAs (Requires Refactoring)
The following component is statically defined and violates the SSOT pattern:
*   **`components/about/EnquiryCTA.tsx`**
    *   Hard-coded string: `hello@tamiladventure.com`
    *   Hard-coded string: `+91 98765 43210`

*(Other hard-coded `+91` or `@example.com` strings found globally exist solely as form input placeholders, e.g., in `contact-form.tsx` or `EnquiryForm.tsx`, which is acceptable and outside the scope of CTA refactoring).*

## Refactoring Strategy

To ensure 100% compliance with the SSOT approach, the following step-by-step refactoring will be executed against `EnquiryCTA.tsx`:

### Step 1: Update `components/about/EnquiryCTA.tsx`
Since this is a Client Component (`"use client"`), we will inject the pre-existing React Hook designed for this exact purpose:

1.  **Import Hook:** Add `import { useContactDetails } from "@/hooks/useContactDetails";`
2.  **Initialize Hook:** Call `const { contact } = useContactDetails();` inside the component.
3.  **Replace Hardcoded Strings:**
    *   Replace `hello@tamiladventure.com` with `{contact?.email || "hello@tamiladventure.com"}` (or an appropriate visual fallback).
    *   Replace `+91 98765 43210` with `{contact?.phone || "+91 98765 43210"}`.
    *   *Optional UX Improvement:* Make these text nodes active anchor links (`href={`mailto:${contact?.email}`}` and `href={`tel:${contact?.phone}`}`) so users can click them directly from the CTA.

### Step 2: Verification
1.  Run the TypeScript compiler (`npx tsc --noEmit`) to verify `contact` properties are safely accessed.
2.  Visually inspect the `/about` page where `EnquiryCTA` is rendered to confirm the contact details display correctly from the centralized state.
