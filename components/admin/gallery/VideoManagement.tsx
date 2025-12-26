"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Trash2, Upload, Loader2, PlayCircle } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  url: string;
  storagePath: string;
  createdAt: any;
}

const MAX_FILE_SIZE_MB = 45;
const MAX_VIDEOS = 40;

export function VideoManagement() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVideos = async () => {
    try {
      if (!db) return;
      const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedVideos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VideoItem[];
      setVideos(fetchedVideos);
    } catch (err) {
      console.error("Error loading videos:", err);
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 1. Check Video Limit
    if (videos.length >= MAX_VIDEOS) {
      setError(`Maximum limit of ${MAX_VIDEOS} videos reached. Delete some to add new ones.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Check File Size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setError(`File is too large (${fileSizeMB.toFixed(1)}MB). Max size is ${MAX_FILE_SIZE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for the video first.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Upload
    if (!storage || !db) {
      setError("Firebase storage is not configured.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storagePath = `gallery/videos/${timestamp}_${safeName}`;
      const fileRef = storageRef(storage, storagePath);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (uploadError) => {
          console.error(uploadError);
          setError("Upload failed. Please try again.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          if (db) {
            await addDoc(collection(db, "videos"), {
              title: title,
              url: downloadURL,
              storagePath: storagePath,
              createdAt: serverTimestamp(),
            });
            await loadVideos();
          }

          setUploading(false);
          setUploadProgress(0);
          setTitle("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      );

    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during upload.");
      setUploading(false);
    }
  };

  const handleDelete = async (video: VideoItem) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    if (!db || !storage) return;

    try {
      setLoading(true);
      // Delete from Storage
      if (video.storagePath) {
        const fileRef = storageRef(storage, video.storagePath);
        await deleteObject(fileRef).catch((err) => {
          console.warn("Failed to delete file from storage (might rely on ID only):", err);
        });
      }

      // Delete from Firestore
      await deleteDoc(doc(db, "videos", video.id));
      await loadVideos();
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete video.");
      setLoading(false);
    }
  };

  const currentCount = videos.length;
  const isLimitReached = currentCount >= MAX_VIDEOS;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Video</h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <Input
              placeholder="e.g. Hiking Summit Highlights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="w-full md:w-auto">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || isLimitReached || !title.trim()}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading {uploadProgress.toFixed(0)}%
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isLimitReached ? "Limit Reached" : "Select Video"}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Max file size: 45MB</span>
          <span>{currentCount} / {MAX_VIDEOS} videos used</span>
        </div>

        {uploading && (
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5">
            <div
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-900 relative">
              <video
                src={video.url}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              />
            </div>

            <div className="p-4">
              <h4 className="font-medium text-gray-900 truncate" title={video.title}>{video.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                Added: {video.createdAt?.toDate ? video.createdAt.toDate().toLocaleDateString() : 'Just now'}
              </p>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(video)}
                className="h-8 w-8 rounded-full shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {videos.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <PlayCircle className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            <p>No videos uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
