"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Eye, Check, X, Star, Clock, CheckCircle, XCircle } from "lucide-react";

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

export function ExperienceManagement() {
  const [experienceSubmissions, setExperienceSubmissions] = useState<
    ExperienceSubmission[]
  >([]);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const loadExperiences = async () => {
    if (!isFirebaseConfigured || !db) {
      setExperienceSubmissions([]);
      setLoading(false);
      return;
    }

    try {
      const experiencesSnap = await getDocs(
        collection(db, "experienceSubmissions")
      );
      const experiences: ExperienceSubmission[] = experiencesSnap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as ExperienceSubmission)
      );
      setExperienceSubmissions(experiences);
    } catch (error) {
      console.error("Error loading experiences:", error);
      setExperienceSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleExperienceAction = async (
    experienceId: string,
    action: "approve" | "reject",
    notes?: string
  ) => {
    try {
      const newStatus = action === "approve" ? "approved" : "rejected";

      if (!isFirebaseConfigured || !db) {
        setExperienceSubmissions((prev) =>
          prev.map((exp) =>
            exp.id === experienceId
              ? { ...exp, status: newStatus, adminNotes: notes }
              : exp
          )
        );
      } else {
        await updateDoc(doc(db, "experienceSubmissions", experienceId), {
          status: newStatus,
          adminNotes: notes || "",
          reviewedAt: serverTimestamp(),
        });
        await loadExperiences();
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

  const pendingCount = experienceSubmissions.filter(
    (exp) => exp.status === "pending"
  ).length;

  const approvedCount = experienceSubmissions.filter(
    (exp) => exp.status === "approved"
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          User Experience Submissions
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            {pendingCount} Pending Review
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {approvedCount} Approved
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
                    {new Date(experience.submittedAt).toLocaleDateString()}
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
                    <strong>Admin Notes:</strong> {experience.adminNotes}
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

      {/* Experience Review Modal */}
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
