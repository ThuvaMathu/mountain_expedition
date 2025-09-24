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
import {
  Upload,
  Trash2,
  Eye,
  Check,
  X,
  Star,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

type GalleryItem = {
  id?: string;
  title: string;
  url: string;
  mountainId?: string;
  createdAt?: any;
};

interface ExperienceSubmission {
  id: string;
  title: string;
  description: string;
  mountainName: string;
  rating: number;
  images: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: any;
  userName: string;
  userEmail: string;
  adminNotes?: string;
}

export function GalleryManagement() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [experienceSubmissions, setExperienceSubmissions] = useState<
    ExperienceSubmission[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [mountainId, setMountainId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"gallery" | "experiences">(
    "experiences"
  );

  const load = async () => {
    if (!isFirebaseConfigured || !db) {
      setItems([]);
      setExperienceSubmissions([
        {
          id: "exp1",
          title: "Amazing Everest Base Camp Trek",
          description:
            "The journey to Everest Base Camp was absolutely incredible. The views were breathtaking and the experience was life-changing. I would highly recommend this expedition to anyone looking for an adventure of a lifetime.",
          mountainName: "Mount Everest",
          rating: 5,
          images: ["/placeholder.svg"],
          status: "pending",
          submittedAt: new Date(),
          userName: "John Doe",
          userEmail: "john@example.com",
        },
        {
          id: "exp2",
          title: "Kilimanjaro Summit Success",
          description:
            "Reached the summit of Kilimanjaro after 6 days of challenging but rewarding climbing. The sunrise from Uhuru Peak was unforgettable.",
          mountainName: "Mount Kilimanjaro",
          rating: 4,
          images: ["/placeholder.svg", "/placeholder.svg"],
          status: "approved",
          submittedAt: new Date(Date.now() - 86400000),
          userName: "Sarah Smith",
          userEmail: "sarah@example.com",
          adminNotes: "Great experience story, approved for gallery display.",
        },
      ]);
      return;
    }

    try {
      // Load gallery items
      const snap = await getDocs(collection(db, "gallery"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));

      const experiencesSnap = await getDocs(
        collection(db, "experienceSubmissions")
      );
      const experiences: ExperienceSubmission[] = experiencesSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as any)
      );
      setExperienceSubmissions(experiences);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      let url = "";
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
        mountainId: mountainId || undefined,
        createdAt: serverTimestamp(),
      };
      if (!isFirebaseConfigured || !db) {
        setItems((prev) => [
          { ...payload, id: `demo_${Date.now()}` } as any,
          ...prev,
        ]);
      } else {
        await addDoc(collection(db, "gallery"), payload as any);
        await load();
      }
      setFile(null);
      setTitle("");
      setMountainId("");
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
        await load();
      }
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };

  const handleExperienceAction = async (
    experienceId: string,
    action: "approve" | "reject",
    notes?: string
  ) => {
    try {
      const newStatus = action === "approve" ? "approved" : "rejected";

      if (!isFirebaseConfigured || !db) {
        // Demo mode
        setExperienceSubmissions((prev) =>
          prev.map((exp) =>
            exp.id === experienceId
              ? { ...exp, status: newStatus, adminNotes: notes }
              : exp
          )
        );
      } else {
        // Update in Firestore
        await updateDoc(doc(db, "experienceSubmissions", experienceId), {
          status: newStatus,
          adminNotes: notes || "",
          reviewedAt: serverTimestamp(),
        });
        await load();
      }

      setSelectedExperience(null);
      setAdminNotes("");
    } catch (error) {
      console.error("Error updating experience:", error);
      alert("Failed to update experience status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-600">
          Manage gallery images and review user experience submissions.
        </p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Demo Mode: Data won't persist.
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("experiences")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "experiences"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Experience Submissions (
              {
                experienceSubmissions.filter((exp) => exp.status === "pending")
                  .length
              }{" "}
              pending)
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "gallery"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gallery Images ({items.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Experience Submissions
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    {
                      experienceSubmissions.filter(
                        (exp) => exp.status === "pending"
                      ).length
                    }{" "}
                    Pending Review
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {
                      experienceSubmissions.filter(
                        (exp) => exp.status === "approved"
                      ).length
                    }{" "}
                    Approved
                  </span>
                </div>
              </div>

              {experienceSubmissions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No experience submissions yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {experienceSubmissions.map((experience) => (
                    <div
                      key={experience.id}
                      className="border border-gray-200 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {experience.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {experience.mountainName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            By {experience.userName} •{" "}
                            {new Date(
                              experience.submittedAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                              experience.status
                            )}`}
                          >
                            {getStatusIcon(experience.status)}
                            {experience.status}
                          </span>
                          <div className="flex items-center">
                            {[...Array(experience.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-3">
                        {experience.description}
                      </p>

                      {experience.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {experience.images.slice(0, 3).map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Experience ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                          {experience.images.length > 3 && (
                            <div className="flex items-center justify-center bg-gray-100 rounded text-sm text-gray-600">
                              +{experience.images.length - 3} more
                            </div>
                          )}
                        </div>
                      )}

                      {experience.adminNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Admin Notes:</strong>{" "}
                            {experience.adminNotes}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedExperience(experience)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>

                        {experience.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleExperienceAction(experience.id, "approve")
                              }
                              className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleExperienceAction(experience.id, "reject")
                              }
                              className="flex items-center gap-1"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-6">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mountain ID (optional)
                    </label>
                    <Input
                      value={mountainId}
                      onChange={(e) => setMountainId(e.target.value)}
                      placeholder="Link to mountain"
                    />
                  </div>
                </div>
                <Button
                  onClick={upload}
                  disabled={!file || loading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Gallery Images</h2>
                {items.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No images yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <img
                          src={it.url || "/placeholder.svg"}
                          alt={it.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                          <div className="font-medium">{it.title}</div>
                          {it.mountainId && (
                            <div className="text-xs text-gray-600">
                              Mountain: {it.mountainId}
                            </div>
                          )}
                          <div className="mt-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => remove(it.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Review Experience Submission
                </h2>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {selectedExperience.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <strong>Mountain:</strong>{" "}
                      {selectedExperience.mountainName}
                    </p>
                    <p>
                      <strong>Submitted by:</strong>{" "}
                      {selectedExperience.userName} (
                      {selectedExperience.userEmail})
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(
                        selectedExperience.submittedAt
                      ).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <strong>Rating:</strong>
                      {[...Array(selectedExperience.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <span
                    className={`px-4 py-2 rounded-full font-medium flex items-center gap-2 ${getStatusColor(
                      selectedExperience.status
                    )}`}
                  >
                    {getStatusIcon(selectedExperience.status)}
                    {selectedExperience.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedExperience.description}
                </p>
              </div>

              {selectedExperience.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Images ({selectedExperience.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedExperience.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Experience ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this submission..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-vertical"
                />
              </div>

              {selectedExperience.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() =>
                      handleExperienceAction(
                        selectedExperience.id,
                        "approve",
                        adminNotes
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve & Publish
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleExperienceAction(
                        selectedExperience.id,
                        "reject",
                        adminNotes
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedExperience(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
