"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  Save,
  Edit3,
  AlertCircle,
  Mountain,
  Users,
  Award,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";

// Predefined stats that admin can manage
const PREDEFINED_STATS = [
  {
    id: "mountains-conquered",
    title: "Mountains Conquered",
    defaultValue: "50+",
    defaultDescription: "Across all seven continents",
    icon: Mountain,
  },
  {
    id: "happy-climbers",
    title: "Happy Climbers",
    defaultValue: "2,000+",
    defaultDescription: "Successfully guided to summits",
    icon: Users,
  },
  {
    id: "years-experience",
    title: "Years Experience",
    defaultValue: "15",
    defaultDescription: "In professional mountaineering",
    icon: Award,
  },
  {
    id: "countries",
    title: "Countries",
    defaultValue: "25+",
    defaultDescription: "Where we operate expeditions",
    icon: Globe,
  },
  {
    id: "successful-expeditions",
    title: "Successful Expeditions",
    defaultValue: "500+",
    defaultDescription: "Completed with zero incidents",
    icon: Calendar,
  },
  {
    id: "base-camps-established",
    title: "Base Camps Established",
    defaultValue: "100+",
    defaultDescription: "Across challenging terrains",
    icon: MapPin,
  },
];

const emptyStat: TStat = {
  title: "",
  value: "",
  description: "",
};

export function StatsManagement() {
  const [stats, setStats] = useState<TStat[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    value: string;
    description: string;
  }>({
    value: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const loadStats = async () => {
    if (!isFirebaseConfigured || !db) {
      // Demo mode - use predefined stats
      setStats(
        PREDEFINED_STATS.map((stat) => ({
          id: stat.id,
          title: stat.title,
          value: stat.defaultValue,
          description: stat.defaultDescription,
        }))
      );
      return;
    }

    try {
      const snap = await getDocs(collection(db, "stats"));
      const existingStats = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as TStat[];

      setStats(existingStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const initializePredefinedStats = async () => {
    if (!isFirebaseConfigured || !db) return;

    setInitializing(true);
    try {
      const snap = await getDocs(collection(db, "stats"));
      const existingStatsIds = snap.docs.map((doc) => doc.id);

      // Add missing predefined stats
      for (const predefinedStat of PREDEFINED_STATS) {
        if (!existingStatsIds.includes(predefinedStat.id)) {
          await setDoc(doc(db, "stats", predefinedStat.id), {
            title: predefinedStat.title,
            value: predefinedStat.defaultValue,
            description: predefinedStat.defaultDescription,
          });
        }
      }

      await loadStats();
    } catch (error) {
      console.error("Error initializing predefined stats:", error);
      alert("Failed to initialize predefined stats");
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    loadStats().catch(console.error);
  }, []);

  const startEdit = (stat: TStat) => {
    setEditingId(stat.id || null);
    setEditForm({
      value: stat.value,
      description: stat.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ value: "", description: "" });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    setLoading(true);
    try {
      const updateData = {
        value: editForm.value,
        description: editForm.description,
      };

      if (!isFirebaseConfigured || !db) {
        // Demo mode update
        setStats((prev) =>
          prev.map((stat) =>
            stat.id === editingId ? { ...stat, ...updateData } : stat
          )
        );
        cancelEdit();
        return;
      }

      await updateDoc(doc(db, "stats", editingId), updateData as any);
      await loadStats();
      cancelEdit();
    } catch (error) {
      console.error("Error updating stat:", error);
      alert("Failed to update stat");
    } finally {
      setLoading(false);
    }
  };

  const getPredefinedStat = (id: string) => {
    return PREDEFINED_STATS.find((stat) => stat.id === id);
  };

  // Check if all predefined stats exist
  const missingStats = PREDEFINED_STATS.filter(
    (predefined) => !stats.some((stat) => stat.id === predefined.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Statistics Management
        </h1>
        <p className="text-gray-600">
          Update values and descriptions for predefined statistics. Contact
          admin to change titles.
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">Important Notes:</p>
            <ul className="text-blue-700 space-y-1 list-disc list-inside">
              <li>
                You can only edit <strong>values</strong> and{" "}
                <strong>descriptions</strong>
              </li>
              <li>Stat titles are fixed and cannot be changed</li>
              <li>
                Contact the developer to modify titles or add new stat
                categories
              </li>
              <li>All changes are immediately reflected on the website</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Initialize Missing Stats */}
      {missingStats.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-800 font-medium">
                Missing Predefined Stats
              </h3>
              <p className="text-yellow-700 text-sm">
                {missingStats.length} predefined stats are missing from your
                database.
              </p>
            </div>
            <Button
              onClick={initializePredefinedStats}
              disabled={initializing}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {initializing ? "Initializing..." : "Initialize Stats"}
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREDEFINED_STATS.map((predefinedStat) => {
          const currentStat = stats.find((s) => s.id === predefinedStat.id);
          const isEditing = editingId === predefinedStat.id;
          const IconComponent = predefinedStat.icon;

          if (!currentStat) {
            // Show placeholder for missing stats
            return (
              <div
                key={predefinedStat.id}
                className="bg-gray-100 rounded-xl shadow p-6 opacity-50"
              >
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mr-3">
                    <IconComponent className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      {predefinedStat.title}
                    </h3>
                    <p className="text-sm text-gray-500">Not initialized</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">
                    Initialize stats to manage this item
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={currentStat.id}
              className="bg-white rounded-xl shadow p-6"
            >
              {/* Header with Icon and Title */}
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mr-3">
                  <IconComponent className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {currentStat.title}
                  </h3>
                  <p className="text-sm text-gray-500">Fixed title</p>
                </div>
              </div>

              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <Input
                      value={editForm.value}
                      onChange={(e) =>
                        setEditForm({ ...editForm, value: e.target.value })
                      }
                      placeholder="e.g., 50+, 2,000+, 15 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Brief description of this statistic"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={saveEdit}
                      disabled={loading}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">
                    {currentStat.value}
                  </div>
                  <div className="text-sm text-gray-600 mb-4 min-h-[2.5rem]">
                    {currentStat.description || "No description"}
                  </div>
                  <Button
                    onClick={() => startEdit(currentStat)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent w-full"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Values
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview Section */}
      {stats.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Live Preview
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            This is how your stats will appear on the website:
          </p>

          {/* Mini preview of stats section */}
          <div className="bg-teal-600 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.slice(0, 6).map((stat, index) => {
                const predefined = getPredefinedStat(stat.id || "");
                const IconComponent = predefined?.icon || Mountain;

                return (
                  <div
                    key={stat.id || index}
                    className="text-center text-white"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white bg-opacity-20 rounded-full mb-2">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium mb-1">{stat.title}</div>
                    {stat.description && (
                      <div className="text-teal-100 text-xs">
                        {stat.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
