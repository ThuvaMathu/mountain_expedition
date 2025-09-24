"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Trash2 } from "lucide-react";
import { processImages } from "@/lib/image-processor";

type GalleryItem = {
  id?: string;
  title: string;
  url: string;
  mountainId?: string;
  createdAt?: any;
};

export function GalleryImageManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const loadGalleryItems = async () => {
    if (!isFirebaseConfigured || !db) {
      setItems([]);
      setDataLoading(false);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "gallery"));
      const galleryItems = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GalleryItem, "id">),
      }));
      setItems(galleryItems);
    } catch (error) {
      console.error("Error loading gallery items:", error);
      setItems([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const upload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      let url = "";
      const processedFile = await processImages(file, {
        aspectRatio: "original",
        targetSizeKB: 250,
      });
      if (isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      } else {
        url = URL.createObjectURL(file); // demo blob URL
      }

      const payload = {
        title: title || file.name,
        url,
        createdAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        setItems((prev) => [
          { ...payload, id: `demo_${Date.now()}` } as GalleryItem,
          ...prev,
        ]);
      } else {
        await addDoc(collection(db, "gallery"), payload);
        await loadGalleryItems();
      }

      setFile(null);
      setTitle("");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this image?")) return;

    try {
      if (!isFirebaseConfigured || !db) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        await deleteDoc(doc(db, "gallery", id));
        await loadGalleryItems();
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  if (dataLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Upload New Image
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mountain ID (optional)
            </label>
            <Input
              value={mountainId}
              onChange={(e) => setMountainId(e.target.value)}
              placeholder="Link to mountain"
            />
          </div> */}
        </div>
        <Button
          onClick={upload}
          disabled={!file || loading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Gallery Items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No images yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <div className="font-medium text-gray-900 mb-1">
                    {item.title}
                  </div>
                  {item.mountainId && (
                    <div className="text-xs text-gray-600 mb-2">
                      Mountain: {item.mountainId}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(item.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
