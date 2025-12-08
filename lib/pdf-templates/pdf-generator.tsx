import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { InvoiceModern } from "./invoice-modern";

export type TemplateType = "modern";

interface GeneratePDFOptions {
  booking: TBooking;
  templateType?: TemplateType;
}

/**
 * Get the invoice component (only modern template available)
 */
function getInvoiceComponent(templateType: TemplateType, booking: TBooking) {
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
 * @returns Valid template type (always "modern")
 */
export function validateTemplateType(
  templateType: string | undefined
): TemplateType {
  // Only modern template is supported
  return "modern";
}
