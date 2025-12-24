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

type PosterItem = {
  id?: string;
  title: string;
  url: string;
  createdAt?: any;
};

export function PostersManagement() {
  const [items, setItems] = useState<PosterItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const loadPosterItems = async () => {
    if (!isFirebaseConfigured || !db) {
      setItems([]);
      setDataLoading(false);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "posters"));
      const posterItems = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<PosterItem, "id">),
      }));
      setItems(posterItems);
    } catch (error) {
      console.error("Error loading posters:", error);
      setItems([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadPosterItems();
  }, []);

  const upload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      let url = "";
      // Posters might be large background images, so allow larger size
      const processedFiles = await processImages(file, {
        aspectRatio: "original",
        targetSizeKB: 500, 
      });
      const processedFile = processedFiles[0];

      if (isFirebaseConfigured && storage) {
        const storageRef = ref(storage, `posters/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, processedFile); // Use processed file
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
          { ...payload, id: `demo_${Date.now()}` } as PosterItem,
          ...prev,
        ]);
      } else {
        await addDoc(collection(db, "posters"), payload);
        await loadPosterItems();
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
    if (!confirm("Delete this poster?")) return;

    try {
      if (!isFirebaseConfigured || !db) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        await deleteDoc(doc(db, "posters", id));
        await loadPosterItems();
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
          </div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Upload New Poster
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Landscape preferred)
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
              placeholder="Poster title (e.g. Dubai Horizon)"
            />
          </div>
        </div>
        <Button
          onClick={upload}
          disabled={!file || loading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? "Uploading..." : "Upload Poster"}
        </Button>
      </div>

      {/* Gallery Items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Current Posters</h2>
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No posters uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                <div className="aspect-video w-full relative">
                    <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                  <div className="font-bold text-gray-900 mb-2 truncate">
                    {item.title}
                  </div>
                  <div className="flex justify-end">
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
