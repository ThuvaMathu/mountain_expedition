import imageCompression from "browser-image-compression";

export type AspectRatio = "1:1" | "4:3" | "16:9" | "3:4" | "original";

export interface ProcessImageOptions {
  aspectRatio?: AspectRatio; // ✅ optional
  targetSizeKB?: number;
  outputFormat?: "image/jpeg" | "image/png" | "image/webp";
}

/**
 * Predefined standard sizes for aspect ratios
 */
const ASPECT_RATIO_SIZES: Record<
  Exclude<AspectRatio, "original">,
  { width: number; height: number }
> = {
  "1:1": { width: 720, height: 720 }, // square (retina)
  "4:3": { width: 800, height: 600 }, // landscape
  "16:9": { width: 1280, height: 720 }, // wide landscape
  "3:4": { width: 720, height: 960 }, // portrait
};

/**
 * Process one or many images: resize + compress to standard aspect ratio
 */
export async function processImages(
  files: File | File[],
  {
    aspectRatio = "original", // ✅ default: keep original size
    targetSizeKB = 250,
    outputFormat = "image/jpeg",
  }: ProcessImageOptions
): Promise<File[]> {
  console.log("Processing images ...");
  const inputFiles = Array.isArray(files) ? files : [files];

  const processed = await Promise.all(
    inputFiles.map(async (file) => {
      // Load image
      const imageBitmap = await createImageBitmap(file);

      let targetWidth = imageBitmap.width;
      let targetHeight = imageBitmap.height;

      // Override only if aspect ratio is provided
      if (aspectRatio !== "original") {
        const preset = ASPECT_RATIO_SIZES[aspectRatio];
        targetWidth = preset.width;
        targetHeight = preset.height;
      }

      // Step 1: draw into canvas with fixed size
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context not found");
      }

      ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

      // Step 2: canvas → Blob
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          outputFormat,
          1
        );
      });

      // Step 3: compress to target size
      const compressedFile = await imageCompression(
        new File([blob], file.name, { type: outputFormat }),
        {
          maxSizeMB: targetSizeKB / 1024,
          maxWidthOrHeight: Math.max(targetWidth, targetHeight),
          useWebWorker: true,
        }
      );

      console.log("Processing images done.");
      return compressedFile;
    })
  );

  return processed;
}
