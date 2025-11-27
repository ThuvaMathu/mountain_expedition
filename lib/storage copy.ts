import { adminStorage } from "./firebase-admin";

interface UploadPDFResult {
  path: string;
  url: string;
}

/**
 * Upload PDF buffer to Firebase Storage using Admin SDK
 * @param pdfBuffer - PDF file buffer
 * @param bookingId - Unique booking ID for filename
 * @returns Object with storage path and download URL
 */
export async function uploadPDFToStorage(
  pdfBuffer: Buffer,
  bookingId: string
): Promise<UploadPDFResult> {
  try {
    if (!adminStorage) {
      throw new Error("Firebase Admin Storage is not initialized");
    }

    const bucket = adminStorage.bucket();

    // Create file path
    const fileName = `${bookingId}.pdf`;
    const storagePath = `receipts/${fileName}`;
    const file = bucket.file(storagePath);

    // Upload PDF with metadata
    await file.save(pdfBuffer, {
      contentType: "application/pdf",
      metadata: {
        metadata: {
          bookingId: bookingId,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make file publicly readable
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    return {
      path: storagePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error("Error uploading PDF to storage:", error);
    throw new Error(`Failed to upload PDF: ${error}`);
  }
}

/**
 * Delete PDF from Firebase Storage using Admin SDK
 * @param storagePath - Path to the file in storage
 */
export async function deletePDFFromStorage(storagePath: string): Promise<void> {
  try {
    if (!adminStorage) {
      throw new Error("Firebase Admin Storage is not initialized");
    }

    const bucket = adminStorage.bucket();
    const file = bucket.file(storagePath);

    await file.delete();

    console.log(`✅ Deleted PDF: ${storagePath}`);
  } catch (error) {
    console.error("Error deleting PDF from storage:", error);
    throw new Error(`Failed to delete PDF: ${error}`);
  }
}
