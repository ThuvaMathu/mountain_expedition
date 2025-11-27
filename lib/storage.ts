// Initialize Google Cloud Storage

import { adminStorage } from "./firebase-admin";

//const bucketName = process.env.GCS_BUCKET_NAME || "";
const bucket = adminStorage.bucket();

/**
 * Upload PDF to Google Cloud Storage
 * @param pdfBuffer - PDF file buffer
 * @param bookingId - Booking ID for filename
 * @returns Signed URL of uploaded PDF (valid for 7 days)
 */
interface UploadPDFResult {
  path: string;
  url: string;
}
export async function uploadPDFToStorage(
  pdfBuffer: Buffer,
  bookingId: string
): Promise<UploadPDFResult> {
  try {
    const fileName = `invoice_${bookingId}_${Date.now()}.pdf`;
    const storagePath = `receipts/${fileName}`;
    const file = bucket.file(storagePath);
    // Upload the PDF
    await file.save(pdfBuffer, {
      metadata: {
        contentType: "application/pdf",
      },
    });

    // Generate a signed URL (valid for 7 days)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    });

    console.log(`✅ PDF uploaded successfully: ${fileName}`);
    return {
      path: storagePath,
      url: url,
    };
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error(`Failed to upload PDF: ${error}`);
  }
}

/**
 * Upload image to Google Cloud Storage
 * @param imageBuffer - Image file buffer
 * @param fileName - Custom filename
 * @param contentType - MIME type (e.g., 'image/jpeg', 'image/png')
 * @returns Signed URL of uploaded image (valid for 7 days)
 */
export async function uploadImageToStorage(
  imageBuffer: Buffer,
  fileName: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  try {
    const file = bucket.file(`images/${fileName}`);

    // Upload the image
    await file.save(imageBuffer, {
      metadata: {
        contentType: contentType,
      },
    });

    // Generate a signed URL (valid for 7 days)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    });

    console.log(`✅ Image uploaded successfully: ${fileName}`);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(`Failed to upload image: ${error}`);
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param filePath - Path to file in bucket (e.g., 'invoices/invoice_123.pdf')
 */
export async function deleteFileFromStorage(filePath: string): Promise<void> {
  try {
    await bucket.file(filePath).delete();
    console.log(`✅ File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error(`Failed to delete file: ${error}`);
  }
}

/**
 * Generate a new signed URL for an existing file
 * @param filePath - Path to file in bucket
 * @param expirationDays - Number of days until expiration (default: 7)
 * @returns Signed URL
 */
export async function generateSignedUrl(
  filePath: string,
  expirationDays: number = 7
): Promise<string> {
  try {
    const [url] = await bucket.file(filePath).getSignedUrl({
      action: "read",
      expires: Date.now() + expirationDays * 24 * 60 * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${error}`);
  }
}
