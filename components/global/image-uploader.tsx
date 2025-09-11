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

interface ImageUploaderProps {
  isMulti?: boolean;
  bucketName?: string;
  onImageUpload: (urls: string[]) => void;
  initialUrls?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  isMulti = false,
  bucketName = "uploads",
  onImageUpload,
  initialUrls = [],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([...initialUrls]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Only update uploadedUrls when initialUrls actually changes
  useEffect(() => {
    setUploadedUrls([...initialUrls]);
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

    await Promise.all(fileList.map((file) => uploadFile(file)));
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      const key = `${bucketName}/${Date.now()}_${file.name.replace(
        /\s+/g,
        "_"
      )}`;
      const refObj = storageRef(storage!, key);
      const task = uploadBytesResumable(refObj, file);

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
            onImageUpload(tempUrls);
            setUploadedUrls(tempUrls);
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
    const tempUrls = uploadedUrls.filter((_, i) => i !== index);
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
