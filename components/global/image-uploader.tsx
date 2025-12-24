"use client";

import React, { useRef, useState, useEffect } from "react";
import { storage } from "@/lib/firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { X } from "lucide-react";
import { on } from "events";
import { processImages } from "@/lib/image-processor";

interface ImageUploaderProps {
  isMulti?: boolean;
  bucketName: string;
  onImageUpload: (urls: string[]) => void;
  initialUrls?: string[];
  generateThumbnail?: boolean;
  onThumbnailGenerated?: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isMulti = false,
  bucketName,
  onImageUpload,
  initialUrls = [],
  generateThumbnail = false,
  onThumbnailGenerated,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([...initialUrls]);
  const uploadedUrlsRef = useRef<string[]>([...initialUrls]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Only update uploadedUrls when initialUrls actually changes
  useEffect(() => {
    setUploadedUrls([...initialUrls]);
    uploadedUrlsRef.current = [...initialUrls];
  }, [initialUrls]);

  const handleFileSelect: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = e.target.files;
    if (!files || !storage) return;

    const fileList = Array.from(files);
    if (!isMulti) {
      setSelectedFiles([fileList[0]]);
    } else {
      setSelectedFiles((prev) => [...prev, ...fileList]);
    }

    // Upload files sequentially or parallel? Parallel is fine.
    // For thumbnail, we only generate for the FIRST image if no images exist yet, OR the first one in this batch.
    // Let's generate for the first file in this batch if we don't have a thumbnail or just typically the first one.

    // We will generate thumbnail for the first file in the list
    if (generateThumbnail && onThumbnailGenerated && fileList.length > 0) {
      // Process thumbnail in parallel
      uploadThumbnail(fileList[0]).catch(console.error);
    }

    await Promise.all(fileList.map((file) => uploadFile(file)));
  };

  const uploadThumbnail = async (file: File) => {
    try {
      console.log("Generating thumbnail...");
      // Generate 500px width thumbnail (16:9 approx)
      const processed = await processImages(file, {
        width: 500,
        height: 281, // 16:9 aspect ratio
        targetSizeKB: 50, // Small size
        outputFormat: "image/webp"
      });

      const key = `${bucketName}/thumbnails/${Date.now()}_thumb_${processed[0].name}`;
      const refObj = storageRef(storage!, key);
      await uploadBytesResumable(refObj, processed[0]);
      const url = await getDownloadURL(refObj);

      if (onThumbnailGenerated) {
        onThumbnailGenerated(url);
      }
      console.log("Thumbnail generated:", url);
    } catch (error) {
      console.error("Thumbnail generation failed:", error);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);

      const processed = await processImages(file, {
        aspectRatio: "16:9",
        targetSizeKB: 350,
      });

      const key = `${bucketName}/${Date.now()}_${processed[0].name.replace(
        /\s+/g,
        "_"
      )}`;
      const refObj = storageRef(storage!, key);
      const task = uploadBytesResumable(refObj, processed[0]);

      return new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snap) => {
            const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
            setUploadProgress(Number(pct.toFixed(0)));
          },
          (err) => {
            console.error("Upload failed:", err);
            setUploading(false);
            reject(err);
          },
          async () => {
            const url = await getDownloadURL(task.snapshot.ref);
            const tempUrls = [...uploadedUrls, url];
            // Note: In React state updates are async, so using callback form or ref is better if multiple updates happen fast.
            // But for now, we rely on parent to handle source of truth or just local update. 
            // Better: passing functional update to setUploadedUrls isn't enough because we need to call onImageUpload with new list.
            // We'll trust the prop callback re-renders or we just append locally correctly.
            // Actually, we should probably read the LATEST uploadedUrls. This simplistic logic has a race condition if multiple files upload at once.
            // Fix: modify based on prev state.
            // Update via Ref to avoid race conditions
            const newUrls = [...uploadedUrlsRef.current, url];
            uploadedUrlsRef.current = newUrls;

            setUploadedUrls(newUrls);
            onImageUpload(newUrls);

            setUploading(false);
            resolve();
          }
        );
      });
    } catch (e) {
      console.error("Error uploading file:", e);
      setUploading(false);
    }
  };

  const removeImage = async (index: number) => {
    const urlToRemove = uploadedUrls[index];
    if (!confirm("Remove this image?")) return;

    try {
      if (urlToRemove.startsWith("https://")) {
        const r = storageRef(storage!, urlToRemove);
        await deleteObject(r);
      }
    } catch (e) {
      console.warn("Couldn't delete from storage:", e);
    }
    const tempUrls = uploadedUrlsRef.current.filter((_, i) => i !== index);
    uploadedUrlsRef.current = tempUrls;
    setUploadedUrls(tempUrls);
    onImageUpload(tempUrls);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload {isMulti ? "Images" : "Image"}
      </label>

      <input
        type="file"
        accept="image/*"
        multiple={isMulti}
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
      />

      {uploading && (
        <div className="mt-2 text-xs text-gray-500">
          Uploading... {uploadProgress}%
        </div>
      )}

      {uploadedUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
