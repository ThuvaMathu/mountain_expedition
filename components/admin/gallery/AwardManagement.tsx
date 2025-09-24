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
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Upload, Trash2, Edit, Award, X, Check } from "lucide-react";
import { processImages } from "@/lib/image-processor";

type AwardItem = {
  id?: string;
  title: string;
  description: string;
  image: string;
  createdAt?: any;
};

export function AwardManagement() {
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const loadAwards = async () => {
    if (!isFirebaseConfigured || !db) {
      setAwards([]);
      setDataLoading(false);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "awards"));
      const awardItems = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AwardItem, "id">),
      }));
      setAwards(awardItems);
    } catch (error) {
      console.error("Error loading awards:", error);
      setAwards([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadAwards();
  }, []);

  const upload = async () => {
    if (!file || !title.trim() || !description.trim()) {
      alert("Please fill in all fields and select an image");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";
      const processedFile = await processImages(file, {
        aspectRatio: "original",
        targetSizeKB: 350,
      });
      if (isFirebaseConfigured && storage) {
        const storageRef = ref(
          storage,
          `awards/${Date.now()}_${processedFile[0].name}`
        );
        await uploadBytes(storageRef, processedFile[0]);
        imageUrl = await getDownloadURL(storageRef);
      } else {
        imageUrl = URL.createObjectURL(processedFile[0]); // demo blob URL
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        image: imageUrl,
        createdAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        setAwards((prev) => [
          { ...payload, id: `demo_${Date.now()}` } as AwardItem,
          ...prev,
        ]);
      } else {
        await addDoc(collection(db, "awards"), payload);
        await loadAwards();
      }

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this award?")) return;

    try {
      if (!isFirebaseConfigured || !db) {
        setAwards((prev) => prev.filter((item) => item.id !== id));
      } else {
        await deleteDoc(doc(db, "awards", id));
        await loadAwards();
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const startEdit = (award: AwardItem) => {
    setEditingAward(award);
    setEditTitle(award.title);
    setEditDescription(award.description);
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingAward(null);
    setEditTitle("");
    setEditDescription("");
    setEditFile(null);
  };

  const saveEdit = async () => {
    if (!editingAward || !editTitle.trim() || !editDescription.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setEditLoading(true);

    try {
      let imageUrl = editingAward.image;

      // Upload new image if provided
      if (editFile && isFirebaseConfigured && storage) {
        const storageRef = ref(
          storage,
          `awards/${Date.now()}_${editFile.name}`
        );
        await uploadBytes(storageRef, editFile);
        imageUrl = await getDownloadURL(storageRef);
      } else if (editFile) {
        imageUrl = URL.createObjectURL(editFile); // demo blob URL
      }

      const updatedData = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        image: imageUrl,
        updatedAt: serverTimestamp(),
      };

      if (!isFirebaseConfigured || !db) {
        setAwards((prev) =>
          prev.map((award) =>
            award.id === editingAward.id ? { ...award, ...updatedData } : award
          )
        );
      } else {
        await updateDoc(doc(db, "awards", editingAward.id!), updatedData);
        await loadAwards();
      }

      cancelEdit();
    } catch (e) {
      console.error(e);
      alert("Update failed");
    } finally {
      setEditLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-24 bg-gray-200 rounded mb-4 animate-pulse"></div>
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
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
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
        <h2 className="text-lg font-semibold text-gray-900">Add New Award</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Award Image *
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Award Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., National Mountaineering Excellence Award"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the award and achievement..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-vertical"
            required
          />
        </div>
        <Button
          onClick={upload}
          disabled={!file || !title.trim() || !description.trim() || loading}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? "Uploading..." : "Add Award"}
        </Button>
      </div>

      {/* Awards List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Awards & Recognition</h2>
        {awards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No awards yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((award) => (
              <div
                key={award.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={award.image || "/placeholder.svg"}
                    alt={award.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {award.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {award.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(award)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(award.id)}
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

      {/* Edit Modal */}
      {editingAward && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Award
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Image
                </label>
                <img
                  src={editingAward.image || "/placeholder.svg"}
                  alt={editingAward.title}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                  placeholder="Choose new image (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Award Title *
                </label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Award title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Award description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-vertical"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={saveEdit}
                  disabled={
                    !editTitle.trim() || !editDescription.trim() || editLoading
                  }
                  className="bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
