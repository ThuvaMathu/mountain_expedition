import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { InvoiceModern } from "./invoice-modern";
import { InvoiceClassic } from "./invoice-classic";
import { InvoiceElegant } from "./invoice-elegant";

export type TemplateType = "modern" | "classic" | "elegant";

interface GeneratePDFOptions {
  booking: TBooking;
  templateType?: TemplateType;
}

/**
 * Get the invoice component based on template type
 */
function getInvoiceComponent(templateType: TemplateType, booking: TBooking) {
  if (templateType === "classic") {
    return <InvoiceClassic booking={booking} />;
  }
  if (templateType === "elegant") {
    return <InvoiceElegant booking={booking} />;
  }
  return <InvoiceModern booking={booking} />;
}

/**
 * Generate PDF invoice from booking data
 * @param options - Booking data and template type
 * @returns PDF buffer
 */
export async function generateInvoicePDF(
  options: GeneratePDFOptions
): Promise<Buffer> {
  const { booking, templateType = "modern" } = options;

  try {
    // Get the appropriate invoice component
    const invoiceDocument = getInvoiceComponent(templateType, booking);

    // Render PDF to buffer
    const pdfBuffer = await renderToBuffer(invoiceDocument);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
}

/**
 * Validate template type
 * @param templateType - Template type to validate
 * @returns Valid template type or default
 */
export function validateTemplateType(
  templateType: string | undefined
): TemplateType {
  const validTypes: TemplateType[] = ["modern", "classic", "elegant"];

  if (templateType && validTypes.includes(templateType as TemplateType)) {
    return templateType as TemplateType;
  }

  // Default to modern if invalid or undefined
  return "modern";
}
