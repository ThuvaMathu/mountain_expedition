"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  Save,
  Edit3,
  Mountain,
  Users,
  Award,
  Globe,
  MapPin,
  Heart,
  Plane,
} from "lucide-react";
import { defaultStats } from "@/services/default-values";

// Predefined stats for each section
const PREDEFINED_STATS = defaultStats;

const ICON_MAP: Record<string, any> = {
  Mountain,
  Users,
  Award,
  Globe,
  MapPin,
  Heart,
  Plane,
};

export function StatsManagement() {
  const [activeSection, setActiveSection] = useState<TStatSection>("landing");
  const [stats, setStats] = useState<Record<TStatSection, TStat[]>>({
    landing: [],
    international: [],
    domestic: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    value: string;
    description: string;
  }>({ value: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const loadStats = async (section: TStatSection) => {
    if (!isFirebaseConfigured || !db) {
      setStats((prev) => ({
        ...prev,
        [section]: PREDEFINED_STATS[section],
      }));
      return;
    }

    try {
      const snap = await getDocs(collection(db, "stats", section, "items"));
      const loadedStats = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as TStat[];
      setStats((prev) => ({ ...prev, [section]: loadedStats }));
    } catch (error) {
      console.error(`Error loading ${section} stats:`, error);
    }
  };

  const initializeSection = async (section: TStatSection) => {
    if (!isFirebaseConfigured || !db) return;

    setInitializing(true);
    try {
      const snap = await getDocs(collection(db, "stats", section, "items"));
      const existingIds = snap.docs.map((d) => d.id);

      for (const stat of PREDEFINED_STATS[section]) {
        if (!existingIds.includes(stat.id!)) {
          await setDoc(doc(db, "stats", section, "items", stat.id!), {
            title: stat.title,
            value: stat.value,
            description: stat.description || "",
            icon: stat.icon,
            order: stat.order,
          });
        }
      }

      await loadStats(section);
    } catch (error) {
      console.error(`Error initializing ${section} stats:`, error);
      alert(`Failed to initialize ${section} stats`);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    loadStats(activeSection);
  }, [activeSection]);

  const startEdit = (stat: TStat) => {
    setEditingId(stat.id || null);
    setEditForm({ value: stat.value, description: stat.description || "" });
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
        setStats((prev) => ({
          ...prev,
          [activeSection]: prev[activeSection].map((s) =>
            s.id === editingId ? { ...s, ...updateData } : s
          ),
        }));
        cancelEdit();
        return;
      }

      await updateDoc(
        doc(db, "stats", activeSection, "items", editingId),
        updateData as any
      );
      await loadStats(activeSection);
      cancelEdit();
    } catch (error) {
      console.error("Error updating stat:", error);
      alert("Failed to update stat");
    } finally {
      setLoading(false);
    }
  };

  const currentStats = stats[activeSection];
  const missingStats = PREDEFINED_STATS[activeSection].filter(
    (p) => !currentStats.some((s) => s.id === p.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Statistics Management
        </h1>
        <p className="text-gray-600">Manage stats for different sections</p>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {(["landing", "international", "domestic"] as TStatSection[]).map(
            (section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors capitalize ${
                  activeSection === section
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {section}
              </button>
            )
          )}
        </div>
      </div>

      {/* Initialize Button */}
      {missingStats.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-yellow-800 font-medium">Missing Stats</h3>
              <p className="text-yellow-700 text-sm">
                {missingStats.length} stats need initialization
              </p>
            </div>
            <Button
              onClick={() => initializeSection(activeSection)}
              disabled={initializing}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {initializing ? "Initializing..." : "Initialize Stats"}
            </Button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PREDEFINED_STATS[activeSection].map((predefined) => {
          const stat = currentStats.find((s) => s.id === predefined.id);
          const isEditing = editingId === predefined.id;
          const IconComponent = ICON_MAP[predefined?.icon!] || Mountain;

          if (!stat) {
            return (
              <div
                key={predefined.id}
                className="bg-gray-100 rounded-lg p-4 opacity-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      {predefined.title}
                    </h3>
                    <p className="text-xs text-gray-500">Not initialized</p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={stat.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{stat.title}</h3>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <Input
                      value={editForm.value}
                      onChange={(e) =>
                        setEditForm({ ...editForm, value: e.target.value })
                      }
                      placeholder="e.g., 50+, $799+"
                    />
                  </div>
                  {activeSection === "landing" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={saveEdit}
                      disabled={loading}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 flex-1"
                    >
                      <Save className="h-3 w-3 mr-1" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-teal-600 mb-1">
                    {stat.value}
                  </div>
                  {activeSection === "landing" && stat.description && (
                    <div className="text-xs text-gray-600 mb-3">
                      {stat.description}
                    </div>
                  )}
                  <Button
                    onClick={() => startEdit(stat)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
