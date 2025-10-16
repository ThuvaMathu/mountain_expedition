import React, { useState, useEffect } from "react";
import {
  Star,
  Check,
  X,
  Edit3,
  Trash2,
  Filter,
  Search,
  Calendar,
  MapPin,
  Mountain,
  User,
  Eye,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  mountain?: string;
  rating: number;
  text: string;
  image?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: any;
  updatedAt?: any;
  email?: string;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<
    Testimonial[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>(
    []
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);

  // Mock data for when Firebase is not configured
  const mockTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      location: "California, USA",
      mountain: "Mount Kilimanjaro",
      rating: 5,
      text: "Tamil Adventure Treckking Club made my dream of climbing Kilimanjaro come true. The guides were incredible, and I felt safe every step of the way. Highly recommended!",
      image: "/placeholder.svg?height=80&width=80",
      status: "pending",
      createdAt: { toDate: () => new Date("2024-01-15") },
      email: "sarah@example.com",
    },
    {
      id: "2",
      name: "Michael Chen",
      location: "Singapore",
      mountain: "Everest Base Camp",
      rating: 5,
      text: "The Everest Base Camp trek was life-changing. The organization was flawless, and the team's expertise showed throughout the journey.",
      status: "approved",
      createdAt: { toDate: () => new Date("2024-01-10") },
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      location: "Madrid, Spain",
      mountain: "Aconcagua",
      rating: 4,
      text: "Professional, safe, and absolutely amazing experience. The Tamil Adventure Treckking Club team went above and beyond to ensure our success.",
      status: "rejected",
      createdAt: { toDate: () => new Date("2024-01-05") },
    },
  ];

  const loadTestimonials = async () => {
    if (!isFirebaseConfigured || !db) {
      setTestimonials(mockTestimonials);
      setFilteredTestimonials(mockTestimonials);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "testimonials"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const loadedTestimonials = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Testimonial[];

      setTestimonials(
        loadedTestimonials.length > 0 ? loadedTestimonials : mockTestimonials
      );
      setFilteredTestimonials(
        loadedTestimonials.length > 0 ? loadedTestimonials : mockTestimonials
      );
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
      setTestimonials(mockTestimonials);
      setFilteredTestimonials(mockTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonialStatus = async (
    id: string,
    status: "approved" | "rejected" | "pending"
  ) => {
    if (!isFirebaseConfigured || !db) {
      // Mock update for demo
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date() } : t
        )
      );
      return;
    }

    setActionLoading(id);
    try {
      await updateDoc(doc(db, "testimonials", id), {
        status,
        updatedAt: new Date(),
      });

      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date() } : t
        )
      );
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError("Failed to update testimonial");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!isFirebaseConfigured || !db) {
      // Mock delete for demo
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setShowDeleteConfirm(null);
      return;
    }

    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedTestimonials.length === 0) return;

    setActionLoading("bulk");

    if (action === "delete") {
      for (const id of selectedTestimonials) {
        await deleteTestimonial(id);
      }
    } else {
      for (const id of selectedTestimonials) {
        await updateTestimonialStatus(
          id,
          action === "approve" ? "approved" : "rejected"
        );
      }
    }

    setSelectedTestimonials([]);
    setActionLoading(null);
  };

  // Filter and search effects
  useEffect(() => {
    let filtered = testimonials;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.mountain?.toLowerCase().includes(query) ||
          t.text.toLowerCase().includes(query)
      );
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, filterStatus, searchQuery]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusCount = (status: FilterStatus) => {
    if (status === "all") return testimonials.length;
    return testimonials.filter((t) => t.status === status).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Testimonial Management
        </h1>
        <p className="text-gray-600">
          Review and manage customer testimonials and feedback submissions.
        </p>
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 rounded-md border border-yellow-200 bg-yellow-50 text-yellow-800 text-sm">
            Firebase not configured: Using demo data. Changes won't be saved.
          </div>
        )}
        {error && (
          <div className="mt-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["all", "pending", "approved", "rejected"] as FilterStatus[]).map(
          (status) => (
            <div
              key={status}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                filterStatus === status
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setFilterStatus(status)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">
                    {status === "all" ? "Total" : status}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getStatusCount(status)}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    status === "all"
                      ? "bg-blue-100"
                      : status === "pending"
                      ? "bg-yellow-100"
                      : status === "approved"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  {status === "all" ? (
                    <Star className="h-6 w-6 text-blue-600" />
                  ) : status === "pending" ? (
                    <Eye className="h-6 w-6 text-yellow-600" />
                  ) : status === "approved" ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : (
                    <X className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Bulk Actions */}
          {selectedTestimonials.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedTestimonials.length} selected
              </span>
              <button
                onClick={() => handleBulkAction("approve")}
                disabled={actionLoading === "bulk"}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                disabled={actionLoading === "bulk"}
                className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={actionLoading === "bulk"}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-xl shadow">
        {filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No testimonials found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "No testimonials match the current filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            {filteredTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`p-6 ${
                  index !== filteredTestimonials.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedTestimonials.includes(testimonial.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTestimonials((prev) => [
                          ...prev,
                          testimonial.id,
                        ]);
                      } else {
                        setSelectedTestimonials((prev) =>
                          prev.filter((id) => id !== testimonial.id)
                        );
                      }
                    }}
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />

                  {/* Profile Image */}
                  <img
                    src={
                      testimonial.image || "/placeholder.svg?height=60&width=60"
                    }
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=60&width=60";
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              testimonial.status
                            )}`}
                          >
                            {testimonial.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {testimonial.location}
                          </div>
                          {testimonial.mountain && (
                            <div className="flex items-center gap-1">
                              <Mountain className="h-4 w-4" />
                              {testimonial.mountain}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {testimonial.createdAt
                              ?.toDate?.()
                              ?.toLocaleDateString() || "N/A"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600">
                            ({testimonial.rating}/5)
                          </span>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          "{testimonial.text}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        {testimonial.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateTestimonialStatus(
                                  testimonial.id,
                                  "approved"
                                )
                              }
                              disabled={actionLoading === testimonial.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() =>
                                updateTestimonialStatus(
                                  testimonial.id,
                                  "rejected"
                                )
                              }
                              disabled={actionLoading === testimonial.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {testimonial.status === "approved" && (
                          <>
                            <button
                              onClick={() =>
                                updateTestimonialStatus(
                                  testimonial.id,
                                  "pending"
                                )
                              }
                              disabled={actionLoading === testimonial.id}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Pending"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        {/* <button
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-5 w-5" />
                        </button> */}

                        <button
                          onClick={() => setShowDeleteConfirm(testimonial.id)}
                          disabled={actionLoading === testimonial.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this testimonial? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTestimonial(showDeleteConfirm)}
                disabled={actionLoading === showDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading === showDeleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
